// Creating map object
var myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 11
  });

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

L.geoJson(stateData).addTo(myMap);

function getColor(d) {
    return d > 9   ? '#9EEC0C' :
           d > 8   ? '#A9F122' :
           d > 7   ? '#BCF138' :
           d > 6   ? '#C7F14B' :
           d > 5   ? '#D0F14B' :
           d > 4   ? '#DBF77E' :
           d > 3   ? '#E1F796' :
           d > 2   ? '#E4F7A5' :
           d > 1   ? '#E5F3B6' :
                      '#E9F3C8';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var info = L.control();

info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', info);
    this.update();
    return this._div;
};

info.update = function(details) {
    this._div.innerHTML = '<h3>State Score</h3>' + (add.state.here + add.state_score.here + '<hr><ul><li> Vantage Score: ' + add.vantage_score.here + "</li><li>Debt/Income Ratio: " + add.debt_income.here + "</li><li>Delinquency Rate: " + add.mor_del.here + "</li><hr><p>Required Econ: " + add.education.here + "</p>" : 'Hover over a state');
};

info.addTo(myMap);

function highlightFeature(e) {

}


// HELP: We need to update the control when the user hovers over a state, so we’ll also modify our listeners as follows: 

function highlightFeature(e) {
    ...
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    ...
    info.update();
}


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);














geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

L.geoJson(statesData, {style: style}).addTo(map);
// Store our API endpoint inside queryUrl
var queryURL = "FLASK DATA?"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });