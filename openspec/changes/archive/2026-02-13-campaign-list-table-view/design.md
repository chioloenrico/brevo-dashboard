## Context

Il componente `CampaignList` attualmente è un semplice segnaposto che mostra solo una lista `<ul>` con i nomi delle campagne. Il progetto utilizza Next.js 15 con App Router, React 19, e Tailwind CSS 4 con supporto per dark mode tramite CSS variables.

I dati delle campagne (`mockCampaigns`) includono già una struttura completa con `id`, `name`, `status`, e `stats` opzionali (con `sent`, `delivered`, `opened`, `clicked`). Il componente `CampaignStatsHeader` già esistente mostra metriche aggregate, quindi la tabella deve essere coerente con quello stile.

**Vincoli:**
- Nessuna nuova dipendenza esterna
- Utilizzo di Tailwind CSS già configurato
- Supporto dark mode già presente nel progetto
- Next.js App Router con componenti React Server/Client
- Il componente è già un Client Component (`"use client"`)

## Goals / Non-Goals

**Goals:**
- Trasformare `CampaignList` da lista semplice a tabella HTML responsive
- Mostrare colonne: Nome, Status, Delivery Rate, Open Rate, Click Rate
- Layout responsive che si adatta a mobile, tablet e desktop
- Formattazione corretta di percentuali usando `Intl.NumberFormat` (coerente con `CampaignStatsHeader`)
- Visualizzazione di status con badge/indicatori visivi colorati
- Gestione di dati mancanti (campagne senza stats mostrano "-" o "N/A")
- Styling coerente con il design system esistente (dark mode support)
- Struttura dati compatibile con futura integrazione API Brevo

**Non-Goals:**
- Integrazione con API Brevo (futuro)
- Funzionalità di ordinamento o filtri (futuro)
- Paginazione o infinite scroll (futuro)
- Azioni interattive (click, edit, delete) - solo visualizzazione
- Gestione di stati di loading o errori (per ora, dati sempre disponibili)
- Export o download dati

## Decisions

### 1. Struttura Tabella HTML

**Decisione**: Utilizzare elementi HTML nativi `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` per semantica corretta e accessibilità.

**Alternativa considerata**: Div-based table con CSS Grid/Flexbox.
- **Scelta**: Tabella HTML nativa per accessibilità (screen reader), semantica corretta, e migliore supporto per tabelle responsive complesse.

**Implementazione**: 
```jsx
<table className="w-full ...">
  <thead>...</thead>
  <tbody>...</tbody>
</table>
```

### 2. Layout Responsive

**Decisione**: Utilizzare approccio "scroll orizontale su mobile" con `overflow-x-auto` wrapper, mantenendo tutte le colonne visibili ma permettendo scroll orizzontale su schermi piccoli.

**Alternativa considerata**: Nascondere colonne su mobile, mostrare solo colonne essenziali.
- **Scelta**: Scroll orizzontale mantiene tutte le informazioni disponibili, è più semplice da implementare, e offre migliore UX rispetto a nascondere dati.

**Implementazione**: 
```jsx
<div className="overflow-x-auto">
  <table className="min-w-full ...">
    ...
  </table>
</div>
```

### 3. Formattazione Percentuali

**Decisione**: Riutilizzare la stessa funzione `formatPercentage` già usata in `CampaignStatsHeader` o creare una funzione helper condivisa. Utilizzare `Intl.NumberFormat` con 1 decimale.

**Alternativa considerata**: Formattazione inline o diversa per la tabella.
- **Scelta**: Coerenza con le card metriche già implementate, stessa UX, riusabilità del codice.

**Posizione**: Funzione helper condivisa o inline nel componente (può essere estratta dopo se necessario).

### 4. Visualizzazione Status

**Decisione**: Utilizzare badge colorati con Tailwind CSS per indicare lo status:
- `sent`: verde (success)
- `draft`: grigio/giallo (warning/in-progress)
- `scheduled`: blu (info)

**Alternativa considerata**: Solo testo, o icone senza colori.
- **Scelta**: Badge colorati migliorano la leggibilità rapida e sono coerenti con best practices dashboard moderne.

**Implementazione**:
```jsx
<span className={`px-2 py-1 rounded text-xs ${
  status === 'sent' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
  status === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' :
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
}`}>
  {status}
</span>
```

### 5. Calcolo Metriche per Riga

**Decisione**: Calcolare le metriche (Delivery Rate, Open Rate, Click Rate) per ogni campagna direttamente nel componente durante il rendering, utilizzando i dati `stats` disponibili.

**Alternativa considerata**: Pre-calcolare le metriche nella pagina e passarli come props.
- **Scelta**: Calcolo inline mantiene il componente self-contained, più semplice da mantenere, e permette gestione diretta di casi edge (stats mancanti).

**Logica**:
- Delivery Rate: `delivered / sent` (se stats disponibili)
- Open Rate: `opened / delivered` (se stats disponibili)
- Click Rate: `clicked / delivered` (se stats disponibili)
- Se `stats` non disponibili o `status !== 'sent'`: mostrare "-" o "N/A"

### 6. Styling Tabella

**Decisione**: Utilizzare Tailwind CSS con:
- Header con background leggermente diverso e font-weight maggiore
- Righe alternate (zebra striping) per migliore leggibilità
- Border sottili per definizione
- Padding generoso per respirabilità
- Hover effect sulle righe per feedback visivo

**Styling Tailwind approssimativo**:
```jsx
className="min-w-full divide-y divide-foreground/10 border border-foreground/10"
thead: "bg-foreground/5"
th: "px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider"
tbody: "bg-background divide-y divide-foreground/10"
tr: "hover:bg-foreground/5"
td: "px-6 py-4 whitespace-nowrap text-sm text-foreground"
```

### 7. Gestione Dati Mancanti

**Decisione**: Mostrare "-" per metriche non disponibili (campagne senza stats o status diverso da 'sent'). Status sempre mostrato anche se draft.

**Alternativa considerata**: Nascondere righe senza dati, o mostrare "0%" per metriche mancanti.
- **Scelta**: "-" è più chiaro che indica "non disponibile" vs "zero", mantiene tutte le campagne visibili nella lista.

## Risks / Trade-offs

**[Risk] Tabella troppo larga su mobile** → Mitigazione: Scroll orizzontale con `overflow-x-auto`, header sticky se necessario, colonne con larghezza minima appropriata.

**[Risk] Performance con molte campagne** → Mitigazione: Rendering è O(n) semplice, accettabile per centinaia di righe. Se necessario in futuro, si può aggiungere virtualizzazione o paginazione.

**[Risk] Inconsistenza formattazione con CampaignStatsHeader** → Mitigazione: Riutilizzare stessa funzione `formatPercentage` o creare helper condiviso.

**[Risk] Dark mode inconsistente** → Mitigazione: Utilizzo delle CSS variables esistenti (`--background`, `--foreground`) già configurate per dark mode, test su entrambi i temi.

**[Trade-off] Tabella HTML vs Div-based** → Accettato: Tabella HTML per accessibilità e semantica, costo minimo di complessità.

**[Trade-off] Scroll orizzontale vs colonne nascoste** → Accettato: Scroll mantiene tutte le informazioni, migliore per analisi dati.

## Migration Plan

**Fase 1: Implementazione tabella base**
1. Sostituire `<ul>` con struttura `<table>` HTML
2. Creare header con colonne: Nome, Status, Delivery Rate, Open Rate, Click Rate
3. Implementare rendering righe con dati mock
4. Aggiungere formattazione percentuali
5. Implementare badge status colorati
6. Aggiungere gestione dati mancanti

**Fase 2: Styling e responsive**
1. Applicare styling Tailwind CSS completo
2. Implementare scroll orizzontale responsive
3. Aggiungere hover effects e zebra striping
4. Test responsive su mobile/tablet/desktop
5. Verificare dark mode

**Fase 3: Refinements**
1. Allineamento colonne numeriche
2. Spaziatura e padding ottimizzati
3. Test con dati vari (con/senza stats, diversi status)

**Rollback**: Sostituire tabella con lista originale, nessun impatto su altre parti.

## Open Questions

- **Allineamento colonne**: Allineare numeri a destra e testo a sinistra? → **Decisione**: Sì, numeri a destra per migliore leggibilità comparativa.
- **Capitolizzazione status**: Mostrare "Sent", "Draft" o "sent", "draft"? → **Decisione**: Capitalizzare prima lettera ("Sent", "Draft") per migliore leggibilità.
- **Funzione formattazione condivisa**: Estrarre `formatPercentage` in file utils condiviso? → **Decisione**: Inline inizialmente, può essere estratta dopo se riutilizzata altrove.
