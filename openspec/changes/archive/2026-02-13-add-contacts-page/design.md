## Context

L'applicazione usa Next.js 15 App Router con Server Components. Abbiamo già implementato:
- Fetch contatti da Brevo API: `lib/brevo/fetchContacts.js`, `lib/brevo/mapBrevoToContact.js`
- Sistema di caching SQLite per campagne: `lib/db.js`, `lib/repositories/campaigns.js`
- Pagina campagne con lista e metriche aggregate: `app/campaigns/page.js`

**Problema attuale:**
- I contatti possono essere fetchati ma non c'è UI per visualizzarli
- La logica di caching in `lib/repositories/campaigns.js` è specifica per le campagne (70 linee di codice ripetibile)
- Se vogliamo cachare contatti, automation, liste → duplicazione codice

**Architettura esistente:**
- `lib/db.js`: database SQLite con WAL mode, tabelle `campaigns` e `cache_metadata`
- `lib/repositories/campaigns.js`: cache-or-fetch con TTL 15 min, fallback su stale cache, logging
- Repository pattern: UI chiama `getCampaigns()` invece di fetch diretto

## Goals / Non-Goals

**Goals:**
- Creare pagina `/contacts` con visualizzazione lista contatti e metriche aggregate
- Astrarre il pattern di caching in una funzione generica `getOrSetCache(key, fetchFn, ttl)`
- Implementare `lib/repositories/contacts.js` usando la funzione generica
- Refactorare `lib/repositories/campaigns.js` per usare la funzione generica (eliminare duplicazione)
- Supportare caching multi-entità con database schema generico

**Non-Goals:**
- Filtering/sorting avanzato dei contatti (solo lista base per MVP)
- Paginazione lato client (fetch tutto, come per campagne)
- CRUD operations sui contatti (solo read-only per ora)
- Caching di altre entità oltre contatti/campagne (automation, liste verranno dopo)

## Decisions

### Decision 1: Funzione generica getOrSetCache

**Rationale:** Attualmente `campaigns.js` ha 65 linee di logica cache-or-fetch. Se duplichiamo per contatti → 130 linee. Per 5 entità → 325 linee. Astrazione elimina ~80% duplicazione.

**Alternatives considered:**
- Class-based repository: più verboso, less idiomatic per JS moderno
- HOF (Higher-Order Function): simile ma meno flessibile per opzioni custom
- Mantenere duplicazione: tech debt insostenibile

**Implementation:**
```javascript
// lib/cache/repository.js
export async function getOrSetCache(options) {
  const {
    cacheKey,       // 'campaigns' | 'contacts' | ...
    fetchFn,        // async () => data
    getCachedFn,    // () => { data, timestamp } | null
    saveCachedFn,   // (data) => void
    ttlMinutes = 15
  } = options

  // 1. Check cache
  const cached = getCachedFn()
  if (cached && !isStale(cached.timestamp, ttlMinutes)) {
    console.log(`[Cache HIT] ${cacheKey}`)
    return cached.data
  }

  // 2. Fetch fresh data
  try {
    const fresh = await fetchFn()
    saveCachedFn(fresh)
    return fresh
  } catch (error) {
    // 3. Fallback to stale cache
    if (cached) return cached.data
    throw error
  }
}
```

**Benefits:**
- DRY: logica cache-or-fetch in UN solo posto
- Testabilità: funzione pura, facile da unit test
- Estensibilità: aggiungere nuove entità = 10 linee invece di 65

### Decision 2: Database schema generico

**Rationale:** Invece di duplicare tabelle (`campaigns`, `contacts`, `automation`...), usiamo un pattern generico con una tabella per entità.

**Schema:**
```sql
-- Manteniamo tabelle separate per entità (NOT a single generic table)
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY,
  data TEXT NOT NULL,       -- JSON serialized
  created_at INTEGER NOT NULL
);

-- Metadata già esistente supporta multiple keys
-- cache_metadata.key = 'campaigns' | 'contacts' | ...
```

**Alternatives considered:**
- Single table con `entity_type` column: peggio per indexing, query più lente
- NoSQL/Document store: overkill, SQLite è perfetto per use case

**Rationale per tabelle separate:**
- Indexing migliore (id specifico per tipo)
- Query più veloci (no need to filter by entity_type)
- Schema evolution più semplice (modifiche a contacts non impattano campaigns)

**Implementation:**
```javascript
// lib/db.js - Funzioni generiche
export function saveEntity(tableName, data) {
  const db = getDb()
  const now = Date.now()
  const jsonData = JSON.stringify(data)

  const saveData = db.transaction(() => {
    db.prepare(`INSERT OR REPLACE INTO ${tableName} (id, data, created_at) VALUES (1, ?, ?)`).run(jsonData, now)
    db.prepare(`INSERT OR REPLACE INTO cache_metadata (key, timestamp, ttl_minutes) VALUES (?, ?, 15)`).run(tableName, now)
  })

  saveData()
}

export function getCachedEntity(tableName) {
  // ... similar generic implementation
}
```

### Decision 3: UI structure per contacts

**Rationale:** Replicare il pattern di `app/campaigns/page.js` per consistenza. Lista con metriche aggregate in header.

**Structure:**
```
app/contacts/
├── page.js              # Server Component (fetch from repository)
├── ContactList.js       # Client Component (table view)
└── ContactStatsHeader.js # Metriche aggregate (total, blacklisted, etc.)
```

**Metriche aggregate da mostrare:**
- Total contacts
- Email blacklisted count
- Created this month
- Average... (TBD based on available data)

**Alternatives considered:**
- Card view invece di table: meno efficiente per grandi liste
- Infinite scroll: over-engineering per MVP

**Implementation pattern:**
```javascript
// app/contacts/page.js
import { getContacts } from '@/lib/repositories/contacts'

export default async function ContactsPage() {
  const contacts = await getContacts()
  const metrics = calculateContactMetrics(contacts)

  return (
    <>
      <ContactStatsHeader metrics={metrics} />
      <ContactList contacts={contacts} />
    </>
  )
}
```

### Decision 4: Refactoring strategy

**Rationale:** Refactorare `campaigns.js` per usare `getOrSetCache()` senza rompere funzionalità esistente.

**Migration approach:**
1. Creare `lib/cache/repository.js` con `getOrSetCache()`
2. Creare `lib/repositories/contacts.js` usando la nuova funzione (test su entità nuova)
3. Refactorare `lib/repositories/campaigns.js` per usare `getOrSetCache()` (preserve behavior)
4. Verificare build e cache behavior invariato

**Rollback plan:** Se refactoring campaigns rompe qualcosa, possiamo mantenere vecchia implementazione e usare solo per contacts.

## Risks / Trade-offs

**[Risk]** Refactoring campaigns potrebbe introdurre regressioni → **Mitigation:** Testare cache HIT/MISS/STALE con build multipli prima di committare

**[Risk]** Database schema generico potrebbe non scalare per entità complesse (es. relazioni) → **Mitigation:** Per MVP accettabile; futuro: valutare se servono relational tables

**[Trade-off]** Astrazione aggiunge layer di indirection → **Acceptable:** Beneficio di DRY supera costo di complessità minima (funzione di 40 linee)

**[Trade-off]** UI contacts replicata da campaigns (duplicazione componenti) → **Acceptable:** Per MVP va bene; futuro: componentize shared UI patterns

**[Risk]** Contacts table potrebbe crescere più di campaigns (più rows) → **Mitigation:** SQLite gestisce milioni di rows senza problemi; futuro: implementare cleanup periodico

## Migration Plan

**Deploy:**
1. Creare `lib/cache/repository.js` (nuovo file, no breaking changes)
2. Creare schema `contacts` table in `lib/db.js` (auto-created on first run)
3. Creare `lib/repositories/contacts.js` e UI contacts
4. Build e test cache behavior per contacts
5. Refactorare `campaigns.js` per usare `getOrSetCache()`
6. Build e verificare cache behavior campaigns invariato
7. Deploy

**Rollback:**
- Facile: revertare codice, database cache può essere cancellato senza data loss

**Backward compatibility:**
- ✅ Nessun breaking change: campaigns continua a funzionare identico
- ✅ Database schema extends, non modifica
