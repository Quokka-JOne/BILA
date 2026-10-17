# BILA

## Desarrollo local

Requisitos: Node.js y npm.

```sh
npm ci
npm run db:local
```

Mantén esa terminal abierta. La primera ejecución prepara PostgreSQL local, crea
las tablas de autenticación y de BILA, y genera `.env.local` con claves locales.
Los datos se conservan en `.local/postgres` entre ejecuciones. Estos archivos
están excluidos de Git.

En otra terminal:

```sh
npm run dev
```

Abre http://localhost:3000. El registro está en `/registro`.
Usa Ctrl+C en cada terminal para detener los servidores.

## Demostración

Para la presentación, configura `NEXT_PUBLIC_BILA_DEMO_MODE=true` en `.env.local`
y reinicia la aplicación. Home corresponde a `app/espacio/page.tsx` (`/espacio`).

El modo demostración acepta cualquier correo con formato válido y contraseñas de
al menos 10 caracteres, con mayúscula, minúscula y número, sin necesitar una cuenta
previa. El registro mantiene sus pasos y valida los campos del perfil. La sesión
de demostración se guarda en una cookie firmada; no se guardan contraseñas ni los
datos médicos introducidos. El registro de rescatistas y coordinadores muestra
una confirmación de comprobación simulada antes de entrar a Home.

Los signos vitales, el dispositivo y las verificaciones son simulados. Hay un
aviso visible en acceso, registro y Home. Este modo no realiza mediciones ni
envía correos. Al cerrar sesión se elimina la sesión de demostración; un nuevo
inicio de sesión puede usar cualquier credencial válida y abre un perfil de
demostración de Persona.

Con la variable en `false` o ausente se utiliza Better Auth y PostgreSQL, y el
endpoint de acceso simulado queda deshabilitado. Recompila si cambias esta opción
en una instalación de producción.

Con la aplicación en marcha y el modo demostración activo, `npm run test:demo`
comprueba los tres tipos de registro, el acceso con credenciales válidas, la
validación de campos y el cierre de sesión, sin crear cuentas en la base de datos.

Si npm bloquea el script de instalación de PostgreSQL en Windows, ejecútalo antes
de iniciar la base:

```sh
node node_modules/@embedded-postgres/windows-x64/scripts/hydrate-symlinks.js
```

La base local escucha únicamente en `127.0.0.1:54329`. Es para pruebas locales.
Si ya existe `.env.local`, el script lo conserva: comprueba que `DATABASE_URL`
apunte a la base que quieres utilizar.

Para otros entornos configura `DATABASE_URL`, `BETTER_AUTH_URL` y
`BETTER_AUTH_SECRET`, aplica las migraciones de Better Auth y ejecuta
`lib/schema.sql` contra la base correspondiente.

## Publicación en Render

La presentación pública activa la demostración mediante `.env.production`, que
contiene únicamente `NEXT_PUBLIC_BILA_DEMO_MODE=true`. Si esa variable está definida
en el panel de Render, su valor tiene prioridad: usa `true` para la demostración.
La opción se incorpora al compilar, por lo que un cambio requiere reconstruir.

Usa `npm ci && npm run build` como comando de construcción y `npm start` para
arrancar el servicio web. `BETTER_AUTH_SECRET` debe configurarse como secreto en
Render. La demostración no necesita PostgreSQL: no crea cuentas ni guarda datos
médicos. `RENDER_EXTERNAL_URL` permite validar el origen HTTPS y configurar la
cookie de sesión detrás del proxy de Render.
