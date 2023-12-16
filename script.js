function Resoudre(){
  document.getElementById("titles").style.display= "flex";
  document.getElementById("method2-container").style.display = "flex";
  document.getElementById("method1-container").setAttribute("width","700");
  document.getElementById("method1-container").setAttribute("height","600");

  simulation('#method2-container');
  // here call the methods and change the colors of the cycle
  
 }

let nodes = [];
let links = [];

function simulation(containerName){
  const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id(d => d.id).distance(100))
  .force('charge', d3.forceManyBody().strength(-100))
  .force('center', d3.forceCenter(450, 350));

let link = d3.select(containerName)
  .selectAll("line")
  .data(links)
  .enter()
  .append("line")
  .attr("stroke", "#000000")
  .attr("stroke-width", 2);

let node = d3.select(containerName)
  .selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("r", 15)
  .attr("fill", "#66a3ff")
  .call(drag(simulation))

let labels = d3.select(containerName)
  .selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .text(d => d.label)
  .attr("font-size", 12)
  .attr('text-anchor', 'middle')
  .attr("dx", 15)
  .attr("dy", 4);

simulation.on('tick', () => {
  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);

  node
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);

  labels
    .attr('x', d => d.x)
    .attr('y', d => d.y);
});
}


function drag(simulation) {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
}


function generateGraph() {
  const numVilles = document.getElementById("numVilles").value;

  nodes = [];
  links = [];

  // Generate nodes
  for (let i = 0; i < numVilles; i++) {
    const newNode = { id: i + 1, label: `Ville ${i + 1}`, x: Math.random() * 900, y: Math.random() * 700 };
    nodes.push(newNode);
  }

  // Generate complete graph links
  for (let i = 0; i < numVilles - 1; i++) {
    for (let j = i + 1; j < numVilles; j++) {
      const newLink = { source: i + 1, target: j + 1 };
      links.push(newLink);
    }
  }

  simulation('#method1-container');
  simulation.nodes(nodes);
  updateGraphElements();
}


function updateGraphElements() {
  node = node.data(nodes, d => d.id);
  node = node.enter().append("circle")
    .attr("r", 15)
    .attr("fill", "#66a3ff")
    .merge(node)
    .call(drag(simulation))
    

  labels = labels.data(nodes, d => d.id);
  labels.exit().remove();
  labels = labels.enter().append("text")
    .text(d => d.label)
    .attr("font-size", 12)
    .attr("dx", 15)
    .merge(labels);

  link = link.data(links, d => `${d.source.id}-${d.target.id}`);
  link = link.enter().append("line")
    .attr("stroke", "#000000")
    .attr("stroke-width", 2)
    .merge(link);

  simulation.force("link").links(links);
  simulation.alpha(1).restart();
}
