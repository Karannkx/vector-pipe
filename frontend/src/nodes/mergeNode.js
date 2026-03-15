import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { GitMerge } from 'lucide-react';

export const MergeNode = ({ id, data }) => {
  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-1`, label: 'A' },
    { type: 'target', position: Position.Left, id: `${id}-2`, label: 'B' },
    { type: 'source', position: Position.Right, id: `${id}-out` },
  ];

  return (
    <BaseNode id={id} title="Merge" icon={<GitMerge size={14} />} handles={handles}>
      <div style={{ fontSize: '12px', color: '#64748b' }}>Combines two input streams.</div>
    </BaseNode>
  );
};
