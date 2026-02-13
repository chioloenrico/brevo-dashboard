## Why

Attualmente il progetto utilizza dati mock per le campagne email. Per rendere il dashboard funzionale e visualizzare dati reali, è necessario integrare l'API Brevo per recuperare le campagne email. L'API Key è già configurata nel file `.env.local` e la funzione `mapBrevoToCampaign` è già disponibile per trasformare i dati. È il momento di sostituire i mock con chiamate API reali per completare l'integrazione con Brevo.

## What Changes

- Creazione di una funzione per chiamare l'API Brevo (`https://api.brevo.com/v3/emailCampaigns`) per recuperare le campagne email
- La funzione utilizzerà l'API Key da `process.env.BREVO_API_KEY` per l'autenticazione
- La funzione applicherà `mapBrevoToCampaign` a ogni campagna restituita dall'API per trasformarla nel formato utilizzato dai componenti
- Integrazione della funzione nella pagina `app/campaigns/page.js` per sostituire i dati mock
- Gestione degli stati di caricamento e degli errori durante il fetch
- La funzione sarà implementata come Server Component o API Route in Next.js per accedere alle variabili d'ambiente in modo sicuro

## Capabilities

### New Capabilities
- `brevo-api-fetch`: Funzione che recupera le campagne email dall'API Brevo, gestisce l'autenticazione con API Key, applica la trasformazione dei dati tramite `mapBrevoToCampaign`, e gestisce errori e stati di caricamento.

### Modified Capabilities
- `campaign-list-display`: La pagina delle campagne passerà da utilizzare dati mock a utilizzare dati reali dall'API. Questo non modifica i requisiti di visualizzazione ma cambia la fonte dei dati.
- `campaign-metrics-display`: Analogamente, le metriche aggregate verranno calcolate da dati reali invece che da mock. I requisiti di calcolo rimangono invariati.

## Impact

- **Nuovo file**: Creazione di una funzione API (probabilmente `lib/brevo/fetchCampaigns.js` o una API Route in `app/api/campaigns/route.js`)
- **Modifica `app/campaigns/page.js`**: Sostituzione dei mock con chiamata alla funzione API e gestione di stati di caricamento/errore
- **Variabili d'ambiente**: Utilizzo di `BREVO_API_KEY` da `.env.local` (già presente)
- **Dipendenze**: Nessuna nuova dipendenza necessaria, utilizzeremo `fetch` nativo di Next.js
- **Nessuna breaking change**: I componenti esistenti continueranno a funzionare con lo stesso formato dati, solo la fonte cambierà da mock a API reale
