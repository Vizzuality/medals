maps = {};
var
CONFIG = {

};

function init() {

  maps.actual = new L.Map('actual').setView(new L.LatLng(36, -3), 4);
  maps.gdp    = new L.Map('gdp').setView(new L.LatLng(36, -3), 4);

  var mapboxUrl = 'http://{s}.tiles.mapbox.com/v3/cartodb.map-1nh578vv/{z}/{x}/{y}.png'
  , mapbox = new L.TileLayer(mapboxUrl, {maxZoom: 18, attribution: "Powered by Leaflet and Mapbox"});

  var mapboxUrl2 = 'http://{s}.tiles.mapbox.com/v3/cartodb.map-1nh578vv/{z}/{x}/{y}.png?v=2'
  , mapbox2 = new L.TileLayer(mapboxUrl, {maxZoom: 18, attribution: "Powered by Leaflet and Mapbox"});

  maps.actual.addLayer(mapbox, true);
  maps.gdp.addLayer(mapbox2, true);

  maps.actual.on('dragstart', dragstart);
  maps.gdp.on('dragstart', dragstart);

  maps.actual.on('drag', drag);
  maps.gdp.on('drag', drag);

  selectedMap, mapToMove = null;

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
