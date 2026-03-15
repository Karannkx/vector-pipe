from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from collections import defaultdict, deque

app = FastAPI()

# Allow frontend (React dev server) to call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https://.*\\.vercel\\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Node(BaseModel):
    id: str
    type: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    position: Optional[Dict[str, float]] = None
    # Accept any extra fields silently
    class Config:
        extra = "allow"


class Edge(BaseModel):
    id: Optional[str] = None
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None
    # Accept any extra fields silently
    class Config:
        extra = "allow"


class PipelineData(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """Check if the graph formed by nodes and edges is a DAG using Kahn's algorithm."""
    # Build adjacency list and in-degree count
    adj = defaultdict(list)
    in_degree = defaultdict(int)
    node_ids = {node.id for node in nodes}

    # Initialize all nodes with 0 in-degree
    for nid in node_ids:
        in_degree[nid] = in_degree.get(nid, 0)

    for edge in edges:
        adj[edge.source].append(edge.target)
        in_degree[edge.target] = in_degree.get(edge.target, 0) + 1
        # Ensure source is in the in_degree map
        if edge.source not in in_degree:
            in_degree[edge.source] = 0

    # Kahn's algorithm: BFS-based topological sort
    queue = deque([nid for nid in node_ids if in_degree.get(nid, 0) == 0])
    visited_count = 0

    while queue:
        node = queue.popleft()
        visited_count += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If all nodes were visited, there is no cycle → it is a DAG
    return visited_count == len(node_ids)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.get('/api')
def read_api_root():
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse')
@app.post('/api/pipelines/parse')
def parse_pipeline(data: PipelineData):
    num_nodes = len(data.nodes)
    num_edges = len(data.edges)
    dag = is_dag(data.nodes, data.edges)

    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': dag,
    }
