var selectedMap = null,
mapToMove = null;

maps = {};

var
CONFIG = {
  user: 'viz2',
  table: 'london_2012_olympic_',
  center: new L.LatLng(36, -3),
  zoom: 4,
  query: "SELECT * FROM {{table_name}}",
  tileURL: 'http://{s}.tiles.mapbox.com/v3/cartodb.map-1nh578vv/{z}/{x}/{y}.png',
  mapOptions: {maxZoom: 18, attribution: "Powered by Leaflet and Mapbox"},
  styles: {
    gdp: "#london_2012_olympic_ { point-file: url(/home/ubuntu/tile_assets/viz2/blueDot2.svg); point-allow-overlap:true; text-face-name: 'DejaVu Sans Bold'; text-fill:#000; text-size:10; text-halo-fill:rgba(255,255,255,1); text-halo-radius:0; text-line-spacing:1; text-wrap-width:20; text-opacity:.7; text-allow-overlap:true; text-name:'[iso]'; line-width:1.3; } " +
      "#london_2012_olympic_ [total_gdp<=121.79] { point-transform:'scale(2.2)'; } " +
      "#london_2012_olympic_ [total_gdp<=60]  { point-transform:'scale(1.7)'; } " +
      "#london_2012_olympic_ [total_gdp<=30]  { point-transform:'scale(1.3)'; } " +
      "#london_2012_olympic_ [total_gdp<=10]  { point-transform:'scale(1)'; } " +
      "#london_2012_olympic_ [total_gdp<=5]   { point-transform:'scale(0.5)'; } " +
      "#london_2012_olympic_ [total_gdp<=3.5] { text-allow-overlap:false; point-transform:'scale(0.4)'; } " +
      "#london_2012_olympic_ [total_gdp<=2]   { point-transform:'scale(0.3)'; } " +
      "#london_2012_olympic_ [total_gdp<=1]   { point-transform:'scale(0.2)'; } " +
      "#london_2012_olympic_ [total_gdp=0]    { point-transform:'scale(0)'; } ",
    actual: "#london_2012_olympic_ { point-file: url(/home/ubuntu/tile_assets/viz2/orangeDot2.svg); point-allow-overlap:true; text-face-name: 'DejaVu Sans Bold'; text-fill:#000; text-size:10; text-halo-fill:rgba(255,255,255,1); text-halo-radius:0; text-line-spacing:1; text-wrap-width:20; text-opacity:.7; text-allow-overlap:true; text-name:'[iso]'; line-width:1.3; }" +
      "#london_2012_olympic_ [total<=100] { point-transform:'scale(2.3)'; }" +
      "#london_2012_olympic_ [total<=50]  { point-transform:'scale(1.8)'; }" +
      "#london_2012_olympic_ [total<=30]  { point-transform:'scale(1.4)'; }" +
      "#london_2012_olympic_ [total<=15]  { point-transform:'scale(1.2)'; }" +
      "#london_2012_olympic_ [total<=10]  { point-transform:'scale(1)'; }" +
      "#london_2012_olympic_ [total<=8]   { point-transform:'scale(0.75)'; }" +
      "#london_2012_olympic_ [total<=4]   { point-transform:'scale(0.4)'; text-allow-overlap:false; }" +
      "#london_2012_olympic_ [total<=2]   { point-transform:'scale(0.15)'; }" +
      "#london_2012_olympic_ [total=0]    { point-transform:'scale(0)'; }"
  }
};

function init() {

  maps.actual = new L.Map('actual').setView(CONFIG.center, CONFIG.zoom);
  maps.gdp    = new L.Map('gdp').setView(CONFIG.center, CONFIG.zoom);

  var mapboxUrl = CONFIG.tileURL,
  mapbox = new L.TileLayer(mapboxUrl, CONFIG.mapOptions);

  var mapboxUrl2 = CONFIG.tileURL,
  mapbox2 = new L.TileLayer(mapboxUrl, CONFIG.mapOptions);

  var gdp = new L.CartoDBLayer({
    map: maps.gdp,
    user_name: CONFIG.user,
    table_name: CONFIG.table,
    query: CONFIG.query,
    tile_style: CONFIG.styles.gdp
  });

  var actual = new L.CartoDBLayer({
    map: maps.actual,
    user_name: CONFIG.user,
    table_name: CONFIG.table,
    query: CONFIG.query,
    tile_style: CONFIG.styles.actual
  });

  maps.actual.addLayer(mapbox, true);
  maps.gdp.addLayer(mapbox2, true);

  maps.actual.addLayer(actual);
  maps.gdp.addLayer(gdp);

  // Events
  maps.actual.on('dragstart', dragstart);
  maps.gdp.on('dragstart', dragstart);

  maps.actual.on('drag', drag);
  maps.gdp.on('drag', drag);

  function drag(e) {
    maps[mapToMove].panTo(e.target.getCenter());
  }

  function dragstart(e) {
    var id = $(e.target._container).attr("id");
    if (id == "actual") mapToMove = "gdp";
    else mapToMove = "actual";
  }

  function dragend() {
    console.log('end');

  }
}

