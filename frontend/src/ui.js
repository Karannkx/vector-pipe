// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { APINode } from './nodes/apiNode';
import { NoteNode } from './nodes/noteNode';
import { MergeNode } from './nodes/mergeNode';
import { FilterNode } from './nodes/filterNode';
import { TimerNode } from './nodes/timerNode';
import { CustomEdge } from './CustomEdge';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const edgeTypes = {
  custom: CustomEdge,
};

const defaultEdgeOptions = {
  type: 'custom',
  animated: true,
  markerEnd: {
    type: 'arrowclosed',
    color: '#6366f1',
  },
  style: { stroke: '#6366f1', strokeWidth: 2 },
  interactionWidth: 20,
  selectable: true,
  focusable: true,
};

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  api: APINode,
  note: NoteNode,
  merge: MergeNode,
  filter: FilterNode,
  timer: TimerNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  }

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Mobile touch-drag: listen for touchNodeDrop dispatched by DraggableNode
  useEffect(() => {
    const handleTouchDrop = (e) => {
      if (!reactFlowInstance || !reactFlowWrapper.current) return;
      const { nodeType, x, y } = e.detail;
      if (!nodeType) return;
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: x - bounds.left,
        y: y - bounds.top,
      });
      const nodeID = getNodeID(nodeType);
      addNode({
        id: nodeID,
        type: nodeType,
        position,
        data: getInitNodeData(nodeID, nodeType),
      });
    };
    document.addEventListener('touchNodeDrop', handleTouchDrop);
    return () => document.removeEventListener('touchNodeDrop', handleTouchDrop);
  }, [reactFlowInstance, getNodeID, addNode]);

  return (
    <>
      <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
        <style>{`
              @keyframes dashmove {
                to { stroke-dashoffset: -10; }
              }
              .react-flow__edge {
                cursor: pointer;
              }
              @media (max-width: 768px) {
                /* Pinned to true viewport bottom-left corner */
                .react-flow__controls {
                  position: fixed !important;
                  left: max(12px, env(safe-area-inset-left)) !important;
                  right: auto !important;
                  bottom: max(12px, env(safe-area-inset-bottom)) !important;
                  top: auto !important;
                  transform: none !important;
                  flex-direction: row !important;
                  display: flex !important;
                  border-radius: 10px !important;
                  overflow: hidden !important;
                  margin: 0 !important;
                  z-index: 999 !important;
                }
                .react-flow__controls-button {
                  border-bottom: none !important;
                  border-right: 1px solid rgba(255,255,255,0.08) !important;
                  width: 36px !important;
                  height: 36px !important;
                }
                .react-flow__controls-button:last-child {
                  border-right: none !important;
                }
                .react-flow__minimap {
                  position: fixed !important;
                  left: max(12px, env(safe-area-inset-left)) !important;
                  right: auto !important;
                  bottom: 58px !important;
                  top: auto !important;
                  transform: none !important;
                  z-index: 999 !important;
                }
              }
            `}</style>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType='smoothstep'
          defaultEdgeOptions={defaultEdgeOptions}
          deleteKeyCode={['Backspace', 'Delete']}
          edgesFocusable={true}
          edgesUpdatable={true}
        >
          <Background color="rgba(255,255,255,0.03)" gap={gridSize} />
          <Controls />
          <MiniMap style={{ background: '#0B0F1A' }} maskColor="rgba(0,0,0,0.5)" />
        </ReactFlow>
      </div>
    </>
  )
}
