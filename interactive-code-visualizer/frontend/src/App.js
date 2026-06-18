import React, { useState, useEffect } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

const vscode = window.acquireVsCodeApi ? window.acquireVsCodeApi() : null;

// 1. DAGRE LAYOUT ENGINE (Kept outside component for performance)
const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, nodesep: 80, ranksep: 100 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 180, height: 60 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 90,
        y: nodeWithPosition.y - 30,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// 2. MAIN APP COMPONENT CONTAINER
function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const extractExpression = (node) => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (node.type === 'Identifier') return node.name;
    if (node.type === 'NumericLiteral' || node.type === 'Literal') return node.value;
    return node.type;
  };

  // Process AST inside the App function scope so it can cleanly access hooks
  const processAST = (ast) => {
    const rawNodes = [];
    const rawEdges = [];
    let nodeIdCounter = 0;

    const traverse = (node, parentId = null, edgeLabel = '') => {
      if (!node || typeof node !== 'object') return;

      // Skip BlockStatements cleanly
      if (node.type === 'BlockStatement') {
        if (node.body && Array.isArray(node.body)) {
          node.body.forEach((child) => traverse(child, parentId, edgeLabel));
        }
        return;
      }

      if (node.type) {
        const currentId = `node_${nodeIdCounter++}`;
        let displayLabel = node.type;
        let nodeColor = '#3498db';

        if (node.type === 'FunctionDeclaration') {
          displayLabel = `🚀 Function: ${node.id?.name}`;
          nodeColor = '#2ecc71';
        } 
        else if (node.type === 'VariableDeclarator') {
          displayLabel = `📦 Var: ${node.id?.name} = ${extractExpression(node.init)}`;
          nodeColor = '#e67e22';
        } 
        else if (node.type === 'ExpressionStatement') {
          displayLabel = `⚙️ Exec: ${extractExpression(node.expression)}`;
          nodeColor = '#2c3e50';
        }
        else if (node.type === 'IfStatement') {
          displayLabel = `🤔 IF: (${extractExpression(node.test)})`;
          nodeColor = '#9b59b6';
        } 
        else if (node.type === 'ForStatement') {
          displayLabel = `🔄 FOR Loop:\n${extractExpression(node.init)}`;
          nodeColor = '#f1c40f';
        }
        else if (node.type === 'WhileStatement') {
          displayLabel = `🔄 WHILE Loop:\n(${extractExpression(node.test)})`;
          nodeColor = '#f1c40f';
        }
        else if (node.type === 'ReturnStatement') {
          displayLabel = `↩️ Return: ${extractExpression(node.argument)}`;
          nodeColor = '#e74c3c';
        }

        rawNodes.push({
          id: currentId,
          data: { label: displayLabel, loc: node.loc },
          position: { x: 0, y: 0 },
          style: { 
            background: nodeColor, 
            color: nodeColor === '#f1c40f' ? '#000' : '#fff', 
            padding: '12px', 
            borderRadius: '8px', 
            fontWeight: 'bold',
            whiteSpace: 'pre-line',
            boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            minWidth: '180px',
            textAlign: 'center'
          }
        });

        if (parentId) {
          rawEdges.push({ 
            id: `e${parentId}-${currentId}`, 
            source: parentId, 
            target: currentId, 
            animated: true,
            label: edgeLabel,
            style: { stroke: nodeColor, strokeWidth: 2 },
            labelStyle: { fill: '#fff', fontWeight: 'bold', fontSize: '11px' },
            labelBgStyle: { fill: '#1e1e1e', fillOpacity: 0.8 }
          });
        }

        if (node.body && !Array.isArray(node.body)) {
          traverse(node.body, currentId);
        }
        if (node.declarations) {
          node.declarations.forEach((c) => traverse(c, currentId));
        }

        if (node.type === 'IfStatement') {
          if (node.consequent) traverse(node.consequent, currentId, 'True');
          if (node.alternate) traverse(node.alternate, currentId, 'False');
        } else if (node.body && Array.isArray(node.body)) {
          node.body.forEach((c) => traverse(c, currentId));
        }
      }
    };

    if (ast?.program?.body) {
      ast.program.body.forEach((rootNode) => traverse(rootNode, null));
    }

    // Safely fire layout compilation inside the functional scope hooks
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rawNodes, rawEdges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  };

  const onNodeClick = (event, node) => {
    if (vscode && node.data.loc) {
      vscode.postMessage({ command: 'highlightCode', loc: node.data.loc });
    }
  };

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data.command === 'updateCode') {
        const res = await fetch('http://localhost:5000/parse-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: event.data.code }),
        });
        const data = await res.json();
        if (data.ast) processAST(data.ast);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#121212' }}>
      <ReactFlow nodes={nodes} edges={edges} onNodeClick={onNodeClick} fitView>
        <Background color="#2a2a2a" gap={18} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;