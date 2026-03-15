import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode, NodeField, FieldLabel, FieldInput, FieldSelect } from './BaseNode';
import { useStore } from '../store';
import { Upload } from 'lucide-react';

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    updateNodeField(id, 'outputName', e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
    updateNodeField(id, 'outputType', e.target.value);
  };

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-value` },
  ];

  return (
    <BaseNode id={id} title="Output" icon={<Upload size={14} />} handles={handles}>
      <NodeField>
        <FieldLabel>Name</FieldLabel>
        <FieldInput type="text" value={currName} onChange={handleNameChange} />
      </NodeField>
      <NodeField>
        <FieldLabel>Type</FieldLabel>
        <FieldSelect value={outputType} onChange={handleTypeChange}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </FieldSelect>
      </NodeField>
    </BaseNode>
  );
};
