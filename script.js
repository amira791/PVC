let temps1 = 2;
let temps2 = 3;
let nodes = [];
let links = [];
let linkLabels;

function Resoudre() {
  document.getElementById("titles").style.display = "flex";
  document.getElementById("method2-container").style.display = "flex";
  document.getElementById("method1-container").setAttribute("width", "700");
  document.getElementById("method1-container").setAttribute("height", "600");

  document.getElementById("temps1").innerText = temps1 + " s";
  document.getElementById("temps2").innerText = temps2 + " s";

  simulation('#method2-container');
  // here call the methods and change the colors of the cycle
}
function simulation(containerName) {
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(350))
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
    .call(drag(simulation));

  let labels = d3.select(containerName)
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .text(d => d.label)
    .attr("font-size", 12)
    .attr('text-anchor', 'middle')
    .attr("dx", 0)
    .attr("dy", 0);

  linkLabels = d3.select(containerName)
    .selectAll(".link-label")
    .data(links)
    .enter()
    .append("text")
    .attr("class", "link-label")
    .text(d => d.distance)
    .attr("font-size", 10)
    .attr("dx", d => (nodes[d.source - 1]?.x + nodes[d.target - 1]?.x) / 2) // Use optional chaining to handle undefined nodes
    .attr("dy", d => (nodes[d.source - 1]?.y + nodes[d.target - 1]?.y) / 2);

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

    linkLabels
      .attr("dx", d => (nodes[d.source - 1]?.x + nodes[d.target - 1]?.x) / 2)
      .attr("dy", d => (nodes[d.source - 1]?.y + nodes[d.target - 1]?.y) / 2);
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

function generateInputs() {
  numVilles = parseInt(document.getElementById("numVilles").value);

  if (isNaN(numVilles) || numVilles < 1) {
    alert("Veuillez entrer un nombre valide de villes.");
    return;
  }

  distancesInput = document.getElementById("distances-input");
  distancesInput.innerHTML = "";

  const table = document.createElement("table");

  for (let i = 1; i <= numVilles; i++) {
    for (let j = i + 1; j <= numVilles; j++) {
      const row = document.createElement("tr");

      const fromCell = document.createElement("td");
      fromCell.innerText = `City ${i}`;
      row.appendChild(fromCell);

      const toCell = document.createElement("td");
      toCell.innerText = `City ${j}`;
      row.appendChild(toCell);

      const distanceCell = document.createElement("td");
      const distanceInput = document.createElement("input");
      distanceInput.type = "text";
      distanceInput.placeholder = "Distance";
      distanceCell.appendChild(distanceInput);
      row.appendChild(distanceCell);

      table.appendChild(row);
    }
  }

  distancesInput.appendChild(table);
  document.getElementById("generate").style.display = "inline";
}

function generateGraph() {
  if (!numVilles || !distancesInput) {
    alert("Veuillez d'abord générer les distances.");
    return;
  }

  const distanceInputs = Array.from(distancesInput.querySelectorAll("input"));
  nodes = [];
  links = [];

  for (let i = 0; i < numVilles; i++) {
    const newNode = { id: i + 1, label: `V${i + 1}`, x: Math.random() * 900, y: Math.random() * 700 };
    nodes.push(newNode);
  }

  for (let i = 0; i < numVilles - 1; i++) {
    for (let j = i + 1; j < numVilles; j++) {
      const distance = parseFloat(distanceInputs.shift().value) || 0;
      const newLink = { source: i + 1, target: j + 1, distance: distance };
      links.push(newLink);
    }
  }

  console.log(nodes);
  console.log(links);
  
  simulation('#method1-container');

  document.getElementById("graphs-container").style.display = "flex";
  document.getElementById("result").style.display = "inline";
  document.getElementById("inputs").style.display = "none";
  document.getElementById("distances-input").style.display = "none";

  updateGraphElements();
}

function updateGraphElements() {
  node = node.data(nodes, d => d.id);
  node = node.enter().append("circle")
    .attr("r", 15)
    .attr("fill", "#66a3ff")
    .merge(node)
    .call(drag(simulation));

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

    linkLabels = linkLabels.data(links, d => `${d.source.id}-${d.target.id}`);
    linkLabels.exit().remove();
  
    linkLabels = linkLabels.enter().append("text")
      .attr("class", "link-label")
      .text(d => d.distance)
      .attr("font-size", 10)
      .merge(linkLabels)
      .attr("x", d => (nodes[d.source - 1].x + nodes[d.target - 1].x) / 2)
      .attr("y", d => (nodes[d.source - 1].y + nodes[d.target - 1].y) / 2)
      .attr("dy", -5); // Adjust the vertical position as needed
  

  simulation.force("link").links(links);
  simulation.alpha(1).restart();
}

