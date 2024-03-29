// function bubbleSizer(arr) {
//   console.log("bubblesizer function called")
//   var myArr = []
//   arr.forEach(element => {
//     myArr.push(element/50000);
//   return myArr;
//   });
//   console.log(myArr)
// };

function bubbleSizer(arr) {
  console.log("bubblesizer new array")
  var value = (arr * .00006);
  console.log(value);
  return value;
  };

// Grab Data and Build a Bubble Chart
d3.json(`/complaints`).then((data) => {
  console.log("mapping")
  const crdt_complaints = data.credit_rpt_complaints;
  const complaints_capita = data.complaints_percapita; 
  const state_abbr = data.state_abbr;
  const state_pop = parseInt(data.state_population);
  const crdt_score = data.credit_score;
  console.log(state_pop)

  var bubbleLayout = {
    margin: { t: 3 },
    hovermode: "closest",
    xaxis: { title: "2017 Credit Reporting Complaints per Capita" },
    yaxis: { title: "Average Vantage Credit Score"}
  };

  var bubbleData = 
    {
      x: complaints_capita,
      y: crdt_score,
      text: state_abbr,
      // [state_abbr, state_pop, crdt_score, complaints_capita, crdt_complaints]
      mode: "markers",
      marker: {
        size: (state_pop * .00006),
        // size: state_pop_sz,
        color: crdt_score,
        colorscale: "YlGnBu",
        opacity: 0.75
      }
    };


  Plotly.newPlot("bubble", [bubbleData], bubbleLayout);
  // console.log(bubbleData);
});
