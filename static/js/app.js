var tableData2 = data;// from data.js
var tableData = data;

// Get a reference to the table body
var tbody = d3.select("tbody");

console.log(data);

 // Use d3 to update each cell's text
 tableData.forEach(function(ufoData) {
   console.log(ufoData);
   var row = tbody.append("tr");
   Object.entries(ufoData).forEach(function([key, value]) {
     console.log(key, value);
     // Append a cell to the row for each value
     // in the weather report object
     var cell = tbody.append("td");
     cell.text(value);
   });
 });



// Select the submit button
var submit = d3.select("#filter-btn");
submit.on("click", function() {

  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input element and get the raw HTML node
  var inputElement = d3.select("#datetime");

  // Get the value property of the input element
  var inputValue = inputElement.property("value");

  console.log(inputValue);
  console.log(tableData);

  d3.select("tbody").remove();


  var filteredData = tableData2.filter(observation => observation.datetime === inputValue);

  var tbody = d3.select("table").append("tbody");

  filteredData.forEach(function(ufoData) {
    console.log(ufoData);
    var row = tbody.append("tr");
    Object.entries(ufoData).forEach(function([key, value]) {
      console.log(key, value);
      // Append a cell to the row for each value
      // in the weather report object
      var cell = tbody.append("td");
      cell.text(value);
    });
  });

  console.log(filteredData);
});



 