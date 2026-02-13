## Context

L'applicazione usa Next.js 15 App Router con Server Components. Attualmente, `app/campaigns/page.js` chiama direttamente `fetchCampaigns()` che fa una richiesta HTTP all'API Brevo ogni volta che la pagina viene renderizzata. Questo pattern è semplice ma inefficiente: ogni visita alla pagina genera una chiamata API, con rischi di rate-limiting e latenza.

L'architettura attuale:
- `lib/brevo/fetchCampaigns.js`: fetch + error handling
- `lib/brevo/mapBrevoToCampaign.js`: trasformazione dati
- `app/campaigns/page.js`: Server Component async che chiama fetch

Non esiste alcun layer di persistenza o caching. Vogliamo introdurre SQLite come database locale per cachare i dati e implementare un Repository Pattern che gestisca la logica di cache-or-fetch.

## Goals / Non-Goals

**Goals:**
- Implementare caching locale con SQLite per ridurre chiamate API
- Creare un Repository Pattern che astragga la logica di caching dalla UI
- Implementare TTL (Time To Live) per refresh automatico dei dati stantii
- Gestire automaticamente lo schema del database (creazione tabelle, migrazioni basic)
- Mantenere la compatibilità con il codice esistente (cambio minimo in campaigns/page.js)

**Non-Goals:**
- Caching distribuito o multi-istanza (è un'app single-instance)
- Cache invalidation manuale via UI
- Gestione complessa di migrazioni schema database
- Caching di altre entità oltre alle campagne (per ora)
- Sincronizzazione real-time con API (polling, webhooks)

## Decisions

### Decision 1: SQLite con better-sqlite3
**Rationale:** SQLite è ideale per caching locale: zero-config, embedded, performante. `better-sqlite3` è la libreria più usata e stabile per Node.js, con supporto sincrono (perfetto per Server Components).

**Alternatives considered:**
- Redis: overkill per single-instance, richiede server separato
- In-memory cache: persa al restart dell'app
- File-based JSON: più lento, no query capabilities
- Vercel KV: costo aggiuntivo, vendor lock-in

**Implementation:**
- Database file: `data/cache.db` (da aggiungere a `.gitignore`)
- Sincronous API: compatibile con Server Components Next.js
- Auto-migration: controllare se tabelle esistono, crearle se mancano

### Decision 2: Repository Pattern
**Rationale:** Separare la logica di business (cache-or-fetch) dalla UI. Il repository espone un'interfaccia pulita (`getCampaigns()`) e nasconde i dettagli di implementazione del caching.

**Alternatives considered:**
- Service Layer: simile ma più generico
- Mantenere logica in Server Component: mescola concerns, hard to test

**Implementation:**
```javascript
// lib/repositories/campaigns.js
export async function getCampaigns() {
  const cached = db.getCachedCampaigns()
  if (cached && !isStale(cached.timestamp)) {
    return cached.data
  }
  const fresh = await fetchCampaigns()
  db.saveCampaigns(fresh)
  return fresh
}
```

### Decision 3: Schema database
**Rationale:** Due tabelle: `campaigns` per i dati effettivi, `cache_metadata` per tracking timestamp e TTL.

**Schema:**
```sql
CREATE TABLE IF NOT EXISTS campaigns (
  id INTEGER PRIMARY KEY,
  data TEXT NOT NULL,  -- JSON serialized
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS cache_metadata (
  key TEXT PRIMARY KEY,
  timestamp INTEGER NOT NULL,
  ttl_minutes INTEGER NOT NULL DEFAULT 15
);
```

**Alternatives considered:**
- Singola tabella con timestamp in ogni row: ridondante
- Tabella per ogni campagna: troppo complesso per use case semplice

**Implementation:**
- Serializzare array campagne come JSON in colonna `data`
- Timestamp UNIX (millisecondi)
- Single-row per `campaigns` (chiave fissa: 'campaigns')

### Decision 4: TTL di 15 minuti
**Rationale:** Bilancio tra freshness e API usage. 15 minuti è abbastanza breve per dati "quasi-real-time" ma riduce drasticamente le chiamate API.

**Alternatives considered:**
- 5 minuti: troppo aggressivo, poco beneficio
- 60 minuti: troppo stale per dashboard
- Configurabile via env: over-engineering per MVP

**Implementation:**
- TTL fisso nel codice: `const DEFAULT_TTL = 15`
- Check: `Date.now() - cached.timestamp > TTL_MS`

### Decision 5: Gestione concorrenza
**Rationale:** better-sqlite3 gestisce nativamente la concorrenza write con locking. Non serve implementare locking custom.

**Implementation:**
- Usare WAL mode per performance: `db.pragma('journal_mode = WAL')`
- Single connection condivisa (pattern singleton in `lib/db.js`)

## Risks / Trade-offs

**[Risk]** Database file può crescere indefinitamente → **Mitigation:** Per MVP accettabile; futuro: implementare cleanup periodico (delete old rows)

**[Risk]** Dati stale se API cambia tra refresh → **Mitigation:** TTL di 15 min limita staleness; in futuro si può aggiungere force-refresh UI

**[Risk]** Database corrotto se app crasha durante write → **Mitigation:** SQLite con WAL mode è resistente; in worst case delete cache.db e ricostruisce

**[Risk]** First visit lento (cache miss) → **Acceptable:** Stesso comportamento attuale; cache warm dopo prima visita

**[Trade-off]** Più complessità vs performance → **Acceptable:** Il pattern repository è standard e testabile; beneficio performance giustifica la complessità

**[Trade-off]** Disk usage vs API calls → **Acceptable:** Cache.db di pochi MB vs rate limiting API

## Migration Plan

**Deploy:**
1. Installare dipendenza: `npm install better-sqlite3`
2. Creare directory `data/` se non esiste
3. Aggiungere `data/cache.db` a `.gitignore`
4. Deploy: il database viene creato automaticamente al primo boot
5. Comportamento: primo caricamento fa API call, successivi usano cache

**Rollback:**
- Facile: revertare codice, rimuovere dipendenza
- Nessun data loss: cache è solo per performance, non dati critici

**Backward compatibility:**
- ✅ Trasparente: l'interfaccia verso UI non cambia (async function che ritorna campaigns)
- ✅ No breaking changes
