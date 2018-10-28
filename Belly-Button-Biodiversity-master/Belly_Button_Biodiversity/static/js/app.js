function buildMetadata(sample) {
  var MetaData = `/metadata/${sample}`;
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(MetaData).then(function(response) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var panelData = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panelData.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    var data = Object.entries(response);
    data.forEach(function(item) {
    panelData.append("div").text(item);
   });
   })}

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {
var sampleData = `/samples/${sample}`;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(sampleData).then(function(response) {
    // @TODO: Build a Bubble Chart using the sample data
    var bubbleOtuIds = response.otu_ids;
    var bubbleOuLabels = response.otu_labels;
    var bubbleSampleValues = response.sample_values;

    var bubbleChartData = {
      mode: 'markers',
      x: bubbleOtuIds,
      y: bubbleSampleValues,
      text: bubbleOuLabels,
      marker: {color: bubbleOtuIds, colorscale: 'Rainbow', size: bubbleSampleValues}
    };

    var bb1Data = [bubbleChartData];

    var layout = {
      showlegend: false,
      height: 600,
      width: 1200
    };

    Plotly.newPlot('bubble', bb1Data, layout);
  })
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(sampleData).then(function(response) {
      var topTenOtuIds = response.otu_ids.slice(0,10);
      var topOtuLabels = response.otu_labels.slice(0,10);
      var topTenSampleValues = response.sample_values.slice(0,10);

      var data = [{
        "labels" : topTenOtuIds,
        "values" : topTenSampleValues,
        "hovertext" : topOtuLabels,
        "type" : "pie"
      }];

      Plotly.newPlot('pie', data);
      })
  };


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

