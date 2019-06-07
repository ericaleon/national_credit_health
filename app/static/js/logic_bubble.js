// start with belly button example & update for complaints data

// Grab Data and Build a Bubble Chart
d3.json(`/complaints`).then((data) => {
  // **replace variables below**
  const otu_ids = data.otu_ids; //complaints count
  const otu_labels = data.otu_labels; //state names
  const sample_values = data.sample_values; //average credit score

  var bubbleLayout = {
    margin: { t: 0 },
    hovermode: "closest",
    xaxis: { title: "2017 Credit Reporting Complaints per Capita" },
    yaxis: { title: "Average Vantage Credit Score"}
  };
  var bubbleData = [
    {
      // ** replace variables below **
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values, // state population
        color: otu_ids,
        colorscale: "YIGnBu"
      }
    }
  ];

  Plotly.plot("bubble", bubbleData, bubbleLayout);
});