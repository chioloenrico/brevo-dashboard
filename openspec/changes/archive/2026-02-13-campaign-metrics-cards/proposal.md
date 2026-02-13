## Why

La pagina `/campaigns` attualmente mostra solo una lista semplice di campagne senza alcuna visualizzazione delle metriche chiave. Per fornire un valore immediato agli utenti e migliorare l'esperienza della dashboard, è necessario aggiungere un componente che visualizzi le metriche aggregate principali (Delivery Rate, Open Rate, Click Rate) in formato card nella parte superiore della pagina. Questo permetterà agli utenti di avere una visione d'insieme rapida delle performance delle campagne senza dover analizzare ogni singola campagna.

## What Changes

- **Nuovo componente `CampaignStatsHeader`**: Componente React che visualizza metriche aggregate in formato card responsive
- **Integrazione nella pagina `/campaigns`**: Il componente verrà inserito sopra la lista esistente delle campagne
- **Logica di aggregazione**: Funzione helper per calcolare le metriche aggregate dai dati delle campagne (inizialmente da dati mock)
- **Styling responsive**: Layout a griglia che si adatta a diverse dimensioni di schermo usando Tailwind CSS
- **Formattazione metriche**: Visualizzazione di percentuali e numeri formattati correttamente

## Capabilities

### New Capabilities
- `campaign-metrics-display`: Capability per visualizzare metriche aggregate delle campagne email. Include il componente card per le metriche principali (Delivery Rate, Open Rate, Click Rate) con layout responsive e formattazione dei dati.

### Modified Capabilities
<!-- Nessuna capability esistente da modificare -->

## Impact

**File modificati:**
- `app/campaigns/page.js`: Aggiunta del componente `CampaignStatsHeader` sopra `CampaignList`

**File creati:**
- `app/campaigns/CampaignStatsHeader.js`: Nuovo componente per le card delle metriche aggregate
- `app/campaigns/utils/metrics.js` (opzionale): Funzioni helper per calcolare aggregazioni dai dati delle campagne

**Dipendenze:**
- Nessuna nuova dipendenza esterna richiesta
- Utilizzo di Tailwind CSS già presente nel progetto
- Utilizzo di React e Next.js già configurati

**Note:**
- Inizialmente i dati saranno mock/simulati per permettere lo sviluppo della visualizzazione senza dipendere dall'integrazione API Brevo
- La struttura dei dati mock sarà progettata per essere facilmente sostituibile con i dati reali dell'API Brevo in futuro
