import React from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';

export const JsonGraphNode: React.FC<NodeProps<any>> = (props) => {
  const { data, selected } = props;
  return (
    <div
      className={`rounded-lg shadow-md px-4 py-2 bg-neutral-900 border border-neutral-700 min-w-[120px] max-w-[260px] ${selected ? 'ring-2 ring-primary' : ''}`}
      style={{ color: '#fff', fontFamily: 'monospace', fontSize: 15 }}
    >
      {data.label && (
        <div className="mb-1">
          <span className="text-orange-400 font-semibold">{data.label}</span>
          {data.size !== undefined && (
            <span className="ml-2 text-neutral-400">[{data.size}]</span>
          )}
        </div>
      )}
      {Array.isArray(data.entries) && (
        <div className="space-y-1">
          {data.entries.map((entry: any, i: number) => (
            <div key={i} className="flex gap-1">
              <span className="text-sky-400">{entry.key}:</span>
              <span className="text-yellow-200">{entry.value}</span>
            </div>
          ))}
        </div>
      )}
      <Handle type="target" position={Position.Left} style={{ background: '#888' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#888' }} />
    </div>
  );
} 