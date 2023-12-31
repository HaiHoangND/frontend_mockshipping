export const districts = [
  {
    id: 4,
    district: "Ba Đình",
    lat: 21.0382206,
    lon: 105.8270152,
    name: "Kho Ba Đình",
  },
  {
    id: 5,
    district: "Hoàn Kiếm",
    lat: 21.0304996,
    lon: 105.854389,
    name: "Kho Hoàn Kiếm",
  },
  {
    id: 6,
    district: "Đống Đa",
    lat: 21.0146852,
    lon: 105.8235426,
    name: "Kho Đống Đa",
  },
  {
    id: 7,
    district: "Thanh Xuân",
    lat: 20.9944171,
    lon: 105.8171316,
    name: "Kho Thanh Xuân",
  },
  {
    id: 8,
    district: "Hai Bà Trưng",
    lat: 21.0064704,
    lon: 105.8578519,
    name: "Kho Hai Bà Trưng",
  },
  {
    id: 9,
    district: "Cầu Giấy",
    lat: 21.0064704,
    lon: 105.8578519,
    name: "Kho Cầu Giấy",
  },
  {
    id: 10,
    district: "Nam Từ Liêm",
    lat: 21.0173512,
    lon: 105.7613329,
    name: "Kho Nam Từ Liêm",
  },
  {
    id: 11,
    district: "Bắc Từ Liêm",
    lat: 21.0712548,
    lon: 105.7644855,
    name: "Kho Bắc Từ Liêm",
  },
  {
    id: 12,
    district: "Tây Hồ",
    lat: 21.0683576,
    lon: 105.8240984,
    name: "Kho Tây Hồ",
  },
  {
    id: 13,
    district: "Hoàng Mai",
    lat: 21.0683576,
    lon: 105.8240984,
    name: "Kho Tây Hồ",
  },
  // Add other nodes here...
];

function createGraph(nodesData) {
  const nodes = new Map();

  function addNode(id, lat, lon, district, name) {
    nodes.set(id, { id, lat, lon, district, name, neighbors: new Map() });
  }

  function addEdge(node1, node2) {
    const distance = calculateDistance(nodes.get(node1), nodes.get(node2));
    nodes.get(node1).neighbors.set(node2, distance);
    nodes.get(node2).neighbors.set(node1, distance);
  }

  function shortestPathWithMinNodesAndDistance(start, end) {
    const visited = new Set();
    const distance = new Map();
    const previous = new Map();
    const queue = [];

    nodes.forEach((node, id) => {
      distance.set(id, { totalDistance: Infinity, nodeCount: Infinity });
      previous.set(id, null);
    });

    distance.set(start, { totalDistance: 0, nodeCount: 0 });
    queue.push(start);

    while (queue.length > 0) {
      const current = queue.shift();

      if (current === end) {
        const path = [];
        let node = end;
        while (node !== null) {
          path.unshift(node);
          node = previous.get(node);
        }
        const pathWithDistricts = path.map((nodeId) => ({
          id: nodeId,
          district: nodes.get(nodeId).district,
          name: nodes.get(nodeId).name,
        }));

        return pathWithDistricts;
      }

      if (visited.has(current)) {
        continue;
      }

      visited.add(current);

      const neighbors = nodes.get(current).neighbors;

      for (const [neighbor, distanceToNeighbor] of neighbors) {
        const currentDistance = distance.get(current);
        const tentativeDistance = {
          totalDistance: currentDistance.totalDistance + distanceToNeighbor,
          nodeCount: currentDistance.nodeCount + 1,
        };

        if (
          tentativeDistance.nodeCount < distance.get(neighbor).nodeCount ||
          (tentativeDistance.nodeCount === distance.get(neighbor).nodeCount &&
            tentativeDistance.totalDistance <
              distance.get(neighbor).totalDistance)
        ) {
          distance.set(neighbor, tentativeDistance);
          previous.set(neighbor, current);
          queue.push(neighbor);
          queue.sort((a, b) => {
            const distA = distance.get(a);
            const distB = distance.get(b);
            if (distA.nodeCount !== distB.nodeCount) {
              return distA.nodeCount - distB.nodeCount;
            } else {
              return distA.totalDistance - distB.totalDistance;
            }
          });
        }
      }
    }

    return null; // No path found
  }

  // Initialize the graph by adding nodes based on the provided data
  nodesData.forEach((node) => {
    addNode(node.id, node.lat, node.lon, node.district, node.name);
  });

  return {
    addNode,
    addEdge,
    shortestPathWithMinNodesAndDistance,
  };
}

// Function to calculate the Haversine distance between two sets of coordinates.
function calculateDistance(coord1, coord2) {
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const lat1 = (Math.PI / 180) * coord1.lat;
  const lon1 = (Math.PI / 180) * coord1.lon;
  const lat2 = (Math.PI / 180) * coord2.lat;
  const lon2 = (Math.PI / 180) * coord2.lon;
  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;
  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c; // Distance in kilometers
  return distance;
}

export const findBestRoute = (districts, startNode, endNode) => {
  // Example data for nodes

  // Create the graph
  const graph = createGraph(districts);

  // Add edges connecting the nodes as needed.
  graph.addEdge(7, 6);
  graph.addEdge(6, 4);
  graph.addEdge(6, 5);
  graph.addEdge(6, 8);
  graph.addEdge(6, 9);
  graph.addEdge(8, 5);
  graph.addEdge(5, 4);
  graph.addEdge(4, 12);
  graph.addEdge(4, 9);
  graph.addEdge(9, 11);
  graph.addEdge(9, 10);

  // Find and display the optimal path.
  const optimalPath = graph.shortestPathWithMinNodesAndDistance(
    startNode,
    endNode
  );
  return optimalPath;
};

