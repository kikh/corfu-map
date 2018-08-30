// The Google Map.
var map;
var rating = "unknown";
var geoJsonOutput;
var downloadLink;

function init() {
  // Initialise the map.
  map = new google.maps.Map(document.getElementById('map-holder'), {
    center: {lat: 39.6197906, lng: 19.9127868},
    zoom: 16,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeId: 'satellite'
  });
	
  map.data.setControls(['Point', 'LineString', 'Polygon']);
  map.data.setStyle({
    editable: true,
    draggable: true,
    clickable: true
  });

  bindDataLayerListeners(map.data);
  
  //loading my geojson
  map.data.loadGeoJson("data/2013097.geojson");
	
  map.data.addListener('click',function (event){ RatePath(event)});
  map.data.addListener('rightclick',function (event){DeletePath(event)});

  // Retrieve HTML elements.
  var mapContainer = document.getElementById('map-holder');
  geoJsonOutput = document.getElementById('geojson-output');
  downloadLink = document.getElementById('download-link');
}

google.maps.event.addDomListener(window, 'load', init);

// Refresh different components from other components.
function refreshGeoJsonFromData() {
  map.data.toGeoJson(function(geoJson) {
    geoJsonOutput.value = JSON.stringify(geoJson);
    refreshDownloadLinkFromGeoJson();
  });
}

// Refresh download link.
function refreshDownloadLinkFromGeoJson() {
  downloadLink.href = "data:;base64," + btoa(geoJsonOutput.value);
}

// Apply listeners to refresh the GeoJson display on a given data layer.
function bindDataLayerListeners(dataLayer) {
  dataLayer.addListener('addfeature', refreshGeoJsonFromData);
  dataLayer.addListener('removefeature', refreshGeoJsonFromData);
  dataLayer.addListener('setgeometry', refreshGeoJsonFromData);
}

function DeletePath(event) {
    var r = confirm("Do you want to delete this path?");
    if (r == true) {
        map.data.remove(event.feature);
    }
}

function DeleteAll() {
    var r = confirm("Do you want to delete all features an the map?");	
    if (r == true) {
        map.data.forEach(function(feature) {
            map.data.remove(feature);
        });
    }
}

function RatePath(event){
    document.getElementById("rating-box").style.display = "block";
    document.getElementById("left-btn").addEventListener("click", function(){
	var e = document.getElementById("rate-selection");
        var rating = e.options[e.selectedIndex].value;
	if (rating == 1){
	    setColor(event, '#750013');
	    event.feature.setProperty('Rating', rating);
	}else if (rating == 2){
	    setColor(event, '#de2443');
	    event.feature.setProperty('Rating', rating);
	}else if (rating == 3){	
	    setColor(event, '#4646cc');
            event.feature.setProperty('Rating', rating);
	}else if (rating == 4){	
	    setColor(event, '#11b27f');
            event.feature.setProperty('Rating', rating);
	}else if (rating == 5){	
	    setColor(event, '#1dc606');
	    event.feature.setProperty('Rating', rating);
	}
	document.getElementById("rating-box").style.display = "none";
    });
}

function setColor(event, color) {
    map.data.overrideStyle(event.feature, {
        strokeColor: color
    });
    event.feature.setProperty("Color", color);
}
