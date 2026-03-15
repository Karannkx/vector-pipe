import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode, NodeField, FieldLabel, FieldInput, FieldSelect } from './BaseNode';
import { useStore } from '../store';
import { Globe } from 'lucide-react';

export const APINode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [url, setUrl] = useState(data?.url || '');
  const [method, setMethod] = useState(data?.method || 'GET');

  return (
    <BaseNode id={id} title="API" icon={<Globe size={14} />} handles={[
      { type: 'target', position: Position.Left, id: `${id}-req` },
      { type: 'source', position: Position.Right, id: `${id}-res` }
    ]}>
      <NodeField>
        <FieldLabel>URL</FieldLabel>
        <FieldInput value={url} onChange={(e) => { setUrl(e.target.value); updateNodeField(id, 'url', e.target.value); }} />
      </NodeField>
      <NodeField>
        <FieldLabel>Method</FieldLabel>
        <FieldSelect value={method} onChange={(e) => { setMethod(e.target.value); updateNodeField(id, 'method', e.target.value); }}>
          <option>GET</option>
          <option>POST</option>
        </FieldSelect>
      </NodeField>
    </BaseNode>
  );
};
