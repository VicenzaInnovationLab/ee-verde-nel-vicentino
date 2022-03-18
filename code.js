/*******************************************************************************
 * Developed by Yaroslav Vasyunin <https://github.com/y-vasyunin>
 * for the InnovationLab Vicenza project, February 2022
 * <https://www.comune.vicenza.it/uffici/cms/innovationlabvicenza.php>
 * 
 * Description: <https://github.com/VicenzaInnovationLab/ee-verde-nel-vicentino>
 ******************************************************************************/

 var appVersion = "2022.3.18";

/*******************************************************************************
 * MODEL *
 ******************************************************************************/

// Define a JSON object for storing the data model

var m = {};

/* Multispectral Imagery ******************************************************/

m.s2 = {};
m.s2 = {
  name: "Sentinel 2",
  source: ee.ImageCollection("COPERNICUS/S2_SR"),
  cloudAttribute: "CLOUDY_PIXEL_PERCENTAGE",
  bandIds: ["B2", "B3", "B4", "B8", "QA60"],  // TODO: rename m.s2.bands.data
  bandNames: ["BLUE", "GREEN", "RED", "NIR", "BQA"],
  dateStart: "2017-03-28",
  scale: 10,
  url: "https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR",
  vis: {
    min: -5,
    max: 5,
    opacity: 0.8,
    bands: ["scale"],  // 'scale'refers to the 'slope' of the line (k parameter)
    palette: [
      "a50000", "#ff8c8c",  // red
      "#FFFFFF", "#FFFFFF", // white
      "9AD0EC", "09009B" // blue
    ],
  },
};

/* Territory of Interest ******************************************************/

m.areas = {};
m.areas.source = ee.FeatureCollection(
  "users/VicenzaInnovationLab/istat21-comuni-g")
  .filter(ee.Filter.eq("COD_PROV", 24));  // only Vicenza Province 
m.areas.filtFieldName = "COMUNE";
m.areas.filtFieldVal = "Vicenza";
m.areas.list = m.areas.source.aggregate_array(m.areas.filtFieldName)
  .sort().getInfo();
m.areas.vis = { color: "#000000", width: 2, fillColor: "ff000000" };

/* Time Interval **************************************************************/

m.timeline = {};
m.timeline.format = "YYYY-MM-dd";
m.timeline.delta = -3;
m.timeline.start = m.s2.dateStart;
m.timeline.today = ee.Date(Date.now()).format(m.timeline.format);
/* use this code if you want to set the Start date dynamically
m.timeline.start = ee.Date(Date.now()).advance(m.timeline.delta, "year")
          .format(m.timeline.format).getInfo(); */
m.timeline.end = m.timeline.today.getInfo();  // will be reset in the code

/* Other **********************************************************************/

m.bufRadius = 10;  // in a clicked point, in meters

/*******************************************************************************
 * TRANSLATION *
 ******************************************************************************/

// Choose app language: "it", "en" or "ru"
var ln = "it";

// Define a JSON object for storing multilingual strings
var t = {};

t.title = {
  it: "Cambiamenti del verde nel vicentino",
  en: "Green Space and its Changes in the Vicenza Province",
  ru: "Изменения в растительном покрове в провинции Виченцы",
};

t.intro = {
  it: "Seleziona un comune per osservare i cambiamenti della \
  vegetazione dall'aprile 2017 fino ad oggi. Per vedere una dinamica \
  dettagliata in un punto specifico clicca sulla mappa e aspetta un po' - i \
  calcoli che creano il grafico vengono eseguiti nel tempo reale.",
  en: "Select a municipality to observe the changes of the vegetation cover \
  since April 2017. Click on the map to see a detailed dynamic at a specific \
  point and wait a while — the calculations that create the chart are done \
  in real time.",
  ru: "Выберите муниципалитет, чтобы увидеть изменения в растительном \
  покрове с апреля 2017 г. Для изучения динамики в определенной точке надо \
  кликнуть на карту и немного подождать — вычисления, которые создают график, \
  выполняются в режиме реального времени.",
};

/* Chart **********************************************************************/

t.chart = {};
t.chart.placeholder = {
  it: "👉 clicca sulla mappa per calcolare la serie temporale...",
  en: "👉 click on the map to calculate the time series...",
  ru: "👉 нажмите на карту, чтобы построить график...",
};
t.chart.title = {
  it: "Dinamica nel punto interrogato",
  en: "Dynamics at the Clicked Point",
  ru: "Динамика в выбранной точке",
};
t.chart.vAxis = {
  it: "Indice NDVI",
  en: "NDVI",
  ru: "Индекс NDVI",
};
t.chart.hAxis = {
  it: "Numeri di giorni in un anno (1-365)",
  en: "Day-of-Year Numbers (1–365)",
  ru: "Порядковый номер дня в году (1–365)"
};

/* Chart Notes ****************************************************************/

t.chartNote = {};
t.chartNote.title = {
  it: "Note sull'interpretazione del grafico",
  en: "Chart Interpretation Notes",
  ru: "Пояснения по интерпретации графика"
};
t.chartNote.section = {};
t.chartNote.section[1] = {
  it: "L'asse Y mostra i valori dell'indice NDVI, da -1 a 1. Sull'asse X ci \
  sono i numeri del giorno, da 1 a 365. Ogni anno è rappresentato da una \
  curva singola. Pertanto, è possibile confrontare come cambia l'NDVI negli \
  stessi giorni in anni diversi. Per aprire un grafico in una finestra \
  separata o scaricare dati, fai clic sul pulsante in alto a destra dal grafico.",
  en: "The Y-axis shows the values of the NDVI index, from -1 to 1. On the \
  X-axis, there are the day numbers, from 1 to 365. Each year is represented \
  by a separate curve. Thus, it is possible to compare how the NDVI changes \
  on the same days in different years. To open a chart in a separate window \
  or download data, click the button at the top right of it.",
  ru: "На оси Y показаны значения индекса NDVI, от -1 до 1. На оси X \
  расположены номера дней, от 1 до 365. Каждый год представлен отдельной \
  кривой. Таким образом, можно сравнить, как меняется NDVI в одни и те же дни \
  в разные годы. Чтобы открыть график в отдельном окне или скачать данные, \
  нажми на кнопку вверху справа от него."
};
t.chartNote.section[2] = {
  it: "",
  en: "",
  ru: ""
};
t.chartNote.section[3] = {
  it: "",
  en: "",
  ru: ""
};
t.chartNote.body = {};
t.chartNote.body[1] = {
  it: "Valori negativi di NDVI (valori prossimi a −1) corrispondono all'acqua.",
  en: "Negative NDVI values ​(​close to −1) correspond to water.",
  ru: "Отрицательные значения NDVI, близкие к −1, соответствуют воде."
};
t.chartNote.body[2] = {
  it: "Valori prossimi allo zero (da −0,1 a 0,1) corrispondono generalmente ad aree aride di roccia, sabbia o neve.",
  en: "Values ​​close to zero (from −0.1 to 0.1) generally correspond to arid rocky areas, sand or snow.",
  ru: "Значения, близкие к нулю (от −0,1 до 0,1), обычно соответствуют засушливым каменистым участкам, песку или снегу."
};
t.chartNote.body[3] = {
  it: "Valori bassi e positivi rappresentano arbusti e prati (da 0,2 a 0,4 circa), mentre valori alti indicano foreste pluviali temperate e tropicali (valori prossimi a 1).",
  en: "Low and positive values ​represent shrubs and meadows (from 0.2 to 0.4 approx.), while high values ​indicate temperate and tropical rainforests (values ​close to 1)",
  ru: "Низкие и положительные значения соответствуют кустарниковой и луговой растительности (примерно от 0,2 до 0,4), а высокие значения указывают на влажные леса умеренного и тропического пояса (значения, близкие к 1)."
};

/* Map Layers *****************************************************************/

t.layers = {};
t.layers.point = {
  it: "Punto interrogato",
  en: "Clicked Point",
  ru: "Выбранная точка",
};
t.layers.vector = {
  it: "Limiti amministrativi",
  en: "Administrative Limits",
  ru: "Административные границы",
};
t.layers.raster = {
  it: "Mappa di cambiamenti",
  en: "Difference map",
  ru: "Карта изменений",
};

t.legend = {};
t.legend.title = {
  it: "Cambiamenti del verde",
  en: "Green Cover Trends",
  ru: "Тренды растительного покрова"
};
t.legend.min = { it: "decremento", en: "decrease", ru: "понижение" };
t.legend.mid = { it: "assenza", en: "absence", ru: "отсутствие" };
t.legend.max = { it: "aumento", en: "increase", ru: "увеличение" };

/* Interface Elements *********************************************************/

t.areaSelectorLabel = {
  it: "Scegli un comune",
  en: "Select a municipality",
  ru: "Выберите муниципалитет",
};

t.timeline = {};
t.timeline.start = { it: "Inizio: ", en: "Start: ", ru: "Начало: " };
t.timeline.end = { it: "Fine: ", en: "End: ", ru: "Конец: " };

/* About **********************************************************************/

t.about = {};

t.about.version = {
  it: "Versione dell'app: ",
  en: "App Version: ",
  ru: "Версия приложения: "
};

t.about.funding = {
  it: "Il progetto è parte del Programma Operativo Regionale del Fondo \
  Europeo di Sviluppo Regionale (POR FESR 2014-2020) del Veneto, \
  nell'ambito del bando dell'azione 231 volto alla “costituzione di \
  Innovation Lab diretti al consolidamento / sviluppo del network Centri \
  P3@-Palestre Digitali e alla diffusione della cultura degli Open Data”.",
  en: "The project is part of the Regional Operational Program of \
  the European Regional Development Fund (ROP ERDF 2014-2020) of \
  Veneto, in the context of the call for the action 231 \
  aimed at “Constitution of Innovation Labs directed to the \
  consolidation / development of the network of Centri P3@-Palestre \
  Digitali and the spread of the open data culture.”",
  ru: "Проект является частью региональной операционной программы \
  Европейского фонда регионального развития (ROP ERDF 2014-2020) \
  области Венето, в контексте консурса, проведённого в действии №231, \
  нацеленного на «создание инновационных лабораторий, направленных на \
  консолидацию / развитие сети Centri P3@-Palestre Digitali и \
  распространение культуры открытых данных».",
};
t.about.closeButton = { it: "Chiudi", en: "Close", ru: "Закрыть" };
t.about.openButton = {
  it: "Innovation Lab Vicenza",
  en: "About",
  ru: "О проекте"
};
t.about.title = {
  it: "Più informazioni",
  en: "More info",
  ru: "Больше информации",
};
t.about.data = {
  it: "• Dati satellitari: Sentinel-2 MSI MultiSpectral Instrument, Level-1C",
  en: "• Satellite Data: Sentinel-2 MSI MultiSpectral Instrument, Level-1C",
  ru: "• Спутниковые данные: Sentinel-2 MSI MultiSpectral Instrument, Level-1C"
};
t.about.refs = {
  it: "• Codice sorgente e documentazione: GitHub dell'Innovation Lab Vicenza",
  en: "• Source code and documentation: GitHub of the Innovation Lab Vicenza",
  ru: "• Исходный код и документация: страница Innovation Lab Vicenza на GitHub"
};

/* Console Printing ***********************************************************/

t.console = {};
t.console.totalImages = {
  "it": "Immagini in collezione Sentinel-2:",
  "en": "Images in the Sentinel-2 collection:",
  "ru": "Изображений в коллекции Sentinel-2:",
};

/*******************************************************************************
 * COMPONENTS *
 ******************************************************************************/

// Define a JSON object for storing UI components
var c = {};

c.title = ui.Label(t.title[ln]);
c.intro = ui.Label(t.intro[ln]);

/* Area Selector **********************************************************/

c.selectArea = {};
c.selectArea.label = ui.Label(t.areaSelectorLabel[ln]);
c.selectArea.selector = ui.Select({
  items: m.areas.list,
  placeholder: t.chart.placeholder[ln],
  onChange: aoiNameHandler
});

c.selectArea.panel = ui.Panel({
  widgets: [c.selectArea.label, c.selectArea.selector],
  layout: ui.Panel.Layout.flow("horizontal")
});

/* Chart **********************************************************************/

c.chart = {};
c.chart.placeholder = ui.Label(t.chart.placeholder[ln]);
c.chart.panel = ui.Panel();

/* Chart Notes ****************************************************************/

c.chartNote = {};
c.chartNote.title = ui.Label(t.chartNote.title[ln]);

c.chartNote.section = {};
c.chartNote.section[1] = ui.Label(t.chartNote.section[1][ln]);
c.chartNote.section[2] = ui.Label(t.chartNote.section[2][ln]);
c.chartNote.section[3] = ui.Label(t.chartNote.section[3][ln]);

c.chartNote.body = {};
c.chartNote.body[1] = ui.Label(t.chartNote.body[1][ln]);
c.chartNote.body[2] = ui.Label(t.chartNote.body[2][ln]);
c.chartNote.body[3] = ui.Label(t.chartNote.body[3][ln]);

/* Legend *********************************************************************/

c.legend = {};
c.legend.title = ui.Label(t.legend.title[ln]);
c.legend.bar = {};
c.legend.bar.colors = ui.Thumbnail({
  image: ee.Image.pixelLonLat().select(0),
  params: {
    min: 0,
    max: 1,
    palette: m.s2.vis.palette,
    bbox: [0, 0, 1, 0.1],
    dimensions: "100x10",
    format: "png",
  }
});

c.legend.bar.min = ui.Label(t.legend.min[ln]);
c.legend.bar.mid = ui.Label(t.legend.mid[ln]),
  c.legend.bar.max = ui.Label(t.legend.max[ln]);

c.legend.bar.labels = ui.Panel({
  widgets: [c.legend.bar.min, c.legend.bar.mid, c.legend.bar.max],
  layout: ui.Panel.Layout.flow("horizontal")
});

c.legend.panel = ui.Panel(
  [c.legend.title, c.legend.bar.colors, c.legend.bar.labels], null, {}
);

/* About Panel ****************************************************************/

c.about = {};

c.about.title = ui.Label(t.about.title[ln]);
c.about.logo = ui.Thumbnail({
  image: ee.Image("users/VicenzaInnovationLab/logo-progetto"),
  params: { min: 0, max: 255 }
});
c.about.funding = ui.Label(t.about.funding[ln]);
c.about.version = ui.Label(t.about.version[ln] + appVersion);

c.about.dataSource = ui.Label({
  value: t.about.data[ln],
  targetUrl: m.s2.url
});
c.about.gitHub = ui.Label({
  value: t.about.refs[ln],
  targetUrl: "https://github.com/VicenzaInnovationLab/ee-verde-nel-vicentino"
});

c.about.closeButton = ui.Button({
  label: t.about.closeButton[ln],
  onClick: function () {
    c.about.openButton.style().set("shown", true);
    c.about.panel.style().set("shown", false);
  }
});
c.about.openButton = ui.Button({
  label: t.about.openButton[ln],
  onClick: function () {
    c.about.openButton.style().set("shown", false);
    c.about.panel.style().set("shown", true);
  }
});

c.about.panel = ui.Panel([
  c.about.logo,
  c.about.funding,
  c.about.version,
  c.about.title,
  c.about.dataSource,
  c.about.gitHub,
  c.about.closeButton]
);

/* Control Panel  *************************************************************/

c.controlPanel = ui.Panel([
  c.title,
  c.intro,
  makePanelBreak(),
  c.selectArea.panel,
  makePanelBreak(),
  c.chart.panel,
  makePanelBreak(),
  c.chartNote.title,
  c.chartNote.section[1],
  c.chartNote.body[1],
  c.chartNote.body[2],
  c.chartNote.body[3],
]);

/*******************************************************************************
 * Composition *
 ******************************************************************************/

ui.root.insert(0, c.about.panel);
ui.root.insert(2, c.controlPanel);

Map.add(c.about.openButton);
Map.add(c.legend.panel);

Map.onClick(mapClickHandler);

/*******************************************************************************
 * STYLING *
 ******************************************************************************/

// Define a JSON object for defining CSS-like class style properties
var s = {};

/* Style Definitions **********************************************************/

// Color palettes

s.colors = {};
s.colors.brand = {
  grigio0: "#e4e4e4",  // backgrounds
  grigio1: "#a0a3a6",
  rosso0: "#f3a4a4",  // backgrounds
  rosso1: "#ea4f4d",
  rosso2: "#e52323",
  rosso3: "#b71c1a",  // titles
  blu: "#0d5a8c"  // subtitles
};
s.colors.chart = {
  mainCurve: "#00ff00",
  trend: "#e52323",
  areaBackground: "#4e4e4e",
  gridline: "#3b3b3b"
};

// Main text styles

s.text = {};
s.text.title = {
  fontSize: "26px",
  fontWeight: "bold",
  color: s.colors.brand.rosso3
};
s.text.justified = { textAlign: "justify", stretch: "horizontal" };
s.text.leftAligned = { textAlign: "left", stretch: "horizontal" };
s.text.chartNote = {};
s.text.chartNote.title = { fontWeight: "bold", fontSize: "16px" };
s.text.chartNote.section = { fontWeight: "bold" };

// Timeline

s.timeline = {};
s.timeline.selector = { width: "72%" };
s.timeline.label = { stretch: "both" };

// Chart

s.chart = {};
s.chart.placeholder = { color: s.colors.brand.rosso1, fontSize: 14 };
s.chart.title = {
  color: s.colors.brand.blu,
  fontSize: 16,
  bold: true,
  italic: false
};
s.chart.axis = {
  color: s.colors.brand.blu,
  fontSize: 12,
  bold: false,
  italic: false
};
s.chart.default = {
  color: s.colors.brand.blu,
  fontSize: 11,
  bold: false,
  italic: false
};

s.chart.options = {};
s.chart.options.title = t.chart.title[ln];
s.chart.options.titleTextStyle = s.chart.title;

s.chart.options.pointSize = 3;
s.chart.options.lineWidth = 2;
s.chart.options.interpolateNulls = true;

s.chart.options.vAxis = {
  title: t.chart.vAxis[ln],
  textStyle: s.chart.default,
  titleTextStyle: s.chart.axis,
  gridlines: { color: s.colors.chart.gridline }
};
s.chart.options.hAxis = {
  title: t.chart.hAxis[ln],
  textStyle: s.chart.default,
  titleTextStyle: s.chart.axis,
  gridlines: { color: s.colors.chart.gridline },
};
//s.chart.options.curveType = "function";
//s.chart.options.colors = [s.colors.chart.mainCurve];
//s.chart.options.legend = {textStyle: s.chart.axis};
s.chart.options.chartArea = { backgroundColor: s.colors.chart.areaBackground };

// Legend panel

s.legend = {};
s.legend.title = { fontWeight: "bold", fontSize: "12px" };
s.legend.minMax = { margin: "4px 8px", fontSize: "12px" };
s.legend.mid = {
  margin: "4px 8px",
  textAlign: "center",
  stretch: "horizontal",
  fontSize: "12px"
};

// About panel

s.about = {};
s.about.button = { position: "bottom-left", "shown": true };
s.about.link = { color: s.colors.brand.blu };

/* Style Settings *************************************************************/

c.controlPanel.style().set({
  width: "25%",
  border: "1px solid black",
  padding: "10px"
});
c.title.style().set(s.text.title);
c.intro.style().set(s.text.justified);

// Area selector

c.selectArea.label.style().set({ stretch: "vertical" });
c.selectArea.selector.style().set({ stretch: "horizontal" });

// Chart

c.chart.placeholder.style().set(s.chart.placeholder);

// Chart notes

c.chartNote.title.style().set(s.text.chartNote.title);

c.chartNote.section[1].style().set(s.text.chartNote.section);
c.chartNote.section[2].style().set(s.text.chartNote.section);
c.chartNote.section[3].style().set(s.text.chartNote.section);

// About

c.about.panel.style().set({ width: "400px", shown: false });
c.about.openButton.style().set(s.about.button);
c.about.closeButton.style().set(s.about.button);

c.about.title.style().set({ fontSize: "20px", fontWeight: "bold" });
c.about.logo.style().set({ width: "200px" });
c.about.funding.style().set(s.text.leftAligned);
c.about.gitHub.style().set(s.about.link);
c.about.dataSource.style().set(s.about.link);

// Legend

c.legend.panel.style().set({ width: "25%" });
c.legend.bar.colors.style().set({
  stretch: "horizontal",
  margin: "0px 8px",
  maxHeight: "20px"
});
c.legend.title.style().set(s.legend.title);
c.legend.bar.min.style().set(s.legend.minMax);
c.legend.bar.max.style().set(s.legend.minMax);
c.legend.bar.mid.style().set(s.legend.mid);

/*******************************************************************************
 * BEHAVIORS *
 ******************************************************************************/

var aoi, maskedColl, composite;

function applyFilters(targetCollection) {
  return targetCollection
    .map(renameBands(m.s2.bandIds, m.s2.bandNames))
    .filter(ee.Filter.date(m.timeline.start, m.timeline.end))
    .filter(ee.Filter.bounds(aoi))
    .filter(ee.Filter.lt(m.s2.cloudAttribute, 60))
    .map(maskClouds)
    .map(addNDVI)
    .map(createTimeBand);
}

function createTimeBand(image) {
  // Scale milliseconds by a large constant to avoid very small slopes
  // in the linear regression output.
  return image.addBands(image.metadata("system:time_start").divide(1e12));
}


function maskClouds(image) {
  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = ee.Number(2).pow(10).int();
  var cirrusBitMask = ee.Number(2).pow(11).int();
  var qa = image.select("BQA");
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask);
}

// Rename bands
function renameBands(oldBands, newBands) {
  var wrap = function (image) {
    return image.select(oldBands).rename(newBands);
  };
  return wrap;
}

// Compute and add a Normalized Difference VEGETATION Index band
function addNDVI(image) {
  // bands in the image must be renamed to fit "NIR" and "RED"
  var ndviBand = image.normalizedDifference(["NIR", "RED"]).rename("NDVI");
  return image.addBands(ndviBand);
}

function makeComposite(targetCollection) {
  // y = k * x + b 
  // k - NDVI trend, positive or negative ('slope' in math / 'scale' in EE);
  // x - date; у - NDVI value for x; b - original NDVI series offset
  var comp = targetCollection.select(["system:time_start", "NDVI"]);
  // linearFit returns 'scale' and 'offset' bands
  return comp.reduce(ee.Reducer.linearFit()).select("scale").clip(aoi);
}

function makePanelBreak() {
  return ui.Panel(
    {
      style: {
        stretch: "horizontal",
        height: "1px",
        backgroundColor: "grey",
        margin: "8px 0px"
      }
    });
}

function aoiNameHandler(selectedName) {
  m.areas.filtFieldVal = selectedName;
  updateMap();
  Map.centerObject(aoi);
  c.chart.panel.widgets().set(0, c.chart.placeholder);
}

function startDateHandler(dateRange) {
  m.timeline.start = dateRange.start();
  updateMap();
}

function endDateHandler(dateRange) {
  m.timeline.end = dateRange.start();
  updateMap();
}

function updateMap() {
  aoi = m.areas.source.filter(ee.Filter.eq(m.areas.filtFieldName, m.areas.filtFieldVal));
  maskedColl = applyFilters(m.s2.source);
  print(maskedColl.size());
  composite = makeComposite(maskedColl);
  var compositeLayer = ui.Map.Layer(composite, m.s2.vis, t.layers.raster[ln]);
  var borderLayer = ui.Map.Layer(aoi.style(m.areas.vis), {}, t.layers.vector[ln]);
  Map.layers().set(0, compositeLayer);
  //Map.layers().set(1, borderLayer);  // add administrative boundaries
}

function mapClickHandler(coords) {
  var clickedPoint = ee.FeatureCollection(ee.Feature(ee.Geometry.Point(coords.lon, coords.lat)));
  var clickedPointLayer = ui.Map.Layer(
    clickedPoint,
    { color: "green" },
    t.layers.point[ln]
  );
  Map.layers().set(2, clickedPointLayer);

  var chart = ui.Chart.image.doySeriesByYear({
    imageCollection: maskedColl,
    bandName: "NDVI",
    region: aoi,
    regionReducer: ee.Reducer.median(),
    scale: 10,
    sameDayReducer: ee.Reducer.median(),
    startDay: 1,
    endDay: 365
  })
    //   var chart = ui.Chart.image.series({
    //     imageCollection: maskedColl.select("NDVI"),
    //     region: clickedPoint,
    //     reducer: ee.Reducer.mean(),
    //     scale: 500,
    //   })
    .setOptions(s.chart.options);
  c.chart.panel.widgets().set(0, chart);
}

function getScreenType(screen) {
  if (screen.is_desktop) {
    c.controlPanel.style().set({ width: "25%" });  // true case
  } else {
    c.controlPanel.style().set({ width: "50%" });  // false case
  }
}
// "is_mobile", "is_tablet", "is_desktop", "is_portrait"
// and "is_landscape", and numeric fields "width" and "height"

/*******************************************************************************
 * INITIALIZE *
 ******************************************************************************/

c.selectArea.selector.setValue(m.areas.filtFieldVal);

// Render the map
Map.setOptions("HYBRID");
updateMap();

// Responsible app interface
ui.root.onResize(getScreenType);
