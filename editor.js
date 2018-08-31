// The Google Map.
var map;
var rating = "unknown";
var color = "#ffffff";
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

  map.data.setStyle(function(feature) {
    if (feature.getProperty("Rating") == null && feature.getProperty("Color") == null ) {
        feature.setProperty("Rating", rating);
        feature.setProperty("Color", color);
	refreshGeoJsonFromData();
    }
    if (feature.getProperty("Color") != color) {
        color = feature.getProperty("Color");
    }
    if (feature.getProperty("Rating") == rating) {
        color = "#ffffff";
    }
    return ({
        strokeColor: color,
	fillColor: color,
        strokeWeight: 5
    });
 });	
  
  bindDataLayerListeners(map.data);
  
  //loading my geojson
  map.data.loadGeoJson("data/2013097_review.geojson");
	
  map.data.addListener('click',function (event){ RatePath(event)});
  map.data.addListener('rightclick',function (event){DeletePath(event)});
	
  map.data.addListener('mouseover',function (event){
  	map.data.overrideStyle(event.feature, {
        strokeColor: "#000000",
	fillColor: "#000000"
    });
  });
  map.data.addListener('mouseout',function (event){
  	color = event.feature.getProperty("Color");
	map.data.overrideStyle(event.feature, {
        strokeColor: color,
	fillColor: color
  });

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

function RatePath(event) {
    bootbox.prompt({
        title: "Path rating",
        inputType: 'select',
        inputOptions: [
            {
                text: 'very bad',
                value: '1',
            },
            {
                text: 'bad',
                value: '2',
            },
            {
                text: 'good',
                value: '3',
            },
            {
                text: 'very good',
                value: '4',
            },
	    {
                text: 'perfect',
                value: '5',
            }
        ],
        callback: function (result) {
            if (result != null) {
                var rating = "unknown";
                if (result == 1) {
                    rating = 1;
		    color = '#c80627';
                    setColorRating(event, color, rating)
                }
                else if (result == 2) {
                    rating = 2;
		    color = '#fbc646';
                    setColorRating(event, color, rating)
                }
                else if (result == 3) {
                    rating = 3;
		    color = '#fcff00';
                    setColorRating(event, color, rating)
                }
                else if (result == 4) {
                    rating = 4;
		    color = '#3728ff';
                    setColorRating(event, color, rating)
                }
                else if (result == 5) {
                    rating = 5;
		    color = '#01dd06';
                    setColorRating(event, color, rating)
                }
            }
        }
    });
}

function setColorRating(event, color, rating) {
    map.data.overrideStyle(event.feature, {
        strokeColor: color,
	fillColor: color
    });
    event.feature.setProperty("Color", color);
    event.feature.setProperty("Rating", rating);
    refreshGeoJsonFromData();
}
