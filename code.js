/*******************************************************************************
 * Code style *
 * 
 *  - use camelCase for function and variable names
 *  - use double quotes by default
 *  - use double space after your code and before // in inline comments
 ******************************************************************************/

/*******************************************************************************
 * Model *
 ******************************************************************************/

// Define a JSON object for storing the data model
var m = {};

/* Night-time Imagery *********************************************************/
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
    min: 0,
    max: 1,
    opacity: 0.6,
    palette: [
      "#ED0103", "#FF9700", "#FFE500",
      "#79CC01",
      "#189002", "#007800", "004400"
    ],
  },
};

/* Territory of Interest ******************************************************/
m.provinces = {};
m.provinces.source = ee.FeatureCollection(
  "users/VicenzaInnovationLab/istat21-province-g")
  .filter(ee.Filter.eq("COD_REG", 5));  // Veneto Region provinces
m.provinces.filtFieldName = "DEN_UTS";
m.provinces.filtFieldVal = "Vicenza";
m.provinces.list = m.provinces.source.aggregate_array(m.provinces.filtFieldName)
                   .sort().getInfo();
m.provinces.vis = {color: "#000000", width: 2, fillColor: "ff000000"};
m.provinces.zoom = 10;

/* Time Interval **************************************************************/
m.timeline = {};
m.timeline.format = "YYYY-MM-dd";
m.timeline.deltaDays = -30;
m.timeline.today = ee.Date(Date.now()).format(m.timeline.format);
m.timeline.start = ee.Date(Date.now()).advance(m.timeline.deltaDays, "day")
                   .format(m.timeline.format).getInfo();  // will be reset in the code
m.timeline.end = m.timeline.today.getInfo();  // will be reset in the code
m.timeline.dateInfo = {
  start: {selected: ""},
  end: {selected: ""}
};

/* Other **********************************************************************/
m.bufRadius = 20;  // in a clicked point, in meters

/*******************************************************************************
 * Translation *
 ******************************************************************************/

// Choose app language: "it", "en" or "ru"
var ln = "it";  

// Define a JSON object for storing translated text
var t = {};

t.title = {
  it: "Cambiamenti del verde nel vicentino",
  en: "Green Space and its Changes in the Vicenza Province",
  en: "Изменения в растительном покрове в провинции Виченцы",
};

t.intro = {
  it: "Seleziona una provincia e un periodo per osservare i cambiamenti della \
  vegetazione. Per vedere una dinamica in un punto specifico clicca sulla \
  mappa e aspetta un po' - i calcoli che creano il grafico vengono eseguiti \
  nel tempo reale.",
  en: "Select the province and time period to observe the changes of the \
  vegetation cover. Click on the map to see a dynamic at a specific point and \
  wait a while - the calculations that create the chart are done in real time.",
  ru: "Выберите провинцию и период времени, чтобы увидеть изменения в \
  растительном покрове. Для изучения динамики в определенной точке надо \
  кликнуть на карту и немного подождать - вычисления, которые создают график, \
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
  it: "NDVI",
  en: "NDVI",
  ru: "Индекс NDVI",
};
t.chart.hAxis = {it: "Data", en: "Date", ru: "Дата"};
t.chart.trend = {it: "Trend", en: "Trend", ru: "Тренд"},
t.chart.series = {it: "NDVI", en: "NDVI", ru: "NDVI"};

/* Chart Notes ****************************************************************/

t.chartNote = {};
t.chartNote.title = {
  it: "Note sull'interpretazione del grafico",
  en: "Chart Interpretation Notes",
  ru: "Пояснения по интерпретации графика"
};
t.chartNote.section = {};
t.chartNote.section[1] = {
  it: "Attenzione: la curva NDVI potrebbe interrompersi in assenza di dati \
  Sentinel-2 (ad esempio, a causa dell'elevata nuvolosità).",
  en: "Attention: the NDVI curve may be interrupted in case of the lack of \
  Sentinel-2 data (e.g. due to high cloudiness).",
  ru: "Внимание: кривая изменения индекса NDVI может прерываться в случае \
  отсутствия данных Sentinel-2 (например, из-за высокой облачности."
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
  it: "Valori negativi di NDVI (valori prossimi a -1) corrispondono all'acqua.",
  en: "Negative NDVI values ​​(​​close to -1) correspond to water.",
  ru: "Отрицательные значения NDVI, близкие к -1, соответствуют воде."
};
t.chartNote.body[2] = {
  it: "Valori prossimi allo zero (da -0,1 a 0,1) corrispondono generalmente ad aree aride di roccia, sabbia o neve.",
  en: "Values ​​close to zero (from -0.1 to 0.1) generally correspond to arid rocky areas, sand or snow.",
  ru: "Значения, близкие к нулю (от -0,1 до 0,1), обычно соответствуют засушливым каменистым участкам, песку или снегу."
};
t.chartNote.body[3] = {
  it: "Valori bassi e positivi rappresentano arbusti e prati (da 0,2 a 0,4 circa), mentre valori alti indicano foreste pluviali temperate e tropicali (valori prossimi a 1).",
  en: "Low and positive values ​​represent shrubs and meadows (from 0.2 to 0.4 approx.), while high values ​​indicate temperate and tropical rainforests (values ​​close to 1)",
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
  it: "Mappa NDVI (mediana)",
  en: "Median NDVI map",
  ru: "Карта распределения NDVI (медиана)",
};
t.layers.basemap = {it: "Mappa chiara", en: "Silver map", ru: "Светлая карта"};

/* Interface Elements *********************************************************/

t.provinceSelectorLabel = {
  it: "Scegli una provincia",
  en: "Select a province",
  ru: "Выберите провинцию",
};

t.timeline = {};
t.timeline.start = {it: "Inizio: ", en: "Start: ", ru: "Начало: "};
t.timeline.end = {it: "Fine: ", en: "End: ", ru: "Конец: "};

/* About **********************************************************************/

t.about = {};
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
t.about.closeButton = {it: "Chiudi", en: "Close", ru: "Закрыть"};
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
 * Components *
 ******************************************************************************/

// Define a JSON object for storing UI components
var c = {};

c.title = ui.Label(t.title[ln]);
c.intro = ui.Label(t.intro[ln]);

/* Province Selector **********************************************************/

c.selectProvince = {};
c.selectProvince.label = ui.Label(t.provinceSelectorLabel[ln]);
c.selectProvince.selector = ui.Select({
  items:  m.provinces.list,
  placeholder: t.chart.placeholder[ln],
  onChange: aoiNameHandler
});

c.selectProvince.panel = ui.Panel({
  widgets: [c.selectProvince.label, c.selectProvince.selector],
  layout: ui.Panel.Layout.flow("horizontal")
});

/* Timeline *******************************************************************/

c.timeline = {};

// Start
c.timeline.start = {};
c.timeline.start.label = ui.Label(t.timeline.start[ln]);

c.timeline.start.selector = ui.DateSlider({
  start: m.s2.dateStart,
  period: 1,
  onChange: startDateHandler
});
c.timeline.start.panel = ui.Panel({
  widgets: [c.timeline.start.label, c.timeline.start.selector],
  layout: ui.Panel.Layout.flow("horizontal")
});

// End
c.timeline.end = {};
c.timeline.end.label = ui.Label(t.timeline.end[ln]);
c.timeline.end.selector = ui.DateSlider({
  start: m.s2.dateStart,
  period: 1,
  onChange: endDateHandler
});
c.timeline.end.panel = ui.Panel({
  widgets: [c.timeline.end.label, c.timeline.end.selector],
  layout: ui.Panel.Layout.flow("horizontal")
});

c.timeline.panel = ui.Panel({
  widgets: [c.timeline.start.panel, c.timeline.end.panel],
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
c.legend.title = ui.Label(t.chart.vAxis[ln]);
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

c.legend.bar.min = ui.Label(m.s2.vis.min);
c.legend.bar.mid = ui.Label(m.s2.vis.max / 2),
c.legend.bar.max = ui.Label(m.s2.vis.max);

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
  params: {min: 0, max: 255}
});
c.about.funding = ui.Label(t.about.funding[ln]);

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
  onClick: function() {
    c.about.openButton.style().set("shown", true);
    c.about.panel.style().set("shown", false);
  }
});
c.about.openButton = ui.Button({
  label: t.about.openButton[ln],
  onClick: function() {
    c.about.openButton.style().set("shown", false);
    c.about.panel.style().set("shown", true);
  }
});

c.about.panel = ui.Panel([
  c.about.logo,
  c.about.funding,
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
  c.selectProvince.panel,
  c.timeline.panel,
  makePanelBreak(),
  c.chart.panel,
  makePanelBreak(),
  c.chartNote.title,
  c.chartNote.section[1],
  c.chartNote.body[1],
  c.chartNote.body[2],
  c.chartNote.body[3],
]);

/* Custom Base Map ************************************************************/
c.basemap = {
  mapTypeId: t.layers.basemap[ln],
  styles: {},
  types: [t.layers.basemap[ln]]
};

/*******************************************************************************
 * Composition *
 ******************************************************************************/

ui.root.insert(0, c.about.panel);
ui.root.insert(2, c.controlPanel);

Map.add(c.about.openButton);
Map.add(c.legend.panel);

Map.onClick(mapClickHandler);

/*******************************************************************************
 * Styling *
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
s.text.justified = {textAlign: "justify", stretch: "horizontal"};
s.text.leftAligned = {textAlign: "left", stretch: "horizontal"};
s.text.chartNote = {};
s.text.chartNote.title = {fontWeight: "bold", fontSize: "16px"};
s.text.chartNote.section = {fontWeight: "bold"};

// Timeline
s.timeline = {};
s.timeline.selector = {width: "72%"};
s.timeline.label = {stretch: "both"};

// Chart
s.chart = {};
s.chart.placeholder = {color: s.colors.brand.blu, fontSize: 14};
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
s.chart.options.curveType = "function";
s.chart.options.colors = [s.colors.chart.mainCurve];
s.chart.options.legend = {textStyle: s.chart.axis};
s.chart.options.chartArea = {backgroundColor: s.colors.chart.areaBackground};
s.chart.options.trendlines = {};
s.chart.options.trendlines[0] = {
  title: t.chart.trend[ln],
  type: "polynomial",
  color: s.colors.chart.trend,
  lineWidth: 2,
  opacity: 0.9,
  visibleInLegend: true
};

// Legend panel
s.legend = {};
s.legend.title = {fontWeight: "bold", fontSize: "12px"};
s.legend.minMax = {margin: "4px 8px", fontSize: "12px"};
s.legend.mid = {
  margin: "4px 8px",
  textAlign: "center",
  stretch: "horizontal",
  fontSize: "12px"
};

// About panel
s.aboutButton = {position: "bottom-left", "shown": true};

// Base map
s.silverBasemap = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];

/* Style Settings *************************************************************/

c.controlPanel.style().set({
  width: "25%",
  border: "1px solid black",
  padding: "10px"
});
c.title.style().set(s.text.title);
c.intro.style().set(s.text.justified);

// Province selector
c.selectProvince.label.style().set({stretch: "vertical"});
c.selectProvince.selector.style().set({stretch: "horizontal"});

// Timeline
c.timeline.start.label.style().set(s.timeline.label);
c.timeline.end.label.style().set(s.timeline.label);
c.timeline.start.selector.style().set(s.timeline.selector);
c.timeline.end.selector.style().set(s.timeline.selector);

// Chart
c.chart.placeholder.style().set(s.chart.placeholder);

// Chart notes
c.chartNote.title.style().set(s.text.chartNote.title);

c.chartNote.section[1].style().set(s.text.chartNote.section)
                              .set({color: "#ed5f00"});
c.chartNote.section[2].style().set(s.text.chartNote.section);
c.chartNote.section[3].style().set(s.text.chartNote.section);

// c.chartNote.body[1].style().set({color: s.colors.brand.rosso2});
// c.chartNote.body[2].style().set({color: "#ed5f00"});
// c.chartNote.body[3].style().set({color: "green"});

// About
c.about.panel.style().set({width: "400px", shown: false});
c.about.openButton.style().set(s.aboutButton);
c.about.closeButton.style().set(s.aboutButton);

c.about.title.style().set({fontSize: "20px", fontWeight: "bold"});
c.about.logo.style().set({width: "200px"});
c.about.funding.style().set(s.text.leftAligned);

// Legend
c.legend.panel.style().set({width: "25%"});
c.legend.bar.colors.style().set({
  stretch: "horizontal",
  margin: "0px 8px",
  maxHeight: "20px"
});
c.legend.title.style().set(s.legend.title);
c.legend.bar.min.style().set(s.legend.minMax);
c.legend.bar.max.style().set(s.legend.minMax);
c.legend.bar.mid.style().set(s.legend.mid);

// Basemap
c.basemap.styles[t.layers.basemap[ln]] = s.silverBasemap;

/*******************************************************************************
 * Behaviors *
 ******************************************************************************/

var aoi, filteredColl, maskedColl, composite;

function applyFilters(target_collection) {
  return target_collection
    .map(renameBands(m.s2.bandIds, m.s2.bandNames))
    .filter(ee.Filter.date(m.timeline.start, m.timeline.end))
    .filter(ee.Filter.bounds(aoi))
    .filter(ee.Filter.lt(m.s2.cloudAttribute, 60))
    .map(maskClouds)
    .map(addNDVI);
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
  var wrap = function(image) {
    return image.select(oldBands).rename(newBands);
  };
  return wrap;
}

// Compute and add a Normalized Difference VEGETATION Index band
function addNDVI(image) {
  // bands in the image must be renamed to fit "NIR" and "RED"
  var ndviBand = image.normalizedDifference(["NIR", "RED"]).rename("NDVI");
  return image.addBands(ndviBand)
}

function makeComposite(target_collection) {
  return target_collection.select("NDVI").median().clip(aoi);
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
  m.provinces.filtFieldVal = selectedName;
  updateMap();
  Map.centerObject(aoi, m.provinces.zoom);
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
  aoi = m.provinces.source.filter(ee.Filter.eq(m.provinces.filtFieldName, m.provinces.filtFieldVal));
  filteredColl = applyFilters(m.s2.source);
  maskedColl = filteredColl.map(maskClouds);
  composite = makeComposite(maskedColl);
  var compositeLayer = ui.Map.Layer(composite, m.s2.vis, t.layers.raster[ln]);
  var borderLayer = ui.Map.Layer(aoi.style(m.provinces.vis), {}, t.layers.vector[ln]);
  Map.layers().set(0, compositeLayer);
  Map.layers().set(1, borderLayer);
  // print(m.provinces.filtFieldVal, t.console.totalImages[ln], maskedColl.size());
}

function mapClickHandler(coords) {
  var clickedPoint = ee.FeatureCollection(ee.Feature(ee.Geometry.Point(coords.lon, coords.lat)));
  var clickedPointLayer = ui.Map.Layer(
    clickedPoint,
    {color: "green"},
    t.layers.point[ln]
    );
  Map.layers().set(2, clickedPointLayer);

  var chart = ui.Chart.image.series({
    imageCollection: maskedColl.select("NDVI"),
    region: clickedPoint,
    reducer: ee.Reducer.mean(),
    scale: 500,
  })
    .setSeriesNames([t.chart.series[ln]])
    .setOptions(s.chart.options);
  c.chart.panel.widgets().set(0, chart);
}

/*******************************************************************************
 * Initialize *
 ******************************************************************************/

c.timeline.start.selector.setValue(m.timeline.start);
c.timeline.end.selector.setValue(m.timeline.end);
c.selectProvince.selector.setValue(m.provinces.filtFieldVal);

// Render the map
Map.setOptions(c.basemap);
updateMap();
