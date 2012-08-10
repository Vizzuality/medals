
var
changedLayers = true,
actualLayer, gdpLayer,
view        = "country",
maps        = {}
selectedMap = null,
mapToMove   = null;

popups = {
  actual: { p: new L.CartoDBPopup(), open: false },
  gdp:    { p: new L.CartoDBPopup(), open: false }
};

var
CONFIG = {
  user: '',
  table: 'london_2012_olympic_updated',
  center: new L.LatLng(51.50, -0.12),
  minZoom: 3,
  zoom: 4,
  query: "SELECT ST_X(ST_Centroid(the_geom)) as longitude, ST_Y(ST_Centroid(the_geom)) as latitude, the_geom_webmercator, country_name as name, iso, total_pop, pop_2010 as pop, total_medals_gdp, total_medals, official_medal_ranking, gdp_rank FROM {{table_name}}",
  query_continent: "SELECT ST_X(st_centroid(the_geom)) AS longitude, ST_Y(st_centroid(the_geom)) AS latitude, cartodb_id, name, the_geom_webmercator, (SELECT SUM(pop_2010) pop FROM london_2012_olympic_updated WHERE region_id = c.region_id) as pop, (SELECT SUM(total_medals) total FROM london_2012_olympic_updated WHERE region_id = c.region_id) as total_medals, (SELECT SUM(total_medals_gdp) total_medals_gdp FROM london_2012_olympic_updated WHERE region_id = c.region_id) as total_medals_gdp FROM continents as c",
  interactivity: "official_medal_ranking, gdp_rank, name, total_medals, total_medals_gdp, pop, latitude, longitude",
  interactivity2: "latitude, longitude, name, total_medals, total_medals_gdp, pop",
  tileURL: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
  mapOptionsActual: { inertia: false, attribution: "" },
  mapOptionsGDP:    { inertia: false, attribution: 'Basemap: <a href="http://maps.stamen.com">Stamen</a>' },
    styles: {
      continent: {
        actual: "#london_2012_olympic_updated{ point-file: url(/home/ubuntu/tile_assets/viz2/orangeDot2.svg); point-allow-overlap:true; text-face-name: 'DejaVu Sans Bold'; text-fill:#000; text-size:10; text-halo-fill:rgba(255,255,255,1); text-halo-radius:0; text-line-spacing:1; text-wrap-width:20; text-opacity:.7; text-allow-overlap:true; text-name:'[name]'; line-width:1.3; }" +
          "#london_2012_olympic_updated[total_medals <=334] { point-transform:'scale(2.3)'; }" +
          "#london_2012_olympic_updated[total_medals <=194] { point-transform:'scale(1.8)'; }" +
          "#london_2012_olympic_updated[total_medals <=153] { point-transform:'scale(1.4)'; }" +
          "#london_2012_olympic_updated[total_medals <=39]  { point-transform:'scale(1.2)'; }" +
          "#london_2012_olympic_updated[total_medals <=22]  { point-transform:'scale(1)'; }" +
          "#london_2012_olympic_updated[total_medals <=8]   { point-transform:'scale(0.75)'; }" +
          "#london_2012_olympic_updated[total_medals <=4]   { point-transform:'scale(0.4)'; text-allow-overlap:false; }" +
          "#london_2012_olympic_updated[total_medals <=2]   { point-transform:'scale(0.15)'; }" +
          "#london_2012_olympic_updated[total_medals =0]    { point-transform:'scale(0)'; }",
        gdp: "#london_2012_olympic_updated{ point-file: url(/home/ubuntu/tile_assets/viz2/blueDot2.svg); point-allow-overlap:true; text-face-name: 'DejaVu Sans Bold'; text-fill:#000; text-size:10; text-halo-fill:rgba(255,255,255,1); text-halo-radius:0; text-line-spacing:1; text-wrap-width:20; text-opacity:.7; text-allow-overlap:true; text-name:'[name]'; line-width:1.3; }" +
          "#london_2012_olympic_updated[total_medals_gdp<=248] { point-transform:'scale(2.3)'; }" +
          "#london_2012_olympic_updated[total_medals_gdp<=232] { point-transform:'scale(1.8)'; }" +
          "#london_2012_olympic_updated[total_medals_gdp<=186] { point-transform:'scale(1.4)'; }" +
          "#london_2012_olympic_updated[total_medals_gdp<=64]  { point-transform:'scale(1.2)'; }" +
          "#london_2012_olympic_updated[total_medals_gdp<=12]  { point-transform:'scale(1)'; }" +
          "#london_2012_olympic_updated[total_medals_gdp<=8]   { point-transform:'scale(0.75)'; }" +
          "#london_2012_olympic_updated[total_medals_gdp<=4]   { point-transform:'scale(0.4)'; text-allow-overlap:false; }" +
          "#london_2012_olympic_updated[total_medals_gdp<=2]   { point-transform:'scale(0.15)'; }" +
          "#london_2012_olympic_updated[total_medals_gdp=0]    { point-transform:'scale(0)'; }"
      },
      gdp: "#london_2012_olympic_updated { point-file: url(/home/ubuntu/tile_assets/viz2/blueDot2.svg); point-allow-overlap:true; text-face-name: 'DejaVu Sans Bold'; text-fill:#000; text-size:10; text-halo-fill:rgba(255,255,255,1); text-halo-radius:0; text-line-spacing:1; text-wrap-width:20; text-opacity:.7; text-allow-overlap:true; text-name:'[iso]'; line-width:1.3; } " +
        "#london_2012_olympic_updated [total_medals_gdp <= 122] { point-transform:'scale(2.2)'; } " +
        "#london_2012_olympic_updated [total_medals_gdp <= 60]  { point-transform:'scale(1.7)'; } " +
        "#london_2012_olympic_updated [total_medals_gdp <= 30]  { point-transform:'scale(1.3)'; } " +
        "#london_2012_olympic_updated [total_medals_gdp <= 10]  { point-transform:'scale(1)';   } " +
        "#london_2012_olympic_updated [total_medals_gdp <= 5]   { point-transform:'scale(0.5)'; } " +
        "#london_2012_olympic_updated [total_medals_gdp <= 3.5] { text-allow-overlap:false; point-transform:'scale(0.4)'; } " +
        "#london_2012_olympic_updated [total_medals_gdp <= 2]   { point-transform:'scale(0.3)'; } " +
        "#london_2012_olympic_updated [total_medals_gdp <= 1]   { point-transform:'scale(0.2)'; } " +
        "#london_2012_olympic_updated [total_medals_gdp = 0]    { point-transform:'scale(0)'; } ",
      actual: "#london_2012_olympic_updated { point-file: url(/home/ubuntu/tile_assets/viz2/orangeDot2.svg); point-allow-overlap:true; text-face-name: 'DejaVu Sans Bold'; text-fill:#000; text-size:10; text-halo-fill:rgba(255,255,255,1); text-halo-radius:0; text-line-spacing:1; text-wrap-width:20; text-opacity:.7; text-allow-overlap:true; text-name:'[iso]'; line-width:1.3; }" +
        "#london_2012_olympic_updated [total_medals <= 100] { point-transform:'scale(2.3)'; }" +
        "#london_2012_olympic_updated [total_medals <= 50]  { point-transform:'scale(1.8)'; }" +
        "#london_2012_olympic_updated [total_medals <= 30]  { point-transform:'scale(1.4)'; }" +
        "#london_2012_olympic_updated [total_medals <= 15]  { point-transform:'scale(1.2)'; }" +
        "#london_2012_olympic_updated [total_medals <= 10]  { point-transform:'scale(1)'; }" +
        "#london_2012_olympic_updated [total_medals <= 8]   { point-transform:'scale(0.75)'; }" +
        "#london_2012_olympic_updated [total_medals <= 4]   { point-transform:'scale(0.4)'; text-allow-overlap:false; }" +
        "#london_2012_olympic_updated [total_medals <= 2]   { point-transform:'scale(0.15)'; }" +
        "#london_2012_olympic_updated [total_medals = 0]    { point-transform:'scale(0)'; }"
    }
};

function getLayer(id, popup, otherPopup, style) {

  return new L.CartoDBLayer({
    map: maps[id],
    user_name: CONFIG.user,
    table_name: CONFIG.table,
    query: CONFIG.query,
    tile_style: style,
    interactivity: CONFIG.interactivity,
    featureOver: function(e,latlng,pos,data) {
      document.body.style.cursor = "pointer";
    },
    featureOut: function() {
      document.body.style.cursor = "default";
    },
    featureClick: createInfowindow(id)
  });
}

function createInfowindow(id) {

  return function(e, latlng, pos, data) {

    $(".cartodb-popup").fadeIn(250);
    var
    lat    = data.latitude,
    lng    = data.longitude,
    latLng = new L.LatLng(lat, lng),
    other  = (id == "actual") ? "gdp" : "actual";

    var otherData = jQuery.extend({}, data);

    otherData.id = "map-" + other;
    data.id      = "map-" + id;
    data.kind    = view;

    // Set popup content
    popups[id].p.setContent(data);
    popups[other].p.setContent(otherData);

    // Set latlng
    popups[id].p.setLatLng(latLng);
    popups[other].p.setLatLng(latLng);

    // Show it!
    if (!popups[id].open) maps[id].openPopup(popups[id].p);
    if (!popups[other].open) maps[other].openPopup(popups[other].p);
  };
}


function dblclick(e) {
  var id = $(e.target._container).attr("id");

  mapToMove = (id == "actual") ? "gdp" : "actual";
  maps[mapToMove].panTo(e.target.getCenter());
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

  var zoom = e.target.getZoom();

  if (zoom <= CONFIG.minZoom) $(".zoom_out").addClass("disabled");
  else $(".zoom_out").removeClass("disabled");

  if (zoom == CONFIG.minZoom) {
    changedLayers = false;
    view = "continent";
    actualLayer.setOptions({ interactivity: CONFIG.interactivity2, tile_style: CONFIG.styles.continent.actual, query: CONFIG.query_continent  });
    gdpLayer.setOptions({ interactivity: CONFIG.interactivity2, tile_style: CONFIG.styles.continent.gdp, query: CONFIG.query_continent  });

    $(".cartodb-popup").fadeOut(150);

  } else if (zoom >= CONFIG.minZoom && !changedLayers) {
    changedLayers = true;
    view = "country";

    actualLayer.setOptions({ interactivity: CONFIG.interactivity, tile_style: CONFIG.styles.actual, query: CONFIG.query  });
    gdpLayer.setOptions({ interactivity: CONFIG.interactivity, tile_style: CONFIG.styles.gdp, query: CONFIG.query  });

    if (zoom == CONFIG.minZoom + 1) {
      $(".cartodb-popup").fadeOut(150);
    }
  }

  maps[mapToZoom].setZoom(zoom);



}

function init() {

  // Create the maps
  maps.actual = new L.Map('actual', { minZoom: CONFIG.minZoom, maxZoom: 18, inertia: false, closePopupOnClick: false, zoomControl: false }).setView(CONFIG.center, CONFIG.zoom);
  maps.gdp    = new L.Map('gdp',    { minZoom: CONFIG.minZoom, maxZoom: 18, inertia: false, closePopupOnClick: false, zoomControl: false }).setView(CONFIG.center, CONFIG.zoom);

  maps.actual.on("popupopen",  function() { popups.actual.open = true; });
  maps.actual.on("popupclose", function() { popups.actual.open = false; });

  maps.gdp.on("popupopen",  function() { popups.gdp.open = true; });
  maps.gdp.on("popupclose", function() { popups.gdp.open = false; });

  actualLayer = getLayer("actual", popups.actual, popups.gdp, CONFIG.styles.actual);
  gdpLayer    = getLayer("gdp", popups.gdp, popups.actual, CONFIG.styles.gdp);

  // Layers configuration
  var layers = {
    actual: {
      base: new L.TileLayer(CONFIG.tileURL, CONFIG.mapOptionsActual),
      data: actualLayer
    },
    gdp: {
      base: new L.TileLayer(CONFIG.tileURL, CONFIG.mapOptionsGDP),
      data: gdpLayer
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

  maps.actual.on('dblclick', dblclick);
  maps.gdp.on('dblclick', dblclick);

  $(".zoom_in").on("click", function() {
    var id = $(this).parents(".zoom").siblings('.map').attr("id");
    var zoom = maps[id].getZoom() + 1;
    maps[id].setZoom(zoom);

  });

  $(".zoom_out").on("click", function() {
    var id = $(this).parents(".zoom").siblings('.map').attr("id");
    var zoom;

    if (maps[id].getZoom() > CONFIG.minZoom) {
      zoom = maps[id].getZoom() - 1;

      maps[id].setZoom(zoom);
    }

  });
}
