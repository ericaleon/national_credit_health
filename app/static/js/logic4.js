// var s_data = '/statedata';

// d3.json(s_data).then(function(response) {
//   console.log(response);
//   var response = [response];
// });

// Creating map object
var map = L.map("map", {
  center: [37.8097343, -95.5556199],
  zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

var link = "https://cors-anywhere.herokuapp.com/https://docs.mapbox.com/help/demos/choropleth-studio-gl/stateData.geojson";

// Function that will determine the color of a state
function chooseColor(name) {
  switch (name) {
  case "Alabama":
    return "#7CE155";
  case "Alaska":
    return "#7CE155";
  case "Arizona":
    return "#9EF37D";
  case "Arkansas":
    return "#7CE155";
  case "California":
    return "#7CE155";
  case "Alabama":
    return "#7CE155";
  case "Alaska":
    return "#7CE155";
  case "Arizona":
    return "#9EF37D";
  case "Arkansas":
    return "#7CE155";
  case "California":
    return "#7CE155";
  case "Colorado":
    return "#7CE155";
  case "Connecticut":
    return "#7CE155";
  case "Delaware":
    return "#D3FAC4";
  case "District of Columbia":
    return "#9EF37D";
  case "Florida":
    return "#7CE155";
  case "Georgia":
    return "#9EF37D";
  case "Hawaii":
    return "#9EF37D";
  case "Idaho":
    return "#67D13E";
  case "Illinois":
    return "#7CE155";
  case "Indiana":
    return "#7CE155";
  case "Iowa":
    return "#4DB027";
  case "Kansas":
    return "#4DB027";
  case "Kentucky":
    return "#7CE155";
  case "Louisiana":
    return "#9EF37D";
  case "Maine":
    return "#7CE155";
  case "Maryland":
    return "#D3FAC4";
  case "Massachusetts":
    return "#4DB027";
  case "Michigan":
    return "#67D13E";
  case "Minnesota":
    return "#2E9506";
  case "Mississippi":
    return "#9EF37D";
  case "Missouri":
    return "#67D13E";
  case "Montana":
    return "#67D13E";
  case "Nebraska":
    return "#2E9506";
  case "Nevada":
    return "#D3FAC4";
  case "New Hampshire":
    return "#4DB027";
  case "New Jersey":
    return "#9EF37D";
  case "New Mexico":
    return "#D3FAC4";
  case "New York":
    return "#7CE155";
  case "North Carolina":
    return "#9EF37D";
  case "North Dakota":
    return "#2E9506";
  case "Ohio":
    return "#67D13E";
  case "Oklahoma":
    return "#7CE155";
  case "Oregon":
    return "#67D13E";
  case "Pennsylvania":
    return "#67D13E";
  case "Rhode Island":
    return "#7CE155";
  case "South Carolina":
    return "#9EF37D";
  case "South Dakota":
    return "#2E9506";
  case "Tennessee":
    return "#7CE155";
  case "Texas":
    return "#7CE155";
  case "Utah":
    return "#9EF37D";
  case "Vermont":
    return "#4DB027";
  case "Virginia":
    return "#7CE155";
  case "Washington":
    return "#67D13E";
  case "West Virginia":
    return "#7CE155";
  case "Wisconsin":
    return "#2E9506";
  case "Wyoming":
    return "#4DB027";
  default:
    return "black";
  }
}

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature 
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color the states
        fillColor: chooseColor(feature.properties.name),
        fillOpacity: 0.7,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 70%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.7
          });
        },
        // When a feature is clicked, it is enlarged to fit the screen
        click: function(event) {
          map.fitBounds(event.target.getBounds());
        }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h1>" + feature.properties.name + "</h1>", {offset: new L.point(10,10)});

    }
  }).addTo(map);

  var legend = L.control({ position: "bottomright"});
      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        var colors = ["#fffff", '#F1FEEC', '#E1FED7', '#D3FAC4', '#9EF37D', '#7CE155', '#67D13E', '#4DB027', '#2E9506', '#1A5B00']
        var labels = [];

        var legendInfo = "<h4>Financial Health Score</h4>" + 
          "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
          "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
    
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      };
    
      // Adding legend to the map
      legend.addTo(map);
});
