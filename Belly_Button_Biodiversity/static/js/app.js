function buildMetadata(sample) {
  var MetaData = `/metadata/${sample}`;

  d3.json(MetaData).then(function(response) {

    var specificData = d3.select("#sample-metadata");

    specificData.html("");

    var data = Object.entries(response);
    data.forEach(function(item) {
    specificData.append("div").text(item);
   });
   })}



function buildCharts(sample) {
var sampleData = `/samples/${sample}`;

  d3.json(sampleData).then(function(response) {
    var otunums = response.otu_ids;
    var otunames = response.otu_labels;
    var otuvals = response.sample_values;

    var bubbleData = {
      mode: 'markers',
      x: otunums,
      y: otuvals,
      text: otunames,
      marker: {color: otunums, colorscale: 'Veredis', size: otuvals}
    };

    var chart1Data = [bubbleData];

    var layout = {
      showlegend: false,
      height: 500,
      width: 1000
    };

    Plotly.newPlot('bubble', bb1Data, layout);
  })
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(sampleData).then(function(response) {
      var topIDs = response.otu_ids.slice(0,10);
      var topLabels = response.otu_labels.slice(0,10);
      var topVals = response.sample_values.slice(0,10);

      var data = [{
        "type" : "pie",
        "labels" : topIDs,
        "hovertext" : topLabels,
        "values" : topVals        
      }];

      Plotly.newPlot('pie', data);
      })
  };


function init() {
  // Grab a reference to the dropdown select element
  var chooser = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      chooser
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

