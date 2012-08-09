var
maps        = {}
selectedMap = null,
mapToMove   = null;


var
CONFIG = {
  user: 'viz2',
  table: 'london_2012_olympic_',
  center: new L.LatLng(36, -3),
  zoom: 4,
  query: "SELECT * FROM {{table_name}}",
  tileURL: 'http:///{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
  mapOptions: { maxZoom: 18, attribution: "Powered by Leaflet and Mapbox", zoomControl: false},
  styles: {
    gdp: "#london_2012_olympic_ { point-file: url(/home/ubuntu/tile_assets/viz2/blueDot2.svg); point-allow-overlap:true; text-face-name: 'DejaVu Sans Bold'; text-fill:#000; text-size:10; text-halo-fill:rgba(255,255,255,1); text-halo-radius:0; text-line-spacing:1; text-wrap-width:20; text-opacity:.7; text-allow-overlap:true; text-name:'[iso]'; line-width:1.3; } " +
      "#london_2012_olympic_ [total_gdp <= 121] { point-transform:'scale(2.2)'; } " +
      "#london_2012_olympic_ [total_gdp <= 60]  { point-transform:'scale(1.7)'; } " +
      "#london_2012_olympic_ [total_gdp <= 30]  { point-transform:'scale(1.3)'; } " +
      "#london_2012_olympic_ [total_gdp <= 10]  { point-transform:'scale(1)';   } " +
      "#london_2012_olympic_ [total_gdp <= 5]   { point-transform:'scale(0.5)'; } " +
      "#london_2012_olympic_ [total_gdp <= 3.5] { text-allow-overlap:false; point-transform:'scale(0.4)'; } " +
      "#london_2012_olympic_ [total_gdp <= 2]   { point-transform:'scale(0.3)'; } " +
      "#london_2012_olympic_ [total_gdp <= 1]   { point-transform:'scale(0.2)'; } " +
      "#london_2012_olympic_ [total_gdp = 0]    { point-transform:'scale(0)'; } ",
    actual: "#london_2012_olympic_ { point-file: url(/home/ubuntu/tile_assets/viz2/orangeDot2.svg); point-allow-overlap:true; text-face-name: 'DejaVu Sans Bold'; text-fill:#000; text-size:10; text-halo-fill:rgba(255,255,255,1); text-halo-radius:0; text-line-spacing:1; text-wrap-width:20; text-opacity:.7; text-allow-overlap:true; text-name:'[iso]'; line-width:1.3; }" +
      "#london_2012_olympic_ [total <= 100] { point-transform:'scale(2.3)'; }" +
      "#london_2012_olympic_ [total <= 50]  { point-transform:'scale(1.8)'; }" +
      "#london_2012_olympic_ [total <= 30]  { point-transform:'scale(1.4)'; }" +
      "#london_2012_olympic_ [total <= 15]  { point-transform:'scale(1.2)'; }" +
      "#london_2012_olympic_ [total <= 10]  { point-transform:'scale(1)'; }" +
      "#london_2012_olympic_ [total <= 8]   { point-transform:'scale(0.75)'; }" +
      "#london_2012_olympic_ [total <= 4]   { point-transform:'scale(0.4)'; text-allow-overlap:false; }" +
      "#london_2012_olympic_ [total <= 2]   { point-transform:'scale(0.15)'; }" +
      "#london_2012_olympic_ [total = 0]    { point-transform:'scale(0)'; }"
  }
};

function getLayer(map, style) {
  return new L.CartoDBLayer({
    map: map,
    user_name: CONFIG.user,
    table_name: CONFIG.table,
    query: CONFIG.query,
    tile_style: style
  });
}

function drag(e) {
  maps[mapToMove].panTo(e.target.getCenter());
}

function dragStart(e) {
  var id = $(e.target._container).attr("id");

  mapToMove = (id == "actual") ? "gdp" : "actual";
}

function zoomEnd(e) {

  var id = $(e.target._container).attr("id");
  var mapToZoom = (id == "actual") ? "gdp" : "actual";

  maps[mapToZoom].setZoom(e.target.getZoom());

}

function init() {

  // Create the maps
  maps.actual = new L.Map('actual', { zoomControl: false }).setView(CONFIG.center, CONFIG.zoom);
  maps.gdp    = new L.Map('gdp',    { zoomControl: false }).setView(CONFIG.center, CONFIG.zoom);

  // Layers configuration
  var layers = {
    actual: {
      base: new L.TileLayer(CONFIG.tileURL, CONFIG.mapOptions),
      data: getLayer(maps.actual, CONFIG.styles.actual)
    },
    gdp: {
      base: new L.TileLayer(CONFIG.tileURL, CONFIG.mapOptions),
      data: getLayer(maps.gdp, CONFIG.styles.gdp)
    }
  };

  // Add layers
  maps.actual.addLayer(layers.actual.base, true);
  maps.actual.addLayer(layers.actual.data);

  maps.gdp.addLayer(layers.gdp.base, true);
  maps.gdp.addLayer(layers.gdp.data);

  // Events
  maps.actual.on('dragstart', dragStart);
  maps.gdp.on('dragstart', dragStart);

  maps.actual.on('drag', drag);
  maps.gdp.on('drag', drag);

  maps.actual.on('zoomend', zoomEnd);
  maps.gdp.on('zoomend', zoomEnd);
}

