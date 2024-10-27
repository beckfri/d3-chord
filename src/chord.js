<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Endangered Species Graph</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        .node {
            stroke: #fff;
            stroke-width: 1.5px;
        }

        .link {
            stroke: #999;
            stroke-opacity: 0.6;
        }
    </style>
</head>
<body>
    <script>
        // Define the dimensions and margins of the graph
        const width = 800;
        const height = 600;

        // Create an SVG container
        const svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Sample data in JSON format
        const graph = {
            "nodes": [
                { "id": "Bluetenspezialisten", "group": "Bees" },
                { "id": "Bodennister", "group": "Bees" },
                { "id": "Ausgestorbene Arten", "group": "Bees" },
                { "id": "Tiefland Arten", "group": "Bees" },
                { "id": "Bats", "group": "Bats" }
            ],
            "links": [
                { "source": "Bluetenspezialisten", "target": "Bats", "value": 1 },
                { "source": "Bodennister", "target": "Tiefland Arten", "value": 2 },
                { "source": "Bats", "target": "Ausgestorbene Arten", "value": 3 }
            ]
        };

        // Create a force simulation
        const simulation = d3.forceSimulation(graph.nodes)
            .force("link", d3.forceLink(graph.links).id(d => d.id))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        // Draw links (lines)
        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("class", "link")
            .attr("stroke-width", d => Math.sqrt(d.value));

        // Draw nodes (circles)
        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", 10)
            .attr("fill", d => d.group === "Bats" ? "red" : "blue")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // Add labels to nodes
        const labels = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(graph.nodes)
            .enter().append("text")
            .attr("dy", ".35em")
            .attr("x", 12)
            .text(d => d.id);

        // Define the tick actions for simulation
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            labels
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });

        // Drag functions
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    </script>
</body>
</html>
