## 1. Setup e creazione funzione fetchCampaigns

- [x] 1.1 Creare il file `lib/brevo/fetchCampaigns.js`
- [x] 1.2 Importare `mapBrevoToCampaign` da `lib/brevo/mapBrevoToCampaign.js`

## 2. Implementazione funzione fetchCampaigns

- [x] 2.1 Implementare verifica presenza `BREVO_API_KEY` da `process.env.BREVO_API_KEY`
- [x] 2.2 Implementare lancio errore descrittivo se API Key mancante o vuota
- [x] 2.3 Implementare chiamata GET a `https://api.brevo.com/v3/emailCampaigns` con header `api-key`
- [x] 2.4 Implementare gestione risposta API e parsing JSON
- [x] 2.5 Implementare applicazione `mapBrevoToCampaign` a ogni campagna nell'array `campaigns`
- [x] 2.6 Implementare gestione array vuoto (restituire array vuoto)
- [x] 2.7 Esportare funzione come named export `fetchCampaigns`

## 3. Gestione errori API

- [x] 3.1 Implementare gestione errori di rete (try/catch con messaggio descrittivo)
- [x] 3.2 Implementare gestione errori 401/403 (autenticazione) con messaggio appropriato
- [x] 3.3 Implementare gestione errore 429 (rate limiting) con messaggio appropriato
- [x] 3.4 Implementare gestione errori 5xx (server errors) con messaggio appropriato
- [x] 3.5 Implementare gestione formato risposta inatteso (validazione struttura `campaigns` array)

## 4. Integrazione nella pagina campaigns

- [x] 4.1 Convertire `app/campaigns/page.js` in async Server Component (aggiungere `async`)
- [x] 4.2 Importare `fetchCampaigns` da `lib/brevo/fetchCampaigns`
- [x] 4.3 Sostituire mock data con chiamata `await fetchCampaigns()`
- [x] 4.4 Implementare gestione errori nella pagina (try/catch o error boundary)
- [x] 4.5 Verificare che i dati trasformati vengano passati correttamente a `CampaignList` e `CampaignStatsHeader`

## 5. Gestione loading state

- [x] 5.1 Creare file `app/campaigns/loading.js` per UI di caricamento
- [x] 5.2 Implementare componente loading con messaggio appropriato (opzionale: skeleton o spinner)

## 6. Testing e verifica

- [ ] 6.1 Testare funzione con API Key valida e verifica trasformazione dati
- [ ] 6.2 Testare funzione con API Key mancante (verifica errore)
- [ ] 6.3 Testare funzione con API Key invalida (verifica gestione errore 401/403)
- [ ] 6.4 Verificare che la pagina mostri correttamente i dati dall'API
- [ ] 6.5 Verificare che il loading state venga mostrato durante il fetch
- [ ] 6.6 Verificare che gli errori vengano gestiti correttamente nella pagina
