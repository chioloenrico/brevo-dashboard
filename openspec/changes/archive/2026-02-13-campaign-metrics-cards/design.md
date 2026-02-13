## Context

La pagina `/campaigns` attualmente mostra solo una lista semplice di campagne (`CampaignList`) senza visualizzazione di metriche. Il progetto utilizza Next.js 15 con App Router, React 19, e Tailwind CSS 4 con supporto per dark mode tramite CSS variables.

I dati delle campagne sono attualmente mock (`mockCampaigns`) con struttura minimale (`id`, `name`, `status`). L'integrazione con l'API Brevo è pianificata per il futuro, quindi la struttura dei dati mock deve essere progettata per essere facilmente sostituibile.

**Vincoli:**
- Nessuna nuova dipendenza esterna
- Utilizzo di Tailwind CSS già configurato
- Supporto dark mode già presente nel progetto
- Next.js App Router con componenti React Server/Client

## Goals / Non-Goals

**Goals:**
- Creare un componente `CampaignStatsHeader` che visualizza metriche aggregate in formato card responsive
- Mostrare 3 metriche principali: Delivery Rate, Open Rate, Click Rate
- Layout a griglia che si adatta a mobile, tablet e desktop
- Calcolo aggregato delle metriche dai dati delle campagne (mock per ora)
- Formattazione corretta di percentuali e numeri
- Integrazione nella pagina `/campaigns` sopra la lista esistente
- Styling coerente con il design system esistente (dark mode support)

**Non-Goals:**
- Integrazione con API Brevo (futuro)
- Grafici o visualizzazioni avanzate (solo card con numeri)
- Filtri o interattività complessa (solo visualizzazione)
- Trend o comparazioni temporali (solo valori assoluti aggregati)
- Gestione di stati di loading o errori (per ora, dati sempre disponibili)

## Decisions

### 1. Struttura del Componente

**Decisione**: Creare un componente client-side (`"use client"`) per `CampaignStatsHeader` che riceve i dati aggregati come props.

**Alternativa considerata**: Server Component che calcola le metriche direttamente.
- **Scelta**: Client Component perché permette maggiore flessibilità per future interazioni e il calcolo può essere fatto nella pagina server component.

**Struttura:**
```
CampaignStatsHeader
├── Props: { metrics: { deliveryRate, openRate, clickRate } }
└── Render: Grid di 3 card MetricCard
```

### 2. Layout Responsive

**Decisione**: Utilizzare Tailwind CSS Grid con breakpoints responsive:
- Mobile (< 640px): 1 colonna (stack verticale)
- Tablet (≥ 640px): 2 colonne
- Desktop (≥ 1024px): 3 colonne

**Alternativa considerata**: Flexbox con wrap.
- **Scelta**: Grid per controllo più preciso del layout e migliore allineamento delle card.

**Implementazione**: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`

### 3. Struttura Dati Mock

**Decisione**: Estendere `mockCampaigns` con campi statistici per simulare dati realistici:
```javascript
{
  id: number,
  name: string,
  status: 'sent' | 'draft' | 'scheduled',
  stats?: {
    sent: number,
    delivered: number,
    opened: number,
    clicked: number
  }
}
```

**Alternativa considerata**: Struttura completamente separata per le metriche.
- **Scelta**: Aggiungere `stats` opzionale per mantenere coerenza e facilitare la migrazione futura all'API Brevo.

### 4. Calcolo Aggregazione

**Decisione**: Creare funzione helper `calculateAggregateMetrics(campaigns)` che:
- Filtra solo campagne con `status: 'sent'` e `stats` disponibili
- Calcola totali e medie ponderate
- Restituisce oggetto `{ deliveryRate, openRate, clickRate }`

**Alternativa considerata**: Calcolo inline nel componente.
- **Scelta**: Funzione separata per testabilità, riusabilità e chiarezza del codice.

**Posizione**: `app/campaigns/utils/metrics.js` (opzionale, può essere inline nella pagina inizialmente)

### 5. Formattazione Numeri

**Decisione**: Utilizzare `Intl.NumberFormat` per formattare percentuali con 1 decimale (es. "95.2%") e numeri con separatori di migliaia.

**Alternativa considerata**: Template literals manuali o librerie esterne.
- **Scelta**: API nativa del browser, nessuna dipendenza, supporto internazionale.

### 6. Styling Card

**Decisione**: Card con:
- Background con leggera differenziazione dal background principale
- Border sottile per definizione
- Padding generoso per respirabilità
- Icona/emoji per identificazione visiva rapida
- Valore grande e prominente
- Label descrittiva sotto

**Styling Tailwind approssimativo:**
```jsx
className="bg-background border border-foreground/10 rounded-lg p-6 shadow-sm"
```

### 7. Integrazione nella Pagina

**Decisione**: Modificare `app/campaigns/page.js` per:
1. Calcolare metriche aggregate dai `mockCampaigns`
2. Passare le metriche a `CampaignStatsHeader`
3. Mantenere `CampaignList` esistente sotto

**Alternativa considerata**: Wrapper component che gestisce tutto.
- **Scelta**: Mantenere la pagina semplice e componibile.

## Risks / Trade-offs

**[Risk] Dati mock non rappresentativi** → Mitigazione: Struttura dati mock progettata per essere simile all'API Brevo, facilitando la migrazione futura.

**[Risk] Performance con molte campagne** → Mitigazione: Calcolo aggregato è O(n) semplice, accettabile per centinaia di campagne. Se necessario, si può aggiungere memoization.

**[Risk] Layout non ottimale su schermi molto piccoli** → Mitigazione: Test responsive con breakpoints Tailwind standard, card stack verticale su mobile.

**[Risk] Dark mode inconsistente** → Mitigazione: Utilizzo delle CSS variables esistenti (`--background`, `--foreground`) già configurate per dark mode.

**[Trade-off] Client Component vs Server Component** → Accettato: Client Component per flessibilità futura, costo minimo per questo caso d'uso.

**[Trade-off] Funzione helper separata vs inline** → Accettato: Separata per chiarezza, può essere inline inizialmente se preferito.

## Migration Plan

**Fase 1: Implementazione con dati mock**
1. Creare `CampaignStatsHeader.js` con struttura base
2. Estendere `mockCampaigns` con dati statistici
3. Creare funzione di aggregazione
4. Integrare nella pagina `/campaigns`
5. Test responsive e dark mode

**Fase 2: Migrazione futura all'API Brevo**
- Sostituire `mockCampaigns` con fetch da API
- Adattare funzione aggregazione se struttura dati API differisce
- Nessun cambiamento necessario al componente `CampaignStatsHeader` (riceve già dati aggregati)

**Rollback**: Rimuovere import e componente dalla pagina, nessun impatto su altre parti.

## Open Questions

- **Icone**: Utilizzare emoji (📧, 👁️, 🖱️) o preferire icone SVG/componenti? → **Decisione**: Emoji per semplicità iniziale, può essere migliorato dopo.
- **Metrica aggiuntiva**: Aggiungere "Total Campaigns" come quarta card? → **Decisione**: No per ora, focus su 3 metriche principali.
- **Posizione funzione aggregazione**: File separato `utils/metrics.js` o inline nella pagina? → **Decisione**: Inline inizialmente per semplicità, può essere estratta dopo.
