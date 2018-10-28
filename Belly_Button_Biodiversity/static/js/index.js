// bring in meta data
function buildMetadata(){
    var chooser = document.getElementById('selDataset');
    var url = "/names";
    Plotly.d3.json(url, function(error, response) {
        if (error) return console.warn(error);
        var data = response;
        data.map(function(sample){
            var listing = document.createElement('option')
            listing.text = sample
            listing.value = sample
            chooser.appendChild(listing)
        });
    });
};


buildMetadata();

//function to build plots
function newSample(sample){
    buildPie(sample);
    buildBubble(sample);
    buildMetadata(sample);
};

// function to build the pie chart
function buildPie(sample) {
    var sampleURL = `/samples/${sample}`
    Plotly.d3.json(sampleURL,function(error,response){
        if (error) return console.log(error);
        var types = []
        var nums = []
        var furtherinfo = []
        for(i=0; i<10; i++){
            var label = response[0].otu_ids[i];
            types.push(label);
            var value = response[1].sample_values[i];
            nums.push(value);
            var hover = response[2][label - 1];
            furtherinfo.push(hover);
        };
        var trace = {
            values: nums,
            labels: types,
            type: "pie",
            text: furtherinfo,
            hoverinfo: "text+label+value+percent",
            textinfo: "percent"
        };
        var data = [trace]
        var layout = {
            margin: {
                l: 8,
                r: 8,
                b: 8,
                t: 8,
                pad: 5
            }
        }   
        Plotly.newPlot("pieChart", data, layout)
    });
};

// function to build the bubble heatmap chart
function buildBubble(sample) {
    var sampleURL = `/samples/${sample}`
    Plotly.d3.json(sampleURL,function(error,response){
        if (error) return console.log(error);
        var otuNums = response[0].otu_ids;
        var chosenNums = response[1].sample_values
        var chosenDescs = [];
        for(i=0; i<otuNums.length; i++) {
            otuDescriptions.push(response[2][otuNums[i] - 1]);
        };
        var trace = {
            x: otuNums,
            y: chosenNums,
            mode: 'markers',
            type: 'scatter',
            marker: {
                size: chosenNums,
                color: otuNums,
                colorscale: "Viridis"
            },
            text: chosenDescs,
          };
        var data = [trace]
        Plotly.newPlot("bubbleChart", data)
    });
};

//function to return the metadata for the chosen OTU
function buildMetadata(sample){
    var sampleURL = `/metadata/${sample}`
    Plotly.d3.json(sampleURL,function(error,response){
        if (error) return console.log(error);
        console.log(response);
        var data = response[0];
        console.log(data)
        var metaList = document.getElementById('sampleMetadata');
        metaList.innerHTML = '';
        var metaItems = [["AGE","AGE"],["BBTYPE","BBTYPE"],["ETHNICITY","ETHNICITY"],["GENDER","GENDER"],["LOCATION","LOCATION"],,
            ["SAMPLEID","SAMPLEID"]];
        console.log(metaList)
        for(i=0; i<metaItems.length; i++){
            var newLi = document.createElement('li');
            newLi.innerHTML = `${metaItems[i][0]}: ${data[metaItems[i][1]]}`;
            metaList.appendChild(newLi);
        };
    });
};

//initialize the first selection in the OTU list
newSample("BB_940");