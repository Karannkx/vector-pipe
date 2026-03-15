import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode, NodeField, FieldLabel, FieldInput } from './BaseNode';
import { useStore } from '../store';
import { Timer } from 'lucide-react';

export const TimerNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [delay, setDelay] = useState(data?.delay || 1000);

  return (
    <BaseNode id={id} title="Timer" icon={<Timer size={14} />} handles={[
      { type: 'target', position: Position.Left, id: `${id}-in` },
      { type: 'source', position: Position.Right, id: `${id}-out` }
    ]}>
      <NodeField>
        <FieldLabel>Delay (ms)</FieldLabel>
        <FieldInput
          type="number"
          value={delay}
          onChange={(e) => {
            setDelay(e.target.value);
            updateNodeField(id, 'delay', e.target.value);
          }}
        />
      </NodeField>
    </BaseNode>
  );
};
