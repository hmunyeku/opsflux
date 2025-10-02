-- ============================================
-- OPSFLUX - INITIALISATION BASE DE DONNÉES
-- ============================================

-- Extensions PostgreSQL utiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Configuration locale française
SET lc_messages TO 'fr_FR.UTF-8';
SET lc_monetary TO 'fr_FR.UTF-8';
SET lc_numeric TO 'fr_FR.UTF-8';
SET lc_time TO 'fr_FR.UTF-8';

-- Configuration timezone
SET timezone TO 'UTC';

-- Schémas personnalisés (optionnel)
-- CREATE SCHEMA IF NOT EXISTS core;
-- CREATE SCHEMA IF NOT EXISTS modules;
-- CREATE SCHEMA IF NOT EXISTS audit;

-- Messages de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Base de données OpsFlux initialisée';
    RAISE NOTICE '✅ Extensions PostgreSQL installées';
    RAISE NOTICE '✅ Configuration locale appliquée';
END $$;
