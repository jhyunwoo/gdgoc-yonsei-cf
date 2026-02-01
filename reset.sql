-- 외래 키 체크 비활성화 (순서 상관없이 삭제하기 위해)
PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS "users_to_projects";
DROP TABLE IF EXISTS "users_to_parts";
DROP TABLE IF EXISTS "projects_to_tags";
DROP TABLE IF EXISTS "userToSession";
DROP TABLE IF EXISTS "external_participants";
DROP TABLE IF EXISTS "verification";
DROP TABLE IF EXISTS "account";
DROP TABLE IF EXISTS "session";
DROP TABLE IF EXISTS "sessions"; -- Domain sessions
DROP TABLE IF EXISTS "projects";
DROP TABLE IF EXISTS "tags";
DROP TABLE IF EXISTS "parts";
DROP TABLE IF EXISTS "generations";
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "__drizzle_migrations"; -- 마이그레이션 기록도 초기화

PRAGMA foreign_keys = ON;