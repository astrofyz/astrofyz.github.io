// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 2, left: 10},
    width = 1800 - margin.left - margin.right,
    height = 3500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Color scale used
var color = d3.scaleOrdinal(d3.schemeCategory10);
// var color = d3.scale(d3.category20);
color = d3.scaleLinear()
    .domain([0, 9])
    .range(["#ffb14e", "#9d02d7"]);


const strokeOpacity_On = 0.99
const strokeOpacity_Off = 0.45 
const strokeWidth_Off = 2.
const top_number = 66
const max_char = 9
const title_height = 50
var start_year = 2020
const link_color = '#DDDEFF'

toursIDs = [6310, 5386, 4585, 4193, 3568, 3086, 2839, 2245, 2025, 1768, 631, 2363, 2249, 2320, 2142, 2141, 2339, 7019, 2349, 4979]
toursYears = [2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001]
url_general = "https://rating.chgk.info/tournament/"

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(10)
    .nodePadding(25)
    .size([width, height])
    .maxDepth(top_number);

// load the data
d3.json("https://raw.githubusercontent.com/astrofyz/d3project_inherit/main/all_teams.json", function(error, graph) {

  // Constructs a new Sankey generator with the default settings.
  sankey
      .nodes(graph.nodes)
      .links(graph.links)
      .layout(1);

  const defs = svg.append('defs');


  // add in the links
  var link = svg.append("g")
    .attr("class", "link")
    .selectAll(".link")
    .data(graph.links)
    .enter()
    .append("path")
      .attr("d", sankey.link() )
      .filter(function(d) {return d.value > 0.5})
      .attr("id", function(d,i){
        d.id = i;
        return "link-"+i;
      })
      .style("fill", "none")
      .style("stroke", link_color)
      .style("stroke-opacity", strokeOpacity_Off)
      .style("stroke-width", strokeWidth_Off)
      .sort(function (a, b) { return b.dy - a.dy; });

  link.append("title")
      .text(function(d) { return d.team; });

  link
    .attr("transform", "translate(0, "+ title_height + ")")


  // add in the nodes
  var node = svg.append("g")
    .selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .filter(function(d) { return (d.name != "000000") ; })
    .attr("class", "node")
    .attr("transform", function(d) { var dy = d.y + title_height; return "translate(" + d.x + "," + dy + ")"; })
    .attr("data-clicked", 0)
    .on("click", highlight_node_links)


  // add the circles for the nodes
  node
    .append("circle")
    .attr("cx", sankey.nodeWidth()/2.)
    .attr("cy", function (d) { return d.dy/2; })
    .attr("r", function (d) { return Math.sqrt(d.dy)*2.; })
    .attr("opacity", strokeOpacity_Off)
    .style("fill", function(d) { return d.color = color(d.node%top_number); })
    // Add hover text
    .append("title")
    .text(function(d) { return d.real_name + ":\n" + d.team });


  // add in the years in the first row
  var xspace = [];
  d3.selectAll(".node").each(function(d,i){
         if (!(xspace.includes(d.x))) {
          xspace.push(d.x);
         }
     })
    

  half_width = (xspace[1]-xspace[0])/3
  xspace.forEach(function(d, i){
    var label = svg.append("text")
                    .attr("x", d+half_width/2)
                    .attr("y", title_height/2.)
                    .style("font-size", "40px")
                    .style("font-weight", "normal")
                    .style("fill", "#010B3C")
                    .text(toursYears[i])
                    .on("click", function() { window.open("https://rating.chgk.info/tournament/"+toursIDs[i]);})  
                    })


  // add in the title for the nodes
  node
    .append("text")
    .attr("x", -10)
    .attr("y", function(d) { return 0.5*d.dy; })
    .attr("dy", "0.9em")
    .attr("text-anchor", "end")
    .attr("transform", null)
    .text(function(d) { return d.real_name.length > max_char ? d.real_name.slice(0, max_char-3)+'...' : d.real_name; })
    .attr("x", sankey.nodeWidth()-6)
    .attr("text-anchor", "start");


  node
    .on("mouseover", function(d) { if ((d3.select(this).attr("data-clicked") == 0) | (d3.select(this).attr("data-clicked") == null))
                                        return d3.select(this).select("circle").attr("r", function (d) { return Math.sqrt(d.dy)*2.5; })
                                                                               .attr("opacity", function (d) { return strokeOpacity_On; }) } )
    .on("mouseout", function() { if ((d3.select(this).attr("data-clicked") == 0) | (d3.select(this).attr("data-clicked") == null)) 
                                      return d3.select(this).select("circle").attr("r", function (d) { return Math.sqrt(d.dy)*2.; })
                                                                             .attr("opacity", function (d) { return strokeOpacity_Off; }) } )


  link //d3.select(this).select("source").select("circle").style("fill", "black")
    .on("mouseover",function(link,i){
      d3.selectAll("circle").filter(function(d, i) {return (d.node == link.target.node) | (d.node == link.source.node)}).attr("opacity", 1.);
      return d3.select(this).style("stroke-opacity", strokeOpacity_On)
                            .style("stroke-width", function (d) { return d3.select(this).attr("clicked") == 1 ? Math.sqrt(d.value)*3.5 : strokeWidth_Off*4.; })
                            .filter(d3.select(this).attr("clicked") != 1)
                            .style("stroke", "#D8D9FD")})
                                                        
    .on("mouseout",function(link,i){
      d3.selectAll("circle").filter(function(d, i) {return (d.node == link.target.node) | (d.node == link.source.node)}).attr("opacity", strokeOpacity_Off);
      return d3.select(this).style("stroke-opacity", function (d) { if (d3.select(this).attr("clicked") != 1) return  strokeOpacity_Off; })
                            .style("stroke-width", function (d) { return d3.select(this).attr("clicked") == 1 ? Math.sqrt(d.value)*3.5 : strokeWidth_Off; })
                            .filter(d3.select(this).attr("clicked") != 1)
                            .style("stroke", function (d) { if (d3.select(this).attr("clicked") != 1) return link_color})})


   
  function highlight_node_links(node,i){
    var remainingNodes=[],
        nextNodes=[];

    // var stroke_opacity = 0;  

    set_original = new Set(node.team.split("\n"));

    if( d3.select(this).attr("data-clicked") == "1" ){
      d3.select(this).attr("data-clicked","0");
      d3.select(this).select("circle").attr("r", function (d) { return Math.sqrt(d.dy)*2.; })
                                      .style("opacity", strokeOpacity_Off)
                                      // .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })     
      stroke_opacity = strokeOpacity_Off;
      width_coef = 3.5;
      stroke_style = d3.select(this).attr("data-clicked");
    }else{      
      d3.select(this).attr("data-clicked","1");
      d3.select(this).select("circle").attr("r", function (d) { return Math.sqrt(d.dy)*2.5; })
                                      .style("opacity", strokeOpacity_On)
                                      .style("stroke", function(d) { return d3.rgb(d.color).brighter(5); })      
      stroke_opacity = strokeOpacity_On;
      width_coef = 3.5;
      stroke_style = d3.select(this).attr("data-clicked");
    }

    var traverse = [{
                      linkType : "sourceLinks",
                      nodeType : "target"
                    },{
                      linkType : "targetLinks",
                      nodeType : "source"
                    }];

    traverse.forEach(function(step){
      node[step.linkType].forEach(function(link) {
          if (link.value > 0.5) {
            remainingNodes.push(link[step.nodeType]);}
            highlight_link(link.id, stroke_opacity, width_coef, stroke_style);
      });

      while (remainingNodes.length) {
        nextNodes = [];
        remainingNodes.forEach(function(node) {
          node[step.linkType].forEach(function(link) {
            if (link.value > 0.5) {
                nextNodes.push(link[step.nodeType]);
                highlight_link(link.id, stroke_opacity, width_coef, stroke_style);
          }
          });
        });
        remainingNodes = nextNodes;
      }
    });
    }

  function highlight_link(id, opacity, width_coef, stroke_style){
      d3.select("#link-"+id)
                            .style("stroke-width", function (d) { if (stroke_style == 0) {return strokeWidth_Off} else {return Math.sqrt(d.value)*width_coef}})
                            .style('stroke', function(d) { if (stroke_style == 0) {return link_color;} else {
                                // make unique gradient ids  
                                const gradientID = `gradient${id}`;

                                const startColor = d.source.color;
                                const stopColor = d.target.color;

                                const linearGradient = defs.append('linearGradient')
                                                           .attr('id', gradientID);

                                linearGradient.selectAll('stop') 
                                              .data([                             
                                                      {offset: '10%', color: startColor },      
                                                      {offset: '90%', color: stopColor }    
                                                    ])                  
                                              .enter().append('stop')
                                              .attr('offset', d => {
                                              return d.offset; 
                                                                    })   
                                              .attr('stop-color', d => {
                                                return d.color;
                                                   })
                                              .attr('stop-opacity', 0.65);

                                              return `url(#${gradientID})`;
                                                  }} )
                            .style("stroke-opacity", opacity)
                            .attr("clicked", stroke_style);}
                            // } 
                                          

    
});

