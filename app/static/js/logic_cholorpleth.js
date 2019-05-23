// Creating map object
var map = L.map("map", {
  center: [40.7128, -74.0059],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

var url = '/statedata';
d3.json(url).then(function(response) {
    console.log(response)
    var data = [response];
})
var link = "https://eric.clst.org/assets/wiki/uploads/Stuff/gz_2010_us_040_00_5m.json";

// Function that will determine the color of a neighborhood based on the borough it belongs to
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
};

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: getColor(response.map(data => data.Financial_Score)),
        fillOpacity: 0.5,
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
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function(event) {
          map.fitBounds(event.target.getBounds());
        }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup('<h3>State Score</h3>' + response.map(data => data.Financial_Score) + '<hr><ul><li> Vantage Score: ' + response.map(data => data.Credit_Score) + "</li><li>Debt/Income Ratio: " + response.map(data => data.Debt-Income) + "</li><li>Delinquency Rate: " + response.map(data => data.Mortg_Delinquency) + "</li><hr><p>Financial Education Grade: " + response.map(data => data.Ed_Grade))
    } 
  }).addTo(map);
});
