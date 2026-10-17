-- ============================================================
-- BILA · Esquema de base de datos
-- ============================================================

-- Las tablas de better-auth se crean mediante sus migraciones.
-- npm run db:local aplica esas migraciones antes de este esquema.

-- Perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
  user_id       TEXT PRIMARY KEY,
  role          TEXT NOT NULL CHECK (role IN ('persona', 'rescatista', 'coordinador')),
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  organization  TEXT,
  position_title TEXT,
  professional_id TEXT,
  verification_status TEXT NOT NULL DEFAULT 'not_required'
    CHECK (verification_status IN ('not_required', 'pending', 'approved', 'rejected')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS device_type TEXT
  CHECK (device_type IN ('pulsera', 'anillo'));

-- Detalles de perfil persona
CREATE TABLE IF NOT EXISTS persona_details (
  user_id             TEXT PRIMARY KEY REFERENCES profiles(user_id),
  birth_date          DATE,
  phone               TEXT,
  emergency_name      TEXT NOT NULL,
  emergency_relation  TEXT,
  emergency_phone     TEXT NOT NULL,
  medical_notes       TEXT,
  share_medical       BOOLEAN NOT NULL DEFAULT FALSE,
  share_location      BOOLEAN NOT NULL DEFAULT FALSE
);

-- Dispositivos BILA (pulseras / anillos)
CREATE TABLE IF NOT EXISTS devices (
  code       TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES profiles(user_id),
  linked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(code)
);

-- Solicitudes de verificación
CREATE TABLE IF NOT EXISTS verification_requests (
  id           SERIAL PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES profiles(user_id),
  role         TEXT NOT NULL,
  organization TEXT NOT NULL,
  reference    TEXT,
  status       TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at  TIMESTAMPTZ
);

-- ============================================================
-- Tablas operativas del ecosistema BILA
-- ============================================================

-- Emergencias activas
CREATE TABLE IF NOT EXISTS emergencies (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  severity     TEXT NOT NULL DEFAULT 'moderate'
    CHECK (severity IN ('low', 'moderate', 'high', 'critical')),
  status       TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'monitoring', 'resolved')),
  latitude     DOUBLE PRECISION,
  longitude    DOUBLE PRECISION,
  radius_km    DOUBLE PRECISION DEFAULT 5,
  created_by   TEXT REFERENCES profiles(user_id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at  TIMESTAMPTZ
);

-- Señales de dispositivos (ubicación, estado)
CREATE TABLE IF NOT EXISTS device_signals (
  id           SERIAL PRIMARY KEY,
  device_code  TEXT NOT NULL REFERENCES devices(code),
  latitude     DOUBLE PRECISION,
  longitude    DOUBLE PRECISION,
  signal_type  TEXT NOT NULL DEFAULT 'heartbeat'
    CHECK (signal_type IN ('heartbeat', 'emergency', 'manual')),
  battery_pct  SMALLINT,
  protocol     TEXT DEFAULT 'lorawan'
    CHECK (protocol IN ('lorawan', 'ble', 'gps', 'repeater')),
  received_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inventario de recursos de emergencia
CREATE TABLE IF NOT EXISTS supply_inventory (
  id            SERIAL PRIMARY KEY,
  emergency_id  INTEGER REFERENCES emergencies(id),
  category      TEXT NOT NULL
    CHECK (category IN ('water', 'food', 'medicine', 'shelter', 'equipment', 'other')),
  item_name     TEXT NOT NULL,
  quantity      INTEGER NOT NULL DEFAULT 0,
  unit          TEXT NOT NULL DEFAULT 'unidad',
  location_name TEXT,
  updated_by    TEXT REFERENCES profiles(user_id),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Distribución de recursos
CREATE TABLE IF NOT EXISTS supply_distributions (
  id            SERIAL PRIMARY KEY,
  inventory_id  INTEGER NOT NULL REFERENCES supply_inventory(id),
  recipient_id  TEXT REFERENCES profiles(user_id),
  quantity      INTEGER NOT NULL,
  distributed_by TEXT REFERENCES profiles(user_id),
  distributed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes         TEXT
);

-- Personas localizadas / estado de rescate
CREATE TABLE IF NOT EXISTS rescue_status (
  id            SERIAL PRIMARY KEY,
  person_id     TEXT NOT NULL REFERENCES profiles(user_id),
  emergency_id  INTEGER REFERENCES emergencies(id),
  status        TEXT NOT NULL DEFAULT 'missing'
    CHECK (status IN ('missing', 'located', 'rescued', 'hospitalized', 'safe')),
  priority      TEXT NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('critical', 'high', 'normal', 'low')),
  last_latitude  DOUBLE PRECISION,
  last_longitude DOUBLE PRECISION,
  located_by    TEXT REFERENCES profiles(user_id),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes         TEXT
);
