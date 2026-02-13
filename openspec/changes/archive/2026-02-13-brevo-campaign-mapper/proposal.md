## Why

I dati ricevuti dall'API Brevo hanno una struttura annidata (`statistics.globalStats`) che richiede accesso a proprietà annidate. Inoltre, i componenti attuali utilizzano nomi diversi da quelli dell'API (`opened` invece di `viewed`, `clicked` invece di `clickers`). Per minimizzare complessità e mantenere fedeltà ai dati originali, è meglio allineare l'UI e la struttura dati con l'output dell'API Brevo. Una funzione di mapping minimale servirà solo per semplificare l'accesso (`statistics.globalStats` → `stats`), mentre i componenti verranno aggiornati per usare direttamente i nomi dell'API.

## What Changes

- Creazione di una funzione JavaScript `mapBrevoToCampaign` che espone `statistics.globalStats` come `stats` per facilità di accesso
- La funzione mantiene i nomi originali dell'API (`viewed`, `clickers`) invece di rinominarli, per fedeltà ai dati originali
- Aggiornamento dei componenti esistenti (`CampaignList`, `CampaignStatsHeader`, `page.js`) per usare i nomi dell'API (`viewed` invece di `opened`, `clickers` invece di `clicked`)
- La funzione gestisce casi in cui `statistics` o `globalStats` mancano, restituendo `stats: null`
- Export come named export per facilitare l'importazione nei componenti

## Capabilities

### New Capabilities
- `brevo-campaign-mapper`: Funzione di utilità che espone `statistics.globalStats` come `stats` per semplificare l'accesso ai dati. Mantiene i nomi originali dell'API per fedeltà ai dati e minimizza la complessità di mapping.

### Modified Capabilities
<!-- Nessuna modifica ai requisiti delle capability esistenti - questa è una funzione di utilità che supporta campaign-list-display e campaign-metrics-display -->

## Impact

- **Nuovo file**: Creazione di un nuovo file utility (probabilmente `lib/brevo/mapBrevoToCampaign.js` o simile) contenente la funzione di trasformazione
- **Componenti esistenti**: I componenti `CampaignList`, `CampaignStatsHeader` e `page.js` verranno aggiornati per usare i nomi dell'API (`viewed`, `clickers`) e utilizzeranno questa funzione per accedere facilmente a `statistics.globalStats` tramite `stats`
- **API Brevo**: La funzione dipende dalla struttura dei dati dell'API Brevo e dovrà essere aggiornata se la struttura API cambia
- **Nessuna breaking change**: Questa è un'aggiunta di utilità che non modifica il comportamento esistente dei componenti
