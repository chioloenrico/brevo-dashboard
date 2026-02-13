## Context

Il progetto utilizza Next.js 15 con App Router. La pagina `app/campaigns/page.js` è attualmente un Server Component che utilizza dati mock. La funzione `mapBrevoToCampaign` è già disponibile in `lib/brevo/mapBrevoToCampaign.js` per trasformare i dati dall'API Brevo nel formato utilizzato dai componenti.

L'API Key Brevo è configurata in `.env.local` come `BREVO_API_KEY`. L'endpoint dell'API è `https://api.brevo.com/v3/emailCampaigns` e richiede autenticazione tramite header `api-key`.

**Vincoli:**
- Next.js 15 App Router con Server Components
- Nessuna nuova dipendenza esterna (utilizzare `fetch` nativo)
- Le variabili d'ambiente sono disponibili solo lato server
- I componenti client (`CampaignList`, `CampaignStatsHeader`) si aspettano già il formato trasformato

## Goals / Non-Goals

**Goals:**
- Creare una funzione che recupera le campagne dall'API Brevo utilizzando l'API Key da variabili d'ambiente
- Applicare `mapBrevoToCampaign` a ogni campagna restituita per trasformarla nel formato atteso
- Integrare il fetch nella pagina `app/campaigns/page.js` sostituendo i mock
- Gestire errori API (rete, autenticazione, rate limiting)
- Gestire stati di caricamento durante il fetch
- Mantenere la sicurezza dell'API Key (non esporla al client)

**Non-Goals:**
- Caching o revalidation avanzata (utilizzare il caching di Next.js di default)
- Paginazione o filtri API (recuperare tutte le campagne disponibili)
- Retry logic complessa (gestione base degli errori)
- Rate limiting avanzato (gestione base)
- Refresh automatico dei dati (dati statici per richiesta)

## Decisions

### 1. Server Component async vs API Route

**Decisione**: Utilizzare Server Component async per il fetch diretto

**Rationale**:
- Più semplice: fetch diretto nel componente senza layer aggiuntivo
- Migliore performance: meno round trip, dati caricati durante il rendering
- Accesso diretto alle variabili d'ambiente senza configurazione aggiuntiva
- Pattern raccomandato in Next.js 15 App Router per fetch dati
- I componenti client ricevono già i dati trasformati come props

**Alternative considerate**:
- API Route (`app/api/campaigns/route.js`): Aggiungerebbe complessità non necessaria, richiederebbe chiamata client-side aggiuntiva, e non offre vantaggi per questo caso d'uso
- Client Component con fetch: Non può accedere alle variabili d'ambiente in modo sicuro, esporrebbe l'API Key

### 2. Posizionamento della funzione fetch

**Decisione**: Creare `lib/brevo/fetchCampaigns.js` come funzione utility riutilizzabile

**Rationale**:
- Separazione delle responsabilità: logica API separata dal componente
- Riutilizzabile: può essere utilizzata in altri componenti o API routes in futuro
- Testabile: funzione pura facile da testare
- Coerenza: segue il pattern già stabilito con `mapBrevoToCampaign` in `lib/brevo/`

**Alternative considerate**:
- Fetch inline nel componente: Meno riutilizzabile e più difficile da testare
- API Route separata: Aggiunge complessità senza benefici per questo caso

### 3. Gestione errori e stati di caricamento

**Decisione**: Gestire errori nel Server Component e passare stato errore ai componenti client tramite props

**Rationale**:
- Server Components possono gestire errori durante il fetch
- I componenti client possono mostrare UI appropriata per errori/loading
- Pattern semplice e diretto senza bisogno di error boundaries complessi per questo caso

**Alternative considerate**:
- Error Boundary: Più complesso, non necessario per questo caso d'uso semplice
- Throw error e gestire globalmente: Meno controllo granulare

### 4. Formato risposta e trasformazione

**Decisione**: La funzione `fetchCampaigns` restituirà un array di campagne già trasformate usando `mapBrevoToCampaign`

**Rationale**:
- Incapsula la logica di trasformazione nella funzione fetch
- Il componente riceve dati già nel formato corretto
- Coerenza: tutti i dati passano attraverso la stessa trasformazione
- Facilita manutenzione: un solo punto dove applicare la trasformazione

**Alternative considerate**:
- Restituire dati raw e trasformare nel componente: Duplicherebbe la logica di trasformazione

### 5. Gestione API Key mancante

**Decisione**: Se `BREVO_API_KEY` non è presente, la funzione lancerà un errore descrittivo

**Rationale**:
- Fail fast: meglio identificare il problema subito
- Messaggio di errore chiaro per debugging
- Previene chiamate API senza autenticazione

**Alternative considerate**:
- Restituire array vuoto: Nasconderebbe il problema di configurazione

## Risks / Trade-offs

**[Risk]**: L'API Key potrebbe non essere configurata correttamente
- **Mitigation**: Verificare presenza della variabile d'ambiente e lanciare errore descrittivo se mancante

**[Risk]**: L'API Brevo potrebbe essere lenta o non disponibile
- **Mitigation**: Gestire timeout e errori di rete, mostrare messaggio di errore appropriato all'utente

**[Risk]**: Rate limiting dell'API Brevo
- **Mitigation**: Gestire risposta 429 (Too Many Requests) con messaggio appropriato. Per ora non implementiamo retry automatico.

**[Risk]**: La struttura della risposta API potrebbe cambiare
- **Mitigation**: La funzione `mapBrevoToCampaign` già gestisce casi edge. Aggiungere validazione base della risposta.

**[Trade-off]**: Fetch sincrono nel Server Component vs loading state
- **Scelta**: Utilizzare loading.tsx di Next.js per gestire lo stato di caricamento durante il fetch del Server Component

**[Risk]**: Dati non aggiornati se API cambia
- **Mitigation**: Utilizzare il caching di Next.js con revalidation appropriata (default: cache: 'force-cache' per SSG, o 'no-store' per SSR sempre aggiornato)

## Migration Plan

1. **Creare la funzione** `lib/brevo/fetchCampaigns.js`:
   - Verificare presenza `BREVO_API_KEY`
   - Chiamare API Brevo con header di autenticazione
   - Applicare `mapBrevoToCampaign` a ogni campagna
   - Gestire errori base (rete, autenticazione, rate limiting)

2. **Convertire `app/campaigns/page.js` in async Server Component**:
   - Aggiungere `async` alla funzione del componente
   - Chiamare `fetchCampaigns()` invece di usare mock
   - Gestire errori e passare stato errore se necessario

3. **Gestione loading state**:
   - Creare `app/campaigns/loading.js` per mostrare UI di caricamento durante il fetch
   - Opzionale: aggiungere gestione errori con `error.js` se necessario

4. **Testing**:
   - Testare con API Key valida
   - Testare con API Key mancante o invalida
   - Testare con errori di rete

**Rollback**: Se necessario, commentare il fetch e ripristinare i mock temporaneamente.

## Open Questions

- Dovremmo implementare caching esplicito o lasciare il default di Next.js? (Probabilmente lasciare default per ora)
- Dovremmo aggiungere un file `error.js` per gestione errori globale della route? (Opzionale, può essere aggiunto dopo)
- Dovremmo implementare revalidation periodica dei dati? (Non necessario per ora, può essere aggiunto in futuro)
- Dovremmo validare la struttura della risposta API prima di trasformarla? (Aggiungere validazione base per sicurezza)
