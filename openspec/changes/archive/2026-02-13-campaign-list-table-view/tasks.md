# Tasks

## 1. Struttura tabella HTML base

- [x] 1.1 Sostituire la lista `<ul>` con struttura `<table>` HTML (thead, tbody, tr, th, td)
- [x] 1.2 Creare header con le 5 colonne: Nome, Status, Delivery Rate, Open Rate, Click Rate
- [x] 1.3 Implementare rendering delle righe con campagna name e status
- [x] 1.4 Wrappare la tabella in div con `overflow-x-auto` per scroll orizzontale responsive

## 2. Logica calcolo e formattazione metriche

- [x] 2.1 Implementare funzione formatPercentage con Intl.NumberFormat (1 decimale)
- [x] 2.2 Calcolare Delivery Rate, Open Rate, Click Rate per ogni campagna da stats
- [x] 2.3 Mostrare "-" per metriche quando stats mancanti o status non 'sent'
- [x] 2.4 Renderizzare le colonne metriche in ogni riga con valori formattati o "-"

## 3. Badge status e capitalizzazione

- [x] 3.1 Creare componente/funzione per badge status con colori (sent=verde, draft=grigio, scheduled=blu)
- [x] 3.2 Capitalizzare status (prima lettera maiuscola: Sent, Draft, Scheduled)
- [x] 3.3 Applicare stili dark mode ai badge

## 4. Styling tabella con Tailwind

- [x] 4.1 Applicare styling header (bg-foreground/5, uppercase, font-medium)
- [x] 4.2 Implementare zebra striping sulle righe (colori alternati)
- [x] 4.3 Aggiungere hover effect sulle righe
- [x] 4.4 Applicare padding, border, divide-y per definizione visiva

## 5. Allineamento e refinements

- [x] 5.1 Allineare colonne Nome e Status a sinistra (text-left)
- [x] 5.2 Allineare colonne metriche a destra (text-right)
- [x] 5.3 Verificare dark mode con CSS variables (--background, --foreground)
- [x] 5.4 Test responsive su viewport piccoli (scroll orizzontale funzionante)
