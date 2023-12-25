import plotly.graph_objs as go
import networkx as nx
import plotly

# Reading the updated input.txt for the graph data
file_path = 'input.txt'

try:
    with open(file_path, 'r') as file:
        input_lines = file.readlines()
except Exception as e:
    input_lines = []

G = nx.Graph()

for line in input_lines:
    leftNode, rightNodes = line.strip().split(":")
    for rightNode in rightNodes.strip().split():
        G.add_edge(leftNode.strip(), rightNode.strip())

# Get positions for the nodes in G
pos = nx.spring_layout(G, k=0.5, iterations=50)

edge_x = []
edge_y = []
for edge in G.edges():
    x0, y0 = pos[edge[0]]
    x1, y1 = pos[edge[1]]
    edge_x.append(x0)
    edge_x.append(x1)
    edge_x.append(None)
    edge_y.append(y0)
    edge_y.append(y1)
    edge_y.append(None)

edge_trace = go.Scatter(
    x=edge_x, y=edge_y,
    line=dict(width=0.5, color='#888'),
    hoverinfo='none',
    mode='lines')

node_x = []
node_y = []
text = []  # Node labels
for node in G.nodes():
    x, y = pos[node]
    node_x.append(x)
    node_y.append(y)
    text.append(node)  # Add the node name to the text list

node_trace = go.Scatter(
    x=node_x, y=node_y,
    mode='markers+text',  # Combine markers and text
    text=text,  # The text will be the node names
    textposition="top center",  # Position the text above the markers
    hoverinfo='text',
    marker=dict(
        showscale=False,
        colorscale='YlGnBu',
        size=10,
        line_width=2))

fig = go.Figure(data=[edge_trace, node_trace],
             layout=go.Layout(
                showlegend=False,
                hovermode='closest',
                margin=dict(b=0,l=0,r=0,t=0),
                xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                yaxis=dict(showgrid=False, zeroline=False, showticklabels=False))
                )

fig.update_layout(title='Network Graph Made with Python', title_x=0.5)
plotly.offline.plot(fig, filename='network_graph.html')
