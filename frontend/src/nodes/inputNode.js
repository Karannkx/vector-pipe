import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode, NodeField, FieldLabel, FieldInput, FieldSelect } from './BaseNode';
import { useStore } from '../store';
import { Download } from 'lucide-react';

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    updateNodeField(id, 'inputName', e.target.value);
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
    updateNodeField(id, 'inputType', e.target.value);
  };

  const handles = [
    { type: 'source', position: Position.Right, id: `${id}-value` },
  ];

  return (
    <BaseNode id={id} title="Input" icon={<Download size={14} />} handles={handles}>
      <NodeField>
        <FieldLabel>Name</FieldLabel>
        <FieldInput type="text" value={currName} onChange={handleNameChange} />
      </NodeField>
      <NodeField>
        <FieldLabel>Type</FieldLabel>
        <FieldSelect value={inputType} onChange={handleTypeChange}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </FieldSelect>
      </NodeField>
    </BaseNode>
  );
};
