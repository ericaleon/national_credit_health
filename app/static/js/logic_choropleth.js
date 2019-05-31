// Creating map object
var map = L.map("map").setView([39.8097343, -98.5556199], 4);

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

// d3(new_statedata).then(function(error, response) {  
//   if (error)
//     {console.log(error)}
//   console.log(response);
//   var response = [response];
//   var score = response.map(data => data.Financial_Score)
// });


var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
    targetUrl = "https://docs.mapbox.com/help/demos/choropleth-studio-gl/stateData.geojson";

// Function that will determine the color each stte based on score
function getColor(score) {
    return score.Financial_Score > 9   ? '#1A5B00' :
    score.Financial_Score > 8   ? '#2E9506' :
    score.Financial_Score > 7   ? '#4DB027' :
    score.Financial_Score > 6   ? '#67D13E' :
    score.Financial_Score > 5   ? '#7CE155' :
    score.Financial_Score > 4   ? '#9EF37D' :
    score.Financial_Score > 3   ? '#D3FAC4' :
    score.Financial_Score > 2   ? '#E1FED7' :
    score.Financial_Score > 1   ? '#F1FEEC' :
                      '#fffff';
};

// Grabbing our GeoJSON data..
d3.json(proxyUrl + targetUrl, function(data) {
      // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature 
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color each state
        fillColor: getColor(new_statedata),
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

      var Financial_Score_pu = [];
      var Vantage_Score_pu = [];

      Object.keys(new_statedata).forEach(function(k){
        console.log(k + ' : ' + new_statedata[k]);
        if (k = "Financial_Score"){
          Financial_Score_pu.push(new_statedata[k])

        } else if (k = "Vantage_Score"){
          Vantage_Score_pu
        }

        
        score_pop_up.push(new_statedata[k])
     });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup('<h3>State Score:</h3>' + forEach(Financial_Score_pu) + '<hr><ul><li> Vantage Score: ' + forEach(new_statedata.Credit_Score) + "</li><li>Debt/Income Ratio: " + forEach(new_statedata.Debt-Income) + "</li><li>Delinquency Rate: " + forEach(new_statedata.Mortg_Delinquency) + "</li><hr><p>Financial Education Grade: " + forEach(new_statedata.Ed_Grade), {offset: new L.point(10,10)});
    }
    // layer.bindPopup('<h3>State Score:</h3>' + forEach(new_statedata.Financial_Score) + '<hr><ul><li> Vantage Score: ' +forEach(new_statedata.Credit_Score) + "</li><li>Debt/Income Ratio: " + forEach(new_statedata.Debt-Income) + "</li><li>Delinquency Rate: " + forEach(new_statedata.Mortg_Delinquency) + "</li><hr><p>Financial Education Grade: " + forEach(new_statedata.Ed_Grade), {offset: new L.point(10,10)});
   
  }).addTo(map);

  var legend = L.control({ position: "bottomright"});
      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        var colors = ["#fffff", '#F1FEEC', '#E1FED7', '#D3FAC4', '#9EF37D', '#7CE155', '#67D13E', '#4DB027', '#2E9506', '#1A5B00']
        var labels = [];

        var legendInfo = "<h2>Financial Health Score</h2>" + 
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
