## Why

Attualmente, ogni volta che un utente visita la pagina `/campaigns`, il sistema effettua una chiamata diretta all'API di Brevo. Questo espone l'applicazione a rischi di rate-limiting, rallenta il caricamento della pagina e crea una dipendenza forte dalla disponibilità dell'API esterna.

## What Changes

- Introduzione di **SQLite** come database locale leggero per persistere i dati delle campagne
- Creazione di un **Repository Pattern**: la UI non chiamerà più direttamente `fetchCampaigns`, ma un metodo `getCampaigns` che decide se leggere dal database o chiamare l'API
- Implementazione di una logica di **TTL (Time To Live)**: i dati vengono aggiornati dall'API solo se la copia locale è più vecchia di X minuti (es. 15 minuti)
- Creazione di una connessione SQLite con gestione automatica dello schema (tabelle per campagne e metadati di cache)

## Capabilities

### New Capabilities
- `local-data-persistence`: Capacità di salvare e leggere dati dal file system locale tramite SQLite, con gestione automatica dello schema e connessione al database
- `smart-caching`: Logica per determinare quando i dati in cache sono "stantii" e necessitano di un refresh dall'API, basata su timestamp e TTL configurabile

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- **Nuova dipendenza**: `better-sqlite3` (libreria standard per Node.js, nativa e performante)
- **Nuovi file**:
  - `lib/db.js` (connessione e setup database SQLite)
  - `lib/repositories/campaigns.js` (repository pattern con logica di caching)
- **Modifiche**:
  - `app/campaigns/page.js` userà il repository invece del fetcher diretto
- **Database file**: `data/cache.db` (creato automaticamente, da aggiungere a .gitignore)
- **Performance**: Caricamento iniziale più veloce, riduzione drastica delle chiamate API
- **Resilienza**: L'applicazione continua a funzionare anche se l'API Brevo è temporaneamente non disponibile (serve dati dalla cache)
