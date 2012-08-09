maps = {};
var
CONFIG = {

};

function init() {

  maps.actual = new L.Map('map-actual').setView(new L.LatLng(36, -3), 4);
  maps.gdp    = new L.Map('map-gdp').setView(new L.LatLng(36, -3), 4);

  var mapboxUrl = 'http://{s}.tiles.mapbox.com/v3/cartodb.map-1nh578vv/{z}/{x}/{y}.png'
  , mapbox = new L.TileLayer(mapboxUrl, {maxZoom: 18, attribution: "Powered by Leaflet and Mapbox"});

  var mapboxUrl2 = 'http://{s}.tiles.mapbox.com/v3/cartodb.map-1nh578vv/{z}/{x}/{y}.png?v=2'
  , mapbox2 = new L.TileLayer(mapboxUrl, {maxZoom: 18, attribution: "Powered by Leaflet and Mapbox"});

  maps.actual.addLayer(mapbox, true);
  maps.gdp.addLayer(mapbox2, true);

}
