var
maps        = {}
selectedMap = null,
mapToMove   = null;

popups = {
  actual: { p: new L.CartoDBPopup(), open: false },
  gdp:    { p: new L.CartoDBPopup(), open: false }
};


var
CONFIG = {
  user: 'viz2',
  //table: 'london_2012_olympic_',
  table: 'london_2012_olympic_updated',
  center: new L.LatLng(37, -85),
  zoom: 3,
  //query: "SELECT ST_X(ST_Centroid(the_geom)) as longitude, ST_Y(ST_Centroid(the_geom)) as latitude, the_geom_webmercator, country_name, iso, total_pop, pop_2010, total_gdp, total FROM {{table_name}}",
  query: "SELECT ST_X(ST_Centroid(the_geom)) as longitude, ST_Y(ST_Centroid(the_geom)) as latitude, the_geom_webmercator, country_name, iso, total_pop, pop_2010, total_gdp_updated, total_updated, official_medal_ranking, gdp_rank FROM {{table_name}}",
  tileURL: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
  mapOptionsActual: { maxZoom: 18, attribution: "", zoomControl: false},
  mapOptionsGDP:    { maxZoom: 18, attribution: 'Powered by <a href="http://leaflet.cloudmade.com">Leaflet</a>', zoomControl: false},
  styles: {
    gdp: "#london_2012_olympic_updated { point-file: url(/home/ubuntu/tile_assets/viz2/blueDot2.svg); point-allow-overlap:true; text-face-name: 'DejaVu Sans Bold'; text-fill:#000; text-size:10; text-halo-fill:rgba(255,255,255,1); text-halo-radius:0; text-line-spacing:1; text-wrap-width:20; text-opacity:.7; text-allow-overlap:true; text-name:'[iso]'; line-width:1.3; } " +
      "#london_2012_olympic_updated [total_gdp_updated <= 122] { point-transform:'scale(2.2)'; } " +
      "#london_2012_olympic_updated [total_gdp_updated <= 60]  { point-transform:'scale(1.7)'; } " +
      "#london_2012_olympic_updated [total_gdp_updated <= 30]  { point-transform:'scale(1.3)'; } " +
      "#london_2012_olympic_updated [total_gdp_updated <= 10]  { point-transform:'scale(1)';   } " +
      "#london_2012_olympic_updated [total_gdp_updated <= 5]   { point-transform:'scale(0.5)'; } " +
      "#london_2012_olympic_updated [total_gdp_updated <= 3.5] { text-allow-overlap:false; point-transform:'scale(0.4)'; } " +
      "#london_2012_olympic_updated [total_gdp_updated <= 2]   { point-transform:'scale(0.3)'; } " +
      "#london_2012_olympic_updated [total_gdp_updated <= 1]   { point-transform:'scale(0.2)'; } " +
      "#london_2012_olympic_updated [total_gdp_updated = 0]    { point-transform:'scale(0)'; } ",
    actual: "#london_2012_olympic_updated { point-file: url(/home/ubuntu/tile_assets/viz2/orangeDot2.svg); point-allow-overlap:true; text-face-name: 'DejaVu Sans Bold'; text-fill:#000; text-size:10; text-halo-fill:rgba(255,255,255,1); text-halo-radius:0; text-line-spacing:1; text-wrap-width:20; text-opacity:.7; text-allow-overlap:true; text-name:'[iso]'; line-width:1.3; }" +
      "#london_2012_olympic_updated [total_updated <= 100] { point-transform:'scale(2.3)'; }" +
      "#london_2012_olympic_updated [total_updated <= 50]  { point-transform:'scale(1.8)'; }" +
      "#london_2012_olympic_updated [total_updated <= 30]  { point-transform:'scale(1.4)'; }" +
      "#london_2012_olympic_updated [total_updated <= 15]  { point-transform:'scale(1.2)'; }" +
      "#london_2012_olympic_updated [total_updated <= 10]  { point-transform:'scale(1)'; }" +
      "#london_2012_olympic_updated [total_updated <= 8]   { point-transform:'scale(0.75)'; }" +
      "#london_2012_olympic_updated [total_updated <= 4]   { point-transform:'scale(0.4)'; text-allow-overlap:false; }" +
      "#london_2012_olympic_updated [total_updated <= 2]   { point-transform:'scale(0.15)'; }" +
      "#london_2012_olympic_updated [total_updated = 0]    { point-transform:'scale(0)'; }"
  }
};

function getLayer(id, popup, otherPopup, style) {

  return new L.CartoDBLayer({
    map: maps[id],
    user_name: CONFIG.user,
    table_name: CONFIG.table,
    query: CONFIG.query,
    tile_style: style,
    interactivity: "official_medal_ranking, gdp_rank, country_name, total_updated, total_gdp_updated, pop_2010, total_pop, latitude, longitude",
    featureOver: function(e,latlng,pos,data) {
      document.body.style.cursor = "pointer";
    },
    featureOut: function() {
      document.body.style.cursor = "default";
    },
    featureClick: function(e, latlng, pos, data) {

      var
      lat    = data.latitude,
      lng    = data.longitude,
      latLng = new L.LatLng(lat, lng),
      other  = (id == "actual") ? "gdp" : "actual";

      var otherData = jQuery.extend({}, data);

      otherData.id = "map-" + other;
      data.id      = "map-" + id;

      // Set popup content
      popups[id].p.setContent(data);
      popups[other].p.setContent(otherData);

      // Set latlng
      popups[id].p.setLatLng(latLng);
      popups[other].p.setLatLng(latLng);

      // Show it!
      if (!popups[id].open) maps[id].openPopup(popups[id].p);
      if (!popups[other].open) maps[other].openPopup(popups[other].p);

    },
  });
}

function dragEnd(e) {
  maps[mapToMove].panTo(e.target.getCenter());
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

  maps.actual.on("popupopen", function() { popups.actual.open = true; });
  maps.actual.on("popupclose", function() { popups.actual.open = false; });

  maps.gdp.on("popupopen", function() { popups.gdp.open = true; });
  maps.gdp.on("popupclose", function() { popups.gdp.open = false; });

  // Layers configuration
  var layers = {
    actual: {
      base: new L.TileLayer(CONFIG.tileURL, CONFIG.mapOptionsActual),
      data: getLayer("actual", popups.actual, popups.gdp, CONFIG.styles.actual)
    },
    gdp: {
      base: new L.TileLayer(CONFIG.tileURL, CONFIG.mapOptionsGDP),
      data: getLayer("gdp", popups.gdp, popups.actual, CONFIG.styles.gdp)
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

  maps.actual.on('dragend', dragEnd);
  maps.gdp.on('dragend', dragEnd);

  maps.actual.on('drag', drag);
  maps.gdp.on('drag', drag);

  maps.actual.on('zoomend', zoomEnd);
  maps.gdp.on('zoomend', zoomEnd);

  $(".zoom_in").on("click", function() {
    var id = $(this).parents(".zoom").siblings('.map').attr("id");
    maps[id].setZoom(maps[id].getZoom() + 1);
  });

  $(".zoom_out").on("click", function() {
    var id = $(this).parents(".zoom").siblings('.map').attr("id");

    if (maps[id].getZoom() > 4) {
      maps[id].setZoom(maps[id].getZoom() - 1);
    }

  });
}

