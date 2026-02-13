## Why

Dopo aver integrato con successo le campagne email, il passo successivo per trasformare la dashboard in uno strumento completo è visualizzare i dati del CRM. I contatti sono l'entità fondamentale per monitorare la crescita della lista e lo stato degli utenti.

## What Changes

- Creazione di una funzione `fetchContacts` per recuperare i contatti dall'API di Brevo (`/v3/contacts`)
- Creazione di una funzione di mapping `mapBrevoToContact` per normalizzare i dati grezzi (che hanno attributi dinamici) in un formato standard e facile da usare per la UI
- Esposizione di campi chiave: Nome (firstName), Cognome (lastName), Email, Data di iscrizione (createdAt), Stato (emailBlacklisted)

## Capabilities

### New Capabilities
- `brevo-contacts-fetch`: Capacità di recuperare e trasformare la lista dei contatti dal CRM di Brevo, gestendo autenticazione, paginazione, e mapping degli attributi dinamici in un formato standardizzato

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- **Nuovi file**: `lib/brevo/fetchContacts.js`, `lib/brevo/mapBrevoToContact.js`
- **Pattern replicato**: Seguirà lo stesso pattern di `fetchCampaigns` e `mapBrevoToCampaign` per consistenza
- **Nessuna modifica alla UI**: In questa fase ci concentriamo solo sulla logica di recupero dati (library layer)
- **Preparazione futura**: Pone le basi per una successiva pagina `/contacts` nella dashboard
