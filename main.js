d3.json("/data/data.json").then(function(deviceData){
  var deviceArray = [];
  for(var i=0; i<deviceData.length; i++){
    deviceArray.push([deviceData[i].deviceId, deviceData[i].category, deviceData[i].value]);
  }
  var listlength=(deviceData.length).toString();
  document.getElementById("Table_Heading").innerHTML = listlength.concat(' Devices');
  console.log(deviceData);
  console.log(deviceArray);
  tableAddition(deviceArray);
  var slider=d3.sliderHorizontal()
    .min(114)
    .max(126)
    .ticks(0)
    .step(1)
    .default(126)
    .fill('grey')
    .width(150)
    .displayValue(true)
    .handle(
      d3.symbol()
      .type(d3.symbolCircle)
      .size(100)
      )
    .on('onchange', val =>{
      d3.select('p#value-slider').text(val)
    })
    .on('end', val=>{
      var newDeviceArray=[];
      for(var i=0; i<deviceData.length; i++){
        if(deviceData[i].value<val){
          newDeviceArray.push([deviceData[i].deviceId, deviceData[i].category, deviceData[i].value]);
        }
      }
      console.log(newDeviceArray);
      updateTable(newDeviceArray);
    });
  var g2 = d3.select('div#slider-handle')
    .append('svg')
    .attr('width',500)
    .attr('height',50)
    .append('g')
    .attr('transform','translate(30,30)');
  g2.call(slider)
});

function updateTable(newDeviceArray){
  console.log("In update method");
  var Parent = document.getElementById("table");
  while(Parent.hasChildNodes()){
    Parent.removeChild(Parent.firstChild);
  }
  tableAddition(newDeviceArray);
}

function tableAddition(deviceArray){
  console.log("In tableAddition method");
  var table = d3.select("#table").append("table");
  var header = table.append("thead").append("tr");
  header.selectAll("th")
    .data(["Device", "Category", "Value"])
    .enter()
    .append("th")
    .text(function(d) { return d; });
  var tablebody = table.append("tbody");
  rows = tablebody.selectAll("tr")
    .data(deviceArray)
    .enter()
    .append("tr");
  cells = rows.selectAll("td")
            .data(function(d) {
              console.log(d);
              return d;
            })
            .enter()
            .append("td")
            .text(function(d) {
              return d;
            });
}