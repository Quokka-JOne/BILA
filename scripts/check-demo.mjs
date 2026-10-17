import assert from 'node:assert/strict'

const baseURL = process.env.BILA_TEST_URL ?? 'http://localhost:3000'
const origin = process.env.BILA_TEST_ORIGIN ?? new URL(baseURL).origin
let cookie = ''
async function session(body, method = 'POST', requestOrigin = origin) {
  const response = await fetch(baseURL + '/api/demo/session', {
    method, headers: { Origin: requestOrigin, 'Content-Type': 'application/json', Cookie: cookie },
    body: body ? JSON.stringify(body) : undefined,
  })
  const cookies = response.headers.getSetCookie()
  if (method === 'POST' && response.ok) {
    assert.ok(cookies.some(value => /HttpOnly/i.test(value)))
    if (origin.startsWith('https://')) assert.ok(cookies.some(value => /; Secure/i.test(value)))
  }
  if (cookies.length) cookie = cookies.map(value => value.split(';')[0]).join('; ')
  return response
}
async function home() {
  return fetch(baseURL + '/espacio', { headers: { Cookie: cookie }, redirect: 'manual' })
}
const credentials = { email: 'demo-check@example.com', password: 'DemoBila2026' }
assert.equal((await home()).status, 307, 'Home exige pasar por el acceso')
assert.equal((await session({ action: 'login', ...credentials, email: 'invalido' })).status, 400)
for (const password of ['corta', 'demobila2026', 'DEMOBILA2026', 'DemoSinNumeros']) {
  assert.equal((await session({ action: 'login', ...credentials, password })).status, 400)
}
assert.equal((await session({ action: 'login', ...credentials }, 'POST', 'https://otro.example')).status, 403)
assert.equal((await session({ action: 'register', ...credentials, role: 'persona' })).status, 400, 'No se omiten pasos de perfil')
const profiles = {
  persona: { birthDate: '1998-05-12', phone: '55551234', emergencyName: 'Contacto Demo', emergencyRelation: 'Familia', emergencyPhone: '55555678', deviceType: 'anillo' },
  rescatista: { organization: 'Equipo Demo', verifier: 'contacto@example.com', consent: true },
  coordinador: { organization: 'Equipo Demo', position: 'Coordinación', approver: 'contacto@example.com', consent: true },
}
for (const [role, profile] of Object.entries(profiles)) {
  const response = await session({ action: 'register', ...credentials, firstName: 'Prueba', lastName: 'Demo', role, profile })
  assert.equal(response.status, 200, `Registro ${role}: ${await response.text()}`)
  const page = await home()
  assert.equal(page.status, 200)
  const content = await page.text()
  assert.match(content, /Hola, /)
  assert.match(content, /Monitoreo de signos vitales/)
  assert.match(content, /Modo demostración/)
}
// La sesión no acepta modificaciones del perfil desde la cookie.
const signedCookie = cookie
cookie += 'x'
assert.equal((await home()).status, 307)
cookie = signedCookie
assert.equal((await session(null, 'DELETE')).status, 200)
assert.equal((await home()).status, 307)
assert.equal((await session({ action: 'login', ...credentials, email: 'sin-cuenta-previa@example.com' })).status, 200)
assert.equal((await home()).status, 200)
await session(null, 'DELETE')
console.log('OK: tres roles, correo reutilizado, acceso sin cuenta previa, validación de credenciales, sesión firmada y cierre de sesión.')
