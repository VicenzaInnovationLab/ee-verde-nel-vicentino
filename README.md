<p align="center"><img src="img/logo-innovationlab.png" alt="Logo dell'Innovation Lab Vicenza" width="400"></p>
<h1 align="center">Cambiamenti del verde nel vicentino</h1>
<p align="right">a cura del <a href="https://digitalinnovationhubvicenza.it/">Digital Innovation Hub Vicenza</a></p>

<p align="justify">
Esplora la dinamica della copertura vegetale nel vicentino usando la nostra web app basata su Google Earth Engine, una piattaforma Big Data, e immagini satellitari Copernicus.
</p>

[<p align="center"><img src="img/webapp-button-blue.png" alt="open web app button" width="200"></p>](https://vicenzainnovationlab.users.earthengine.app/view/verde-nel-vicentino)

<p align="center"><img  src="img/app-cover-full.png" alt="app screenshot" width="600"></p>

<p align="justify"><i>Il progetto è parte del Programma Operativo Regionale del Fondo Europeo di Sviluppo Regionale (POR FESR 2014 - 2020) del Veneto, nell'ambito del bando dell'azione 231 volto alla "costituzione di Innovation Lab diretti al consolidamento/sviluppo del network Centri P3@-Palestre Digitali e alla diffusione della cultura degli Open Data."</i></p>
<p align="center"><img src="img/logo-partecipanti.png" alt="logo of participants" width="700"></p>

## Indice
1. [Introduzione](#introduzione)
2. [Web App](#web-app)
   1. [Come usare la web app](#come-usare-la-web-app)
   2. [Come interpretare la mappa e il grafico?](#come-interpretare-la-mappa-e-il-grafico)
3. [Codice sorgente](#codice-sorgente)
   1. [Struttura del repository](#struttura-del-repository)
   2. [Come usare il codice](#come-usare-il-codice)
4. [Licenza](#licenza)
5. [Contatti](#contatti)
6. [Ringraziamenti](#ringraziamenti)

## Introduzione

La web app si basa sui dati satellitari Sentinel-2 del programma europeo di osservazione della Terra "Copernicus". La missione Sentinel-2, che consiste in due identiche navicelle spaziali che monitorano l'uso del suolo, la vegetazione, le foreste e le risorse idriche. Per estrarre informazioni sulla vegetazione dalle immagini, calcoliamo il *Normalized Difference Vegetation Index (NDVI)*, un semplice indicatore grafico che può essere utilizzato per valutare se la zona osservata contiene della vegetazione viva. L'intervallo di valori di NDVI è compreso tra `-1` e `1`. * Grazie a questa Web App si può vedere come i valori NDVI cambiano negli ultimi anni.

Questo repository contiene il codice JavaScript che abbiamo utilizzato per l'elaborazione dei dati e per generare la web app. Consente di studiare le dinamiche dell'indice NDVI. I dati utilizzati per la ricostruzione di tali dinamiche sono le immagini satellitari [Sentinel-2 (Programma Copernicus)](https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2), ottenute e elaborate tramite Earth Engine.

## Web App

### Come usare la web app

1. Quando la [web app](https://vicenzainnovationlab.users.earthengine.app/view/verde-nel-vicentino) è aperta (potrebbero volerci alcuni secondi per caricarla), si apre una mappa della provincia di Vicenza, dove la diversa intensità del colore verde mostra la distribuzione del NDVI di un determinato territorio. I valori sono *mediani* (non *medi*) per il periodo prescelto - vedi sotto.

2. Dall'elenco a tendina è possibile selezionare un'altra provincia del Veneto.

3. Per impostazione predefinita, l'intervallo di date è impostato per gli ultimi 30 giorni. Puoi cambiarlo. Tuttavia, la data di inizio non può essere precedente al 28/03/2017 a causa della mancanza di dati.

4. Ora la cosa più interessante: ingrandisci la mappa nell'area di tuo interesse e fai un clic. Nel pannello a destra, apparirà un grafico con una curva verde, che, a questo punto, mostra la dinamica dell'indice NDVI per il periodo selezionato. Il grafico mostra anche una trend line rossa (o meglio, una curva di tendenza polinomiale).

5. In alto a destra del grafico c'è un pulsante che consente di espanderlo in una finestra separata. In quella nuova finestra sarà possibile scaricare i dati iniziali del grafico nel formato CSV.

### Come interpretare la mappa e il grafico?

Ecco un riferimento:
- Valori negativi di NDVI (valori prossimi a -1) corrispondono all'acqua.
- Valori prossimi allo zero (da -0,1 a 0,1) corrispondono generalmente ad aree aride di roccia, sabbia o neve.
- Valori bassi e positivi rappresentano arbusti e prati (da 0,2 a 0,4 circa).
- Valori alti indicano foreste pluviali temperate e tropicali (valori prossimi a 1).

Attenzione: la curva NDVI potrebbe interrompersi in assenza di dati Sentinel-2 (ad esempio, a causa dell'elevata nuvolosità).

## Codice sorgente

### Struttura del repository

- `img/` - cartella con le immagini usate in questo Readme
- `code.js` - codice della web app per Earth Engine
- `LICENSE.md` - file della licenza
- `README.md` - questo file

### Come usare il codice

Il codice è stato sviluppato per essere eseguito all'interno della piattaforma Big Data che si chiama [Google Earth Engine](https://earthengine.google.com/). In caso se vuoi esaminare gli algoritmi sottostanti o produrre una web app derivata è necessario avere un account gratuito Earth Engine. Se vuoi invece solo utilizzare la web app, basta [aprire il link](https://vicenzainnovationlab.users.earthengine.app/view/verde-nel-vicentino).

Non appena hai l'account Earth Engine, esplora la sua interfaccia con [questo manuale](https://developers.google.com/earth-engine/guides/playground). Poi basta copiare il codice dal file `code.js` da questo repository a uno script Earth Engine per eseguirlo.

## Licenza

<img align="right" src="img/iodl.png" alt="Italian Open Data License logo" width="200">
La IODL 2.0 (Italian Open Data License) prevede che l’utente possa liberamente:

- consultare, estrarre, scaricare, copiare, pubblicare, distribuire e trasmettere le informazioni;
- creare un lavoro derivato, per esempio attraverso la combinazione con altre informazioni (c.d. mashup), includendole in un prodotto o sviluppando un’applicazione informatica che le utilizzi come base dati.

In cambio, all’utente è chiesto solo d'indicare la fonte delle informazioni e il nome del soggetto che fornisce il dato, includendo, se possibile, un link alla licenza. Vedi il file [LICENSE.md](LICENSE.md) per dettagli.

## Contatti

- Sito ufficiale: [InnovationLab Vicenza - Comune di Vicenza](https://www.comune.vicenza.it/uffici/cms/innovationlabvicenza.php)
- Sito sviluppatore: [Digital Innovation Hub Vicenza](https://digitalinnovationhubvicenza.it/)
- Email ufficiale: <vicenzainnovationlab@comune.vicenza.it>
- Email sviluppatore: <info@digitalinnovationhubvicenza.it>

## Ringraziamenti

Ringraziamo [Vasily Lobanov](https://www.linkedin.com/in/lobanov-v/) del Centro Earth Observation della [RUDN University](https://eng.rudn.ru/) per il prezioso supporto nello sviluppo della interfaccia grafica della web app.
