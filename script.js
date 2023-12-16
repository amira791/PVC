function Resoudre(){
 document.getElementById("titles").style.display= "flex";
 document.getElementById("method2-container").style.display = "flex";
 document.getElementById("method1-container").setAttribute("width","700");
 document.getElementById("method1-container").setAttribute("height","600");
 console.log("resoudre");
}



let nodes = [];

let links = [];

// Create a D3 force simulation
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id(d => d.id).distance(100))
  .force('charge', d3.forceManyBody().strength(-100))
  .force('center', d3.forceCenter(400, 300));

// Create links for SVG element
let link = d3.select('#method1-container')
  .selectAll("line")
  .data(links)
  .enter()
  .append("line")
  .attr("stroke", "#000000")
  .attr("stroke-width", 2);

// Create nodes for SVG element
let node = d3.select('#method1-container')
.selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("r", 10)
  .attr("fill", "#66a3ff")
  .call(drag(simulation))
  .on("click", handleNodeClick);

// Add labels to nodes
let labels = d3.select('#method1-container')
  .selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .text(d => d.label)
  .attr("font-size", 12)
  .attr('text-anchor', 'middle')
  .attr("dx", 15)
  .attr("dy", 4);

// Update positions of nodes, links, and labels during each tick of the simulation
// don't mind this function it's not important
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

// Dragging behavior for nodes
// don't mind this function it's not important
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

// la fonctione ajoute un nouveau sommet au graphe
function addNode() {
// creer le nouveau sommet 
  const newNode = { id: nodes.length + 1, label: `Node ${nodes.length + 1}` };
  nodes.push(newNode);
//mettre a jour les sommets de la simulation
  node = node.data(nodes, d => d.id);

  node = node.enter().append("circle")
      .attr("r", 15)
      .attr("fill", "#66a3ff")
      .merge(node)
      .call(drag(simulation))
      .on("click", handleNodeClick);
  

  labels = labels.data(nodes, d => d.id);
  labels.exit().remove();
  labels = labels.enter().append("text")
      .text(d => d.label)
      .attr("font-size", 12)
      .attr("dx", 15)
     
      .merge(labels);
    
      simulation.nodes(nodes);
      simulation.alpha(1).restart();
}


let isLinking = false;
let selectedNode = null;

//active le mode linking pour ajouter une arrete
function startLinking() {
  isLinking = true;
}

// la fonction ajoute une arrete entre deux sommets
function handleNodeClick(event, d) {
  if (isLinking) {
    // si aucun sommet n'est selctione avant => enregistrer le clicked sommet 
      if (selectedNode === null) {
          selectedNode = d;  
      } else {
        // s'il existe deja un sommet selectionne => le sommet deja selectionne = source
        // et le sommet qu'on vient de selectionnne = terget 
          const newLink = { source: selectedNode.id, target: d.id };
          links.push(newLink);

          isLinking = false;
          selectedNode = null;

          // mettre a jour les links de la simulation
          link = link.data(links, d => `${d.source.id}-${d.target.id}`);
          
          link = link.enter().append("line")
              .attr("stroke", "#000000")
              .attr("stroke-width", 2)
              .merge(link);

          simulation.force("link").links(links);
          simulation.alpha(1).restart();
      }
  }
}





