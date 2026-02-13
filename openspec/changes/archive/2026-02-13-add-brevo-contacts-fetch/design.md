## Context

L'applicazione ha già implementato con successo il pattern di fetch per le campagne (`fetchCampaigns` + `mapBrevoToCampaign`). Ora dobbiamo replicare lo stesso pattern architetturale per i contatti, garantendo consistenza nella gestione delle chiamate API, error handling e trasformazione dati.

I contatti Brevo hanno una struttura particolare: i campi personalizzati sono raggruppati in un oggetto `attributes` con chiavi dinamiche (es. `NOME`, `COGNOME`), mentre campi standard come `email`, `createdAt`, `emailBlacklisted` sono a livello root.

## Goals / Non-Goals

**Goals:**
- Creare `lib/brevo/fetchContacts.js` che recupera i contatti da `/v3/contacts` seguendo il pattern di `fetchCampaigns`
- Creare `lib/brevo/mapBrevoToContact.js` che normalizza i dati trasformando l'oggetto `attributes` in campi di primo livello
- Gestire paginazione (limit, offset) per supportare liste grandi
- Mantenere error handling robusto (401, 403, 429, 5xx, network errors)
- Esporre campi chiave: `email`, `firstName`, `lastName`, `createdAt`, `emailBlacklisted`

**Non-Goals:**
- Non creeremo UI in questa fase (solo library layer)
- Non implementeremo operazioni CRUD (solo read)
- Non gestiremo liste di contatti o segmentazioni (solo fetch completo)
- Non implementeremo caching o ottimizzazioni avanzate

## Decisions

### Decision 1: Replicare il pattern di fetchCampaigns
**Rationale:** Mantenere consistenza architetturale con il codice esistente. Il pattern fetch + map si è dimostrato efficace per le campagne.

**Alternatives considered:**
- Creare un client Brevo generico: troppo complesso per questa fase
- Unificare fetchCampaigns e fetchContacts in un unico modulo: ridurrebbe la coesione e chiarezza

**Implementation:**
- `fetchContacts.js`: gestisce HTTP request, validazione response, error handling
- `mapBrevoToContact.js`: trasforma la struttura Brevo in formato UI-friendly
- Stessa struttura di error handling (validazione API key, status codes, network errors)

### Decision 2: Flattening degli attributi dinamici
**Rationale:** I contatti Brevo hanno attributi personalizzati in un oggetto `attributes` (es. `attributes.NOME`, `attributes.COGNOME`). Per semplificare l'uso in UI, li portiamo a livello root come `firstName`, `lastName`.

**Alternatives considered:**
- Lasciare `attributes` nested: richiederebbe `contact.attributes.NOME` in ogni componente
- Usare un proxy getter: troppo complesso per il beneficio

**Implementation:**
```javascript
// Input Brevo:
{
  email: "user@example.com",
  attributes: { NOME: "Mario", COGNOME: "Rossi" },
  emailBlacklisted: false,
  createdAt: "2024-01-15T10:30:00Z"
}

// Output mapped:
{
  email: "user@example.com",
  firstName: "Mario",
  lastName: "Rossi",
  emailBlacklisted: false,
  createdAt: "2024-01-15T10:30:00Z"
}
```

### Decision 3: Gestione paginazione con parametri limit/offset
**Rationale:** L'endpoint `/v3/contacts` supporta paginazione. Inizialmente recuperiamo un numero ragionevole di contatti (es. limit=50) senza implementare scroll infinito.

**Alternatives considered:**
- Fetch di tutti i contatti: potrebbe causare timeout o problemi di memoria con liste grandi
- Implementare paginazione lato UI: fuori scope per questa fase (solo library layer)

**Implementation:**
- Parametri query: `limit=50&offset=0` di default
- In futuro si potrà estendere per supportare paginazione lato UI

### Decision 4: Gestione campi mancanti o null
**Rationale:** Non tutti i contatti hanno tutti gli attributi compilati. Dobbiamo gestire valori null/undefined senza far crashare l'applicazione.

**Implementation:**
- `mapBrevoToContact` usa destructuring con default: `attributes?.NOME || null`
- Validazione in `fetchContacts` assicura che `data.contacts` sia un array

## Risks / Trade-offs

**[Risk]** Attributi personalizzati hanno nomi diversi tra account Brevo → **Mitigation:** Mappare esplicitamente `NOME` e `COGNOME` basandoci sulla configurazione nota; documentare quali attributi custom sono richiesti

**[Risk]** Limite di 50 contatti potrebbe non essere sufficiente per dashboard completa → **Mitigation:** In futuro estendere fetchContacts per accettare limit/offset come parametri e implementare paginazione

**[Risk]** API key condivisa tra campagne e contatti → **Mitigation:** Già gestito correttamente; stessa validazione in entrambe le fetch functions

**[Trade-off]** Flattening degli attributes perde informazioni sulla struttura originale → **Acceptable:** Per questa fase, firstName e lastName sono gli unici attributi custom necessari; se servissero più attributi custom, si può estendere il mapping
