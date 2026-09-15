# HiCenter Database & Vector Store Disaster Recovery Runbook 💾

This document outlines the backup, restore, vector index recovery, secret management, and migration rollback strategy for the HiCenter multi-repository platform (`scala-backend` System of Record, `hicenter-ai` Intelligence microservice, and PostgreSQL + `pgvector`).

---

## 1. PostgreSQL & pgvector Backup Strategy

### A. Logical Dumps (Daily & Pre-Deployment)
Run daily scheduled logical backups targeting the primary PostgreSQL database:

```bash
# Create timestamped compressed dump
pg_dump -h localhost -p 5433 -U hicenter -d hicenter -Fc -v -f /backups/hicenter_$(date +%Y%m%d_%H%M%S).dump
```

- **Frequency**: Daily at 02:00 UTC and immediately prior to schema migrations.
- **Retention**: 7 daily snapshots, 4 weekly snapshots, 12 monthly archives.

### B. Continuous Write-Ahead Logging (WAL) & PITR
For Point-In-Time Recovery (PITR) with minimal Recovery Point Objective (RPO < 1 minute):

1. Configure `postgresql.conf`:
   ```ini
   wal_level = replica
   archive_mode = on
   archive_command = 'test ! -f /wal_archive/%f && cp %p /wal_archive/%f'
   ```
2. Take weekly base backups with `pg_basebackup`:
   ```bash
   pg_basebackup -h localhost -p 5433 -U hicenter -D /backups/basebackup -Ft -z -P
   ```

---

## 2. Restore Procedures

### A. Restoring from Logical Dump (`.dump`)

```bash
# 1. Terminate active backend database connections
psql -h localhost -p 5433 -U hicenter -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'hicenter';"

# 2. Re-create clean target database
psql -h localhost -p 5433 -U hicenter -d postgres -c "DROP DATABASE IF EXISTS hicenter;"
psql -h localhost -p 5433 -U hicenter -d postgres -c "CREATE DATABASE hicenter OWNER hicenter;"
psql -h localhost -p 5433 -U hicenter -d hicenter -c "CREATE EXTENSION IF NOT EXISTS vector;"

# 3. Restore database schema, tables, and data
pg_restore -h localhost -p 5433 -U hicenter -d hicenter -v -1 /backups/hicenter_20260915_020000.dump
```

### B. pgvector Index Recovery Implications
- `pgvector` tables (e.g. `study_note_embeddings`) and `hnsw` / `ivfflat` vector indexes are natively captured in PostgreSQL logical dumps.
- Following a restore operation, execute an index re-optimization command to ensure vector search query latency remains under 10ms:

```sql
REINDEX TABLE study_note_embeddings;
```

---

## 3. Environment & Secrets Management

Secrets must **NEVER** be committed to Git repositories or exposed to browser clients.

### Required Environment Variables

| Variable Name | Component | Usage |
| :--- | :--- | :--- |
| `PLAY_HTTP_SECRET_KEY` | `scala-backend` | Signing & validating JWT tokens (Min 32 bytes) |
| `INTERNAL_SERVICE_SECRET` | `scala-backend` & `hicenter-ai` | Service-to-service header authentication (`X-Internal-Service-Key`) |
| `POSTGRES_PASSWORD` | All Backends | PostgreSQL database authentication password |
| `OPENAI_API_KEY` | `hicenter-ai` | Fallback external LLM provider API key |

In production Kubernetes/Docker environments, inject these environment variables via HashiCorp Vault, AWS Secrets Manager, or GCP Secret Manager.

---

## 4. Migration Rollback Strategy

1. **Backwards Compatible Migrations**: Always execute schema additions in two phases (Add column as NULLable → Deploy code → Backfill data → Apply NOT NULL constraint).
2. **Play Evolutions Rollback**:
   - Each migration script in `conf/evolutions/default/` must contain both `# --- !Ups` and `# --- !Downs`.
   - In case of a failed deployment, run down-evolutions or restore from the pre-migration snapshot taken in Section 1A.
