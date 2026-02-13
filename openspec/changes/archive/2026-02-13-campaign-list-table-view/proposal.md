## Why

Il componente `CampaignList` attualmente mostra solo una lista semplice di nomi delle campagne, funzionando come semplice segnaposto. Per preparare la dashboard all'integrazione futura con l'API Brevo e fornire una visualizzazione più utile e professionale, è necessario trasformare questo componente in una tabella responsive che mostri le informazioni chiave delle campagne (nome, status, metriche principali). Questo miglioramento è fondamentale per creare una base solida prima di integrare i dati reali dell'API.

## What Changes

- **Trasformazione di `CampaignList` da lista a tabella**: Sostituire la lista `<ul>` con una tabella HTML responsive che mostra più informazioni per ogni campagna
- **Aggiunta di colonne informative**: La tabella includerà colonne per Nome, Status, Delivery Rate, Open Rate, Click Rate
- **Styling responsive**: La tabella si adatterà a diverse dimensioni di schermo, con layout ottimizzato per mobile, tablet e desktop
- **Formattazione dati**: Visualizzazione corretta di status (con badge/indicatori visivi), percentuali formattate, e gestione di dati mancanti
- **Preparazione struttura dati**: Il componente sarà progettato per accettare la struttura dati che verrà dall'API Brevo in futuro

## Capabilities

### New Capabilities
- `campaign-list-display`: Capability per visualizzare la lista delle campagne in formato tabella responsive. Include colonne per nome, status, e metriche principali (Delivery Rate, Open Rate, Click Rate) con formattazione appropriata e supporto responsive.

### Modified Capabilities
<!-- Nessuna capability esistente da modificare -->

## Impact

**File modificati:**
- `app/campaigns/CampaignList.js`: Trasformazione completa da lista semplice a tabella responsive con colonne multiple

**File creati:**
- Nessun nuovo file (modifica del componente esistente)

**Dipendenze:**
- Nessuna nuova dipendenza esterna richiesta
- Utilizzo di Tailwind CSS già presente nel progetto
- Utilizzo di React e Next.js già configurati

**Note:**
- Il componente continuerà a utilizzare dati mock per ora, ma la struttura sarà progettata per essere compatibile con i dati reali dell'API Brevo
- La tabella sarà responsive e si adatterà automaticamente a diverse dimensioni di schermo
- Non verrà implementata l'integrazione API in questo change - solo miglioramento della visualizzazione front-end
