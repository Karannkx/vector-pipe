import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode, NodeField, FieldLabel, FieldInput, FieldSelect } from './BaseNode';
import { useStore } from '../store';
import { Filter } from 'lucide-react';

export const FilterNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [condition, setCondition] = useState(data?.condition || '');

  const handleChange = (e) => {
    setCondition(e.target.value);
    updateNodeField(id, 'condition', e.target.value);
  };

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-in` },
    { type: 'source', position: Position.Right, id: `${id}-out` },
  ];

  return (
    <BaseNode id={id} title="Filter" icon={<Filter size={14} />} handles={handles}>
      <NodeField>
        <FieldLabel>Condition</FieldLabel>
        <FieldInput value={condition} onChange={handleChange} placeholder="e.g. x > 10" />
      </NodeField>
    </BaseNode>
  );
};
