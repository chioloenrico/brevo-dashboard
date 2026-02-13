## 1. Setup e struttura file

- [x] 1.1 Creare la cartella `lib/brevo/` se non esiste
- [x] 1.2 Creare il file `lib/brevo/mapBrevoToCampaign.js`

## 2. Implementazione funzione mapBrevoToCampaign

- [x] 2.1 Implementare la funzione `mapBrevoToCampaign` che accetta un oggetto campagna Brevo
- [x] 2.2 Implementare logica per esporre `statistics.globalStats` come `stats` quando presente
- [x] 2.3 Implementare gestione caso `statistics` mancante (restituire `stats: null`)
- [x] 2.4 Implementare gestione caso `globalStats` mancante (restituire `stats: null`)
- [x] 2.5 Implementare gestione caso `statistics` null o undefined (restituire `stats: null`)
- [x] 2.6 Assicurarsi che la funzione preservi tutte le altre proprietà dell'oggetto campagna
- [x] 2.7 Assicurarsi che la funzione mantenga tutti i nomi originali delle proprietà in `stats` (viewed, clickers, ecc.)
- [x] 2.8 Assicurarsi che la funzione sia pura e non modifichi l'oggetto input
- [x] 2.9 Esportare la funzione come named export

## 3. Aggiornamento componenti per usare nomi API

- [x] 3.1 Aggiornare `app/campaigns/CampaignList.js`: cambiare `opened` → `viewed` e `clicked` → `clickers` in `getCampaignMetrics`
- [x] 3.2 Aggiornare `app/campaigns/page.js`: cambiare `opened` → `viewed` e `clicked` → `clickers` in `calculateAggregateMetrics`
- [x] 3.3 Verificare che `CampaignStatsHeader.js` non richieda modifiche (usa già i rate calcolati)

## 4. Integrazione e testing

- [x] 4.1 Testare la funzione con un oggetto campagna completo con `statistics.globalStats`
- [x] 4.2 Testare la funzione con un oggetto campagna senza `statistics`
- [x] 4.3 Testare la funzione con un oggetto campagna con `statistics` ma senza `globalStats`
- [x] 4.4 Testare la funzione con una campagna draft che ha comunque `statistics.globalStats`
- [x] 4.5 Verificare che i componenti aggiornati funzionino correttamente con i nuovi nomi delle proprietà
