var monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];



$('.loading').show();

$.getJSON("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", (data) => {
  $('.headers').show();
  var margin = {top: 20, right: 40, bottom: 30, left: 50}, 
    width = 900 - margin.left - margin.right, 
    height = 500 - margin.top - margin.bottom;

  var chart = d3.select(".root")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin. bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  var barWidth = width / data.data.length,
    min = new Date(data.data[0][0]),
    max = new Date(data.data[data.data.length - 1][0]);

  var x = d3.scaleTime()
      .range([0, width])
      .domain([min, max]);

  var xAxis = d3.axisBottom(x);

  var y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data.data, (d) => { return d[1]; })]);

  var yAxis = d3.axisLeft(y);

  var tip = d3.select("body")
      .append("foreignObject")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
  
    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    chart.selectAll(".bar")
        .data(data.data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("y", (d) => { return y(d[1]); })
        .attr("height", (d) => { return height - y(d[1]); })
        .attr("width", barWidth + 1 )
        .attr("transform", (d, i) => { return "translate(" + i * barWidth + ", 0)"; })
        .on("mouseover", (d) => {
          let date = new Date(d[0]),
              amount = new Intl.NumberFormat({ style: 'currency', currency: 'USD' }).format(d[1])
          tip.html("<p>" + monthNames[date.getMonth()] + " " + date.getFullYear() + "</p><p class='gdp'>$" + amount + "</p>");
             //.text("Year: " + date.getYear()); 
          return tip.style("visibility", "visible");
          })
        .on("mousemove", () => {
          return tip.style("top", (d3.event.pageY-70)+ "px").style("left",(d3.event.pageX-80)+ "px");
          })
        .on("mouseout", () => {
          return tip.style("visibility", "hidden");
          });
  
  $('.loading').hide();

  } )
