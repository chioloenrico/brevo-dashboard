## Context

Attualmente il progetto utilizza dati mock per le campagne email. I componenti `CampaignList` e `CampaignStatsHeader` si aspettano un formato semplificato con `stats: { sent, delivered, opened, clicked }`. 

L'API Brevo (`https://api.brevo.com/v3/emailCampaigns`) restituisce una struttura con:
- Le statistiche in `statistics.globalStats` con i nomi: `sent`, `delivered`, `viewed`, `clickers`
- Le campagne draft **hanno comunque** `statistics.globalStats` (non mancano completamente)
- L'API fornisce anche `uniqueViews`, `uniqueClicks`, e `opensRate` già calcolato

**Nuova osservazione**: Guardando l'output reale dell'API, ha più senso allineare l'UI e la struttura dati con quanto restituito dall'API, minimizzando la necessità di mapping e mantenendo fedeltà ai dati originali. Questo riduce complessità, possibilità di errori e facilita la manutenzione.

## Goals / Non-Goals

**Goals:**
- Allineare l'UI e la struttura dati con l'output dell'API Brevo, minimizzando il mapping necessario
- Creare una funzione di mapping minimale che espone `statistics.globalStats` come `stats` per facilità di accesso
- Mantenere i nomi originali dell'API (`viewed`, `clickers`) invece di rinominarli, per fedeltà ai dati originali
- Aggiornare i componenti esistenti per usare i nomi dell'API (`viewed` invece di `opened`, `clickers` invece di `clicked`)
- Gestire correttamente campagne draft che hanno comunque `statistics.globalStats` (ma potrebbero avere valori non significativi)
- Fornire un'interfaccia semplice che espone direttamente i dati dell'API con struttura semplificata

**Non-Goals:**
- Gestire chiamate API o fetch (sarà responsabilità di un altro layer)
- Validare la struttura completa dell'oggetto Brevo (assumiamo che `id`, `name`, `status` siano sempre presenti)
- Gestire errori di rete o timeout (gestiti a livello di chiamata API)
- Trasformare altri tipi di dati Brevo oltre alle campagne email

## Decisions

### 1. Posizionamento del file

**Decisione**: Creare `lib/brevo/mapBrevoToCampaign.js`

**Rationale**: 
- La cartella `lib` è una convenzione comune in Next.js per codice utility riutilizzabile
- La sottocartella `brevo` raggruppa logicamente tutte le utility relative all'API Brevo
- Il nome del file corrisponde al nome della funzione esportata, seguendo le convenzioni JavaScript

**Alternative considerate**:
- `utils/brevo/mapBrevoToCampaign.js`: `utils` è altrettanto valida, ma `lib` è più comune in Next.js
- `app/lib/brevo/...`: Non necessario, `lib` a root è sufficiente

### 2. Gestione campagne draft e mapping minimale

**Decisione**: Esporre direttamente `statistics.globalStats` come `stats`, mantenendo i nomi originali dell'API (`viewed`, `clickers`)

**Rationale**:
- Le campagne draft hanno comunque `statistics.globalStats` nell'API reale (come mostrato nell'esempio)
- Mantenere i nomi originali (`viewed`, `clickers`) riduce complessità e mantiene fedeltà ai dati API
- Il mapping serve solo per semplificare l'accesso (`statistics.globalStats` → `stats`), non per rinominare proprietà
- I componenti verranno aggiornati per usare i nomi dell'API

**Alternative considerate**:
- Rinominare `viewed` → `opened` e `clickers` → `clicked`: Aggiunge complessità non necessaria e allontana dai dati originali
- Restituire `stats: null` per draft: Non necessario dato che l'API fornisce comunque `statistics.globalStats`

### 3. Struttura dati esposta e nomi proprietà

**Decisione**: Esporre `statistics.globalStats` come `stats` mantenendo tutti i nomi originali dell'API (`sent`, `delivered`, `viewed`, `clickers`, `uniqueViews`, `uniqueClicks`, ecc.)

**Rationale**:
- Mantiene fedeltà completa ai dati dell'API, facilitando debug e manutenzione
- I componenti possono accedere direttamente a `campaign.stats.viewed` invece di `campaign.statistics.globalStats.viewed`
- Non perdiamo informazioni utili come `uniqueViews` e `uniqueClicks` che potrebbero essere più accurate
- Se `statistics` o `globalStats` mancano, restituire `stats: null`

**Alternative considerate**:
- Rinominare proprietà: Aggiunge complessità e allontana dai dati originali
- Esporre solo un subset di proprietà: Perdiamo informazioni potenzialmente utili

### 4. Named export vs default export

**Decisione**: Named export (`export function mapBrevoToCampaign`)

**Rationale**:
- Più esplicito e chiaro nell'importazione: `import { mapBrevoToCampaign } from '...'`
- Facilita tree-shaking nei bundler moderni
- Consente potenziali export multipli futuri dalla stessa utility

**Alternative considerate**:
- Default export: Meno chiaro, richiede naming arbitrario nell'import

### 5. Validazione input

**Decisione**: Assumere che `id`, `name`, `status` siano sempre presenti. Validazione minima solo per `statistics`

**Rationale**:
- La funzione è un transformer, non un validator
- La validazione completa dovrebbe avvenire a livello di chiamata API o schema validation (es. Zod)
- Mantiene la funzione semplice e performante

**Alternative considerate**:
- Validazione completa con throw di errori: Aggiungerebbe complessità non necessaria per una funzione di trasformazione

## Risks / Trade-offs

**[Risk]**: Se la struttura dell'API Brevo cambia, la funzione dovrà essere aggiornata
- **Mitigation**: Documentare chiaramente la dipendenza dalla struttura API. Considerare test unitari che validino la trasformazione con esempi reali dell'API

**[Risk]**: La funzione potrebbe non gestire tutti i casi edge dell'API Brevo
- **Mitigation**: Implementare gestione robusta di valori mancanti/undefined. Testare con dati reali quando disponibili

**[Trade-off]**: Restituire `stats: null` vs oggetto con zeri
- **Scelta**: `null` per chiarezza semantica, anche se richiede ai componenti di gestire `null` (cosa che già fanno)

**[Risk]**: La funzione potrebbe essere chiamata con dati già trasformati o in formato errato
- **Mitigation**: La funzione dovrebbe essere idempotente o almeno non rompere se chiamata con dati già nel formato corretto. Considerare un check opzionale per evitare doppia trasformazione

## Migration Plan

1. **Creare il file** `lib/brevo/mapBrevoToCampaign.js` con funzione di mapping minimale
2. **Aggiornare i componenti** per usare i nomi dell'API:
   - `CampaignList.js`: Cambiare `opened` → `viewed`, `clicked` → `clickers` in `getCampaignMetrics`
   - `CampaignStatsHeader.js`: Nessuna modifica necessaria (usa già i rate calcolati)
   - `app/campaigns/page.js`: Aggiornare `calculateAggregateMetrics` per usare `viewed` e `clickers`
3. **Testare la funzione** con esempi di dati Brevo reali
4. **Integrare quando si implementa il fetch API**:
   - Applicare `mapBrevoToCampaign` a ogni elemento dell'array restituito dall'API
   - Sostituire i mock con i dati reali trasformati

**Rollback**: Se necessario, mantenere i mock temporaneamente o ripristinare i nomi precedenti (`opened`, `clicked`).

## Open Questions

- Dovremmo usare `viewed`/`clickers` o `uniqueViews`/`uniqueClicks`? (L'API fornisce entrambi - `unique*` potrebbe essere più accurato)
- Dovremmo esporre anche `opensRate` già calcolato dall'API invece di ricalcolarlo? (Potrebbe semplificare i componenti)
- La funzione dovrebbe gestire array di campagne o solo singoli oggetti? (Probabilmente solo singoli oggetti, lasciando il mapping dell'array al chiamante)
- Dovremmo aggiungere TypeScript types per il formato Brevo? (Non applicabile se il progetto rimane JavaScript)
