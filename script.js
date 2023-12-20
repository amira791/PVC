let temps1 = 2;
let temps2 = 3;
let nodes = [];
let links = [];
let linkLabels;


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
    return null;
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
  GraphComplet = { nodes: nodes, links: links };
  console.log(nodes);
  console.log(links);
  
  simulation('#method1-container');

  document.getElementById("graphs-container").style.display = "flex";
  document.getElementById("result").style.display = "inline";
  document.getElementById("inputs").style.display = "none";
  document.getElementById("distances-input").style.display = "none";

  updateGraphElements();
  console.log(nodes);
  console.log(links);

  return GraphComplet;
  
}

let node; 
function updateGraphElements() {
  if (!node) {
  node = d3.select("graph-manipulation")
  .selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("r", 15)
  .attr("fill", "#66a3ff")
  .call(drag(simulation));
} else {

node = node.data(nodes, d => d.id);
node = node.enter().append("circle")
  .attr("r", 15)
  .attr("fill", "#66a3ff")
  .merge(node)
  .call(drag(simulation));
}

if (!labels) {
  labels = d3.select("graph-manipulation")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .text(d => d.label)
    .attr("font-size", 12)
    .attr('text-anchor', 'middle')
    .attr("dx", 0)
    .attr("dy", 0);
} else {

  labels = labels.data(nodes, d => d.id);
  labels.exit().remove();
  labels = labels.enter().append("text")
    .text(d => d.label)
    .attr("font-size", 12)
    .attr("dx", 15)
    .merge(labels);
}


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


/******************************************* SOLUTION *********************************************/
let GraphComplet = {};
let villeDepart = 0;
let exacteCycle = [];
let heuristiqueCycle = [];

// -------------------------- Obtenir la ville de départ
function getVilleDepart() {
  const villeDepartInput = document.getElementById("villeDepart");
  const startingCityId = parseInt(villeDepartInput.value);
  villeDepart = startingCityId;
}

// -------------------------- Méthode Exacte
function tsp_exacte(graph, debut) {
  const n = graph.nodes.length;
  const visited = Array(n).fill(false);
  let minCost = Infinity;
  let minPath = [];


  function backtrack(path, cost) {
    if (path.length === n) {
      if (cost < minCost) {
        minCost = cost;
        minPath = path.slice();
      }
      return;
    }

    const currentCityId = path[path.length - 1];
    const currentNodeIndex = graph.nodes.findIndex((node) => node.id === currentCityId);
    
    for (let i = 0; i < n; i++) {
      if (!visited[i]) {
        const nextNodeId = graph.nodes[i].id;
        visited[i] = true;
        path.push(nextNodeId);

        const link = graph.links.find(
          (l) =>
            (l.source.id === currentCityId && l.target.id === nextNodeId) ||
            (l.source.id === nextNodeId && l.target.id === currentCityId)
        );
        const newCurrentCityId = path[path.length - 1];

        
        if (link && newCurrentCityId !== debut) {
          
          backtrack(path, cost + link.distance);
        }


        visited[i] = false;
        path.pop();
        if (path.length === n)
        {
          backtrack(path, cost + link.distance);

        }
        
      }
      
    }

  }
 

  // debut temp exc
  const startTime = new Date();

  const startNodeId = debut;
  backtrack([startNodeId], 0);

  // fin temp exc
  const endTime = new Date();
  const elapsedTime = (endTime - startTime) / 1000; // Convert milliseconds to seconds

  // Convert path from node ids to nodes
    const finalPath = minPath.map((nodeId) => graph.nodes.find((node) => node.id === nodeId));

  // Ajouter le retour au point de départ
  finalPath.push(graph.nodes.find((node) => node.id === debut));
  let additionalCost = 0;

    const currentNode = finalPath[n];
    const previousNode = finalPath[n-1];
    const link = graph.links.find(
      (l) =>
        (l.source.id === currentNode.id && l.target.id === previousNode.id) ||
        (l.source.id === previousNode.id && l.target.id === currentNode.id)
    );
    if (link) {
      additionalCost += link.distance;
    }


  // ajouter le cost retour au debut cycle au cot total
  minCost += additionalCost;

  console.log("Optimal Path:", finalPath);
  console.log("Minimum Cost:", minCost);
  console.log("Elapsed Time:", elapsedTime, "seconds");

  return { minPath: finalPath, minCost, elapsedTime };
}

// --------------------------- Méthode heuristique
function tsp_heuristique(graph, debut) {
  const n = graph.nodes.length;
  const visited = Array(n).fill(false);
  let path = [debut]; // Start from the first node id
  let cost = 0;

  // debut temp exc
  const startTime = new Date();
  //path.push(debut);
  for (let i = 0; i < n - 1; i++) {
    let currentCityId = path[path.length - 1];
    let minDistance = Infinity;
    let nextNodeId = -1;
  
    for (let j = 0; j < n; j++) {
      const link = graph.links.find(
        (l) =>
          (l.source.id === currentCityId && l.target.id === graph.nodes[j].id) ||
          (l.target.id === currentCityId && l.source.id === graph.nodes[j].id)
      );
      visited[debut-1]= true;
  
      if (!visited[j] && link && link.distance < minDistance) {
        minDistance = link.distance;
        nextNodeId = graph.nodes[j].id;
      }
     
    }
   
  
    console.log("Current City:", currentCityId);
    console.log("Next Node:", nextNodeId);
    console.log("Visited Nodes:", visited);
  
    visited[graph.nodes.findIndex((node) => node.id === nextNodeId)] = true;

  
    path.push(nextNodeId);
    cost += minDistance;
  }
  


  // fin temp exc
  const endTime = new Date();
  const elapsedTime = (endTime - startTime) / 1000; // Convert milliseconds to seconds



  // Vérifier que le chemin passe par toutes les villes une fois
  const uniqueCities = new Set(path);
  console.assert(uniqueCities.size === n, "Le chemin ne passe pas par toutes les villes une fois.");


  
 

  
  console.log("Greedy Cost:", cost);
  console.log("Elapsed Time:", elapsedTime, "seconds");

  // Return to the starting node
  let path2;
  path.push(path[0]);
  path2 = path.map(nodeId => GraphComplet.nodes.find(node => node.id === nodeId));
  console.log(path);
  let additionalCost = 0;

  const currentNode = path2[n];
  console.log(path2[n]);
  const previousNode = path2[n-1];
  console.log(path2[n-1]);
  const link = graph.links.find(
    (l) =>
      (l.source.id === currentNode.id && l.target.id === previousNode.id) ||
      (l.source.id === previousNode.id && l.target.id === currentNode.id)
  );
  if (link) {
    additionalCost += link.distance;
  }


//  ajouter le cost retour au debut cycle au cot total
cost += additionalCost;

  // Vérifier que le chemin forme un cycle
  console.assert(path[0] === path[path.length - 1], "Le chemin ne forme pas un cycle.");
  console.log("Greedy Path:", path);
  console.assert(path[0] === debut, "Le cycle ne revient pas à la ville de départ.");

  return { path, cost, elapsedTime };
}




// --------------------- Résoudre le problème TSP
function Resoudre() {
  // Résolution avec méthode exacte
  const solutionExacte = tsp_exacte(GraphComplet, villeDepart);
  console.log("Solution exacte :", solutionExacte);
  exacteCycle = solutionExacte.minPath;

  // Format  "Vi -> Vj -> ..."
  const exactePathString = exacteCycle.map(node => node.label).join(" -> ");

  // Set the details for the exact solution
  document.getElementById("cout1").innerText = solutionExacte.minCost;
  document.getElementById("temps1").innerText = solutionExacte.elapsedTime + " s";
  document.getElementById("ch1").innerText = "Chemin : " + exactePathString;

  // Résolution avec méthode heuristique
  const solutionHeuristique = tsp_heuristique(GraphComplet, villeDepart);
  console.log("Solution heuristique :", solutionHeuristique);
  heuristiqueCycle = solutionHeuristique.path;

  // Format "Vi -> Vj -> ..."
  let heuristiquePathString = heuristiqueCycle.map(nodeId => GraphComplet.nodes.find(node => node.id === nodeId).label).join(" -> ");

  // Set the details for the heuristic solution
  document.getElementById("cout2").innerText = solutionHeuristique.cost;
  document.getElementById("temps2").innerText = solutionHeuristique.elapsedTime + " s";
  document.getElementById("ch2").innerText = "Chemin : " + heuristiquePathString;

  // Call the simulation function with the "link" class
  simulation('#method2-container');

  // Mettre en évidence les cycles
  highlightSolution();

  document.getElementById("titles").style.display = "flex";
  document.getElementById("method2-container").style.display = "flex";
  document.getElementById("method1-container").setAttribute("width", "700");
  document.getElementById("method1-container").setAttribute("height", "600");
}


// --------------------------- Mettre en évidence la solution 
function highlightSolution() {
  // Mettre en évidence les cycles
  highlightCycle(exacteCycle, "red", "method1-container");  // Change the color to red in method1-container
  highlightCycle(heuristiqueCycle.map(nodeId => GraphComplet.nodes.find(node => node.id === nodeId)), "blue", "method2-container");
}

function highlightCycle(cycle, color, containerId) {
  console.log(cycle);

  // Mettre en évidence les liens du cycle dans le conteneur spécifié
  d3.select(`#${containerId}`)
    .selectAll(".link")
    .attr("stroke", "#000000") 
    .attr("stroke-width", 2);

  d3.select(`#${containerId}`)
    .selectAll(".link")
    .filter((d) => {
      const sourceIndex = cycle.findIndex((node) => node.id === d.source.id);
      const targetIndex = cycle.findIndex((node) => node.id === d.target.id);
      return sourceIndex !== -1 && targetIndex !== -1 && Math.abs(sourceIndex - targetIndex) === 1;
    })
    .attr("stroke", "#5fa002")
    .attr("stroke-width", 10);
  console.log("yaaay");
}



