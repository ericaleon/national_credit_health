// Creating map object
var map = L.map("map").setView([39.8097343, -98.5556199], 5);

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(map);

// d3(new_statedata).then(function(error, response) {  
//   if (error)
//     {console.log(error)}
//   console.log(response);
//   var response = [response];
//   var score = response.map(data => data.Financial_Score)
// });

// https://cors-anywhere.herokuapp.com/"+
// var proxyUrl = "static/js/state_data_full.json";
var proxyUrl = "https://cors-anywhere.herokuapp.com/https://docs.mapbox.com/help/demos/choropleth-studio-gl/stateData.geojson";
console.log(proxyUrl);

// Function that will determine the color each stte based on score
// function getColor(score) {
//   // console.log(score[0].Financial_Score)
//   for (var i = 0; i < score.length; i ++) {
//     console.log(i);
//     if (score[i].Financial_Score > 9)   {
//       return '#1A5B00'}
//     else if (score[i].Financial_Score > 8) {
//       return '#2E9506' }
//     else if (score[i].Financial_Score > 7) {
//       return '#4DB027'}
//     else if (score[i].Financial_Score > 6) {
//       return '#67D13E'}
//     else if (score[i].Financial_Score > 5) {
//       return '#7CE155'}
//     else if (score[i].Financial_Score > 4) {
//       return '#9EF37D' }
//     else if (score[i].Financial_Score > 3) {
//       return '#D3FAC4'}
//     else if  (score[i].Financial_Score > 2) {
//       return '#E1FED7'}
//     else if (score[i].Financial_Score > 1) {
//       return '#F1FEEC'}
//     else {return '#fffff'};
// }};


// var arr=[];
// for (var i = 0; i < new_statedata.States.length; i ++) {
//   arr.push(getColor(new_statedata.States[i]))};
// console.log(arr);


// var myStyle = {
//   'color' : 'orange',
//   'fillColor' : getColor(new_statedata.States),
//   "fillOpacity" : 0.5,
//   "weight": 1.5
// };
var testColors = [{
  "Alabama" : "red",
  "Alaska" : "blue"
}]
// Grabbing our GeoJSON data..
d3.json(proxyUrl, function(data) {
      // Creating a geoJSON layer with the retrieved data
  // console.log(data)   
  L.geoJson(data, {
    // Style each feature
    style:  
        function(data){
          console.log(data)
            switch (data.properties.name) {
              case "Alabama" : return {color:scoreColor["Alabama"]};
              case "Alaska": return {color:scoreColor["Alaska"]};
              case "Arizona": return {color:scoreColor["Arizona"]};
              case "Arkansas": return {color:scoreColor["Arkansas"]};
              case "California": return {color:scoreColor["California"]};
              case "Colorado": return {color:scoreColor["Colorado"]};
              case "Connecticut": return {color:scoreColor["Connecticut"]};
              case "Delaware": return {color:scoreColor["Delaware"]};
              case "District of Columbia": return {color:scoreColor["District of Columbia"]};
              case "Florida": return {color:scoreColor["Florida"]};
              case "Georgia": return {color:scoreColor["Georgia"]};
              case "Hawaii": return {color:scoreColor["Hawaii"]};
              case "Idaho": return {color:scoreColor["Idaho"]};
              case "Illinois": return {color:scoreColor["Illinois"]};
              case "Indiana": return {color:scoreColor["Indiana"]};
              case "Iowa": return {color:scoreColor["Iowa"]};
              case "Kansas": return {color:scoreColor["Kansas"]};
              case "Kentucky": return {color:scoreColor["Kentucky"]};
              case "Louisiana": return {color:scoreColor["Louisiana"]};
              case "Maine": return {color:scoreColor["Maine"]};
              case "Maryland": return {color:scoreColor["Maryland"]};
              case "Massachusetts": return {color:scoreColor["Massachusetts"]};
              case "Michigan": return {color:scoreColor["Michigan"]};
              case "Minnesota": return {color:scoreColor["Minnesota"]};
              case "Mississippi": return {color:scoreColor["Mississippi"]};
              case "Missouri": return {color:scoreColor["Missouri"]};
              case "Montana": return {color:scoreColor["Montana"]};
              case "Nebraska": return {color:scoreColor["Nebraska"]};
              case "Nevada": return {color:scoreColor["Nevada"]};
              case "New Hampshire": return {color:scoreColor["New Hampshire"]};
              case "New Jersey": return {color:scoreColor["New Jersey"]};
              case "New Mexico": return {color:scoreColor["New Mexico"]};
              case "New York": return {color:scoreColor["New York"]};
              case "North Carolina": return {color:scoreColor["North Carolina"]};
              case "North Dakota": return {color:scoreColor["North Dakota"]};
              case "Ohio": return {color:scoreColor["Ohio"]};
              case "Oklahoma": return {color:scoreColor["Oklahoma"]};
              case "Oregon": return {color:scoreColor["Oregon"]};
              case "Pennsylvania": return {color:scoreColor["Pennsylvania"]}; 
              case "Rhode Island": return {color:scoreColor["Rhode Island"]};
              case "South Carolina": return {color:scoreColor["South Carolina"]};
              case "South Dakota":return {color:scoreColor["South Dakota"]};
              case "Tennessee": return {color:scoreColor["Tennessee"]};
              case "Texas": return {color:scoreColor["Texas"]};
              case "Utah": return {color:scoreColor["Utah"]};
              case "Vermont": return {color:scoreColor["Vermont"]};
              case "Virginia": return {color:scoreColor["Virginia"]};
              case "Washington": return {color:scoreColor["Washington"]};
              case "West Virginia": return {color:scoreColor["West Virginia"]};
              case "Wisconsin": return {color:scoreColor["Wisconsin"]};
              case "Wyoming": return {color:scoreColor["Wyoming"]};
              default: 
                return {color: "black"};
    }
  },
    // Called on each feature
    onEachFeature: function(features, layer) {
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
    
      // console.log(new_statedata.States[0].Financial_Score);
      // Giving each feature a pop-up with information pertinent to it
      // layer.bindPopup('<h3>State Score:</h3>' + forEach(Financial_Score_pu) + '<hr><ul><li> Vantage Score: ' + forEach(new_statedata.Vantage_Score_pu) + "</li><li>Debt/Income Ratio: " + forEach(new_statedata.Debt_Income_pu) + "</li><li>Delinquency Rate: " + forEach(new_statedata.Mortg_Delinquency_pu) + "</li><hr><p>Financial Education Grade: " + forEach(new_statedata.Ed_Grade_pu), {offset: new L.point(10,10)});
    
    layer.bindPopup('<h3>State Score:</h3>' + '<hr><ul><li> Vantage Score: ' + "</li><li>Debt/Income Ratio: " + "</li><li>Delinquency Rate: " + "</li><hr><p>Financial Education Grade: ", {offset: new L.point(10,10)});
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
console.log()