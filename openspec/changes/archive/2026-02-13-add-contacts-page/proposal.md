## Why

Attualmente abbiamo la funzionalità di fetch dei contatti (`lib/brevo/fetchContacts.js`) ma manca la UI per visualizzarli. Inoltre, il pattern di caching implementato per le campagne è duplicato e non riutilizzabile. Completare la verticale "Contatti" con UI e astrazione del caching permette di visualizzare i contatti in modo performante e prepara l'architettura per aggiungere nuove entità (Automation, Liste) senza duplicare codice.

## What Changes

- Creazione pagina `/contacts` con visualizzazione lista contatti
- Implementazione `lib/repositories/contacts.js` con caching (TTL 15 minuti)
- **Astrazione del pattern di caching**: estrazione della logica di cache-or-fetch in una funzione generica `getOrSetCache(key, fetchFn, ttl)` per riutilizzo
- Refactoring di `lib/repositories/campaigns.js` per usare la funzione generica
- Componenti UI per visualizzare contatti (lista, statistiche, filtri)

## Capabilities

### New Capabilities
- `contacts-display`: Visualizzazione contatti con lista, metriche aggregate, e integrazione con repository cached
- `generic-cache-repository`: Pattern di caching riutilizzabile con funzione `getOrSetCache()` per qualsiasi entità, gestione TTL, fallback su cache stale, e logging

### Modified Capabilities
<!-- Nessuna capability esistente viene modificata nei requirements -->

## Impact

**Nuovi file:**
- `app/contacts/page.js` - Server Component per pagina contatti
- `app/contacts/ContactList.js` - Client Component per lista contatti
- `app/contacts/ContactStatsHeader.js` - Componente per metriche aggregate
- `lib/repositories/contacts.js` - Repository con caching per contatti
- `lib/cache/repository.js` - Funzione generica `getOrSetCache()`

**File modificati:**
- `lib/repositories/campaigns.js` - Refactoring per usare `getOrSetCache()` invece di logica duplicata
- `lib/db.js` - Potenziale aggiunta di metodi generici `saveEntity()`, `getCachedEntity()` per supportare più tabelle

**Database:**
- Nuova tabella `contacts` per cache contatti (schema simile a `campaigns`)
- Possibile aggiornamento di `cache_metadata` per supportare multiple chiavi

**Performance:**
- Stesso beneficio del caching campagne: riduzione ~95% chiamate API
- Codice più mantenibile grazie all'astrazione (DRY principle)
