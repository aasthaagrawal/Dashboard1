//fetching data and initial view
d3.json("/data/data.json").then(function(deviceData){
  var deviceArray = [];
  var locationArray = [];
  for(var i=0; i<deviceData.length; i++){
    deviceArray.push([deviceData[i].deviceId, deviceData[i].category, deviceData[i].value]);
    locationArray.push([deviceData[i].coordinates.lat,deviceData[i].coordinates.lng]);
  }
  var listlength=(deviceData.length).toString();
  document.getElementById("Table_Heading").innerHTML = listlength.concat(' Devices');
  console.log(deviceData);
  console.log(deviceArray);
  console.log(locationArray);
  tableAddition(deviceArray);
  mapAddition(locationArray);
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
      locationArray = [];
      for(var i=0; i<deviceData.length; i++){
        if(deviceData[i].value<val){
          newDeviceArray.push([deviceData[i].deviceId, deviceData[i].category, deviceData[i].value]);
          locationArray.push([deviceData[i].coordinates.lat,deviceData[i].coordinates.lng]);
        }
      }
      console.log(newDeviceArray);
      updateTable(newDeviceArray);
      listlength=(newDeviceArray.length).toString();
      document.getElementById("Table_Heading").innerHTML = listlength.concat(' Devices');
      console.log("Manipulating maps");
      updateMap(locationArray);
      //removeOverlayOnMap();
      //addOverlayOnMap(locationArray);
    });
  var g2 = d3.select('div#slider-handle')
    .append('svg')
    .attr('width',500)
    .attr('height',50)
    .append('g')
    .attr('transform','translate(30,30)');
  g2.call(slider)
});

//update table when slider moves
function updateTable(newDeviceArray){
  console.log("In update method");
  var Parent = document.getElementById("table");
  while(Parent.hasChildNodes()){
    Parent.removeChild(Parent.firstChild);
  }
  tableAddition(newDeviceArray);
}

//adding table
function tableAddition(deviceArray){
  console.log("In tableAddition method");
  var table = d3.select("#table_with_heading").select("#table").append("table");
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

//map initialization
function mapAddition(locationArray){
  console.log("In drawMap method")
  var bound = new google.maps.LatLngBounds();
  for (var i=0; i<locationArray.length; i++){
    var lat=+locationArray[i][0];
    var lng=+locationArray[i][1];
    bound.extend(new google.maps.LatLng(lat,lng));
  }
  console.log(bound);
  map = new google.maps.Map(d3.select("#map").node(),
    {
      zoom: 1,
      center: new google.maps.LatLng(33.7759,-84.3890),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });
  map.fitBounds(bound);
  var overlay = new google.maps.OverlayView();
  overlay.onAdd = function(){
    var layer = d3.select(this.getPanes().overlayLayer)
                .append("div")
                .attr("class","layer");
    overlay.draw = function(){
      var projection = this.getProjection(),
          padding = 10;
      var marker = layer.selectAll("svg")
                   .data(locationArray)
                   .each(transform)
                   . enter()
                   .append("svg")
                   .each(transform)
                   .attr("class","marker");
      marker.append("circle")
            .attr("r",4.5)
            .attr("cx",padding)
            .attr("cy",padding);
      function transform(d){
        d = new google.maps.LatLng(d[0], d[1]);
        d = projection.fromLatLngToDivPixel(d);
        return d3.select(this)
                 .style("left", (d.x - padding) + "px")
                 .style("top", (d.y - padding) + "px");
      }
    };
  };
  overlay.setMap(map);
}

//map update according to slider movement
function updateMap(locationArray){
  console.log("In update map method");
  var Parent = document.getElementById("map");
  while(Parent.hasChildNodes()){
    Parent.removeChild(Parent.firstChild);
  }
  mapAddition(locationArray);
}