import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';

interface JsonNode {
  key: string;
  value: any;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  children?: JsonNode[];
}

interface JsonViewerProps {
  data: any;
  onNodeSelect?: (path: string[], value: any) => void;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, onNodeSelect }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const parseJsonNode = useCallback((key: string, value: any): JsonNode => {
    const type = Array.isArray(value) ? 'array' : typeof value;
    const node: JsonNode = {
      key,
      value,
      type: type as JsonNode['type'],
    };

    if (type === 'object' && value !== null) {
      node.children = Object.entries(value).map(([k, v]) => parseJsonNode(k, v));
    } else if (type === 'array') {
      node.children = value.map((v: any, i: number) => parseJsonNode(i.toString(), v));
    }

    return node;
  }, []);

  const toggleNode = (path: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleNodeClick = (path: string, value: any) => {
    setSelectedNode(path);
    onNodeSelect?.(path.split('.'), value);
  };

  const renderNode = (node: JsonNode, path: string = '') => {
    const currentPath = path ? `${path}.${node.key}` : node.key;
    const isExpanded = expandedNodes.has(currentPath);
    const isSelected = selectedNode === currentPath;

    const renderValue = () => {
      switch (node.type) {
        case 'string':
          return <span className="text-green-600">"{node.value}"</span>;
        case 'number':
          return <span className="text-blue-600">{node.value}</span>;
        case 'boolean':
          return <span className="text-purple-600">{node.value.toString()}</span>;
        case 'null':
          return <span className="text-gray-500">null</span>;
        default:
          return null;
      }
    };

    return (
      <div key={currentPath} className="ml-4">
        <div
          className={`flex items-center gap-2 py-1 px-2 rounded hover:bg-accent cursor-pointer ${
            isSelected ? 'bg-accent' : ''
          }`}
          onClick={() => handleNodeClick(currentPath, node.value)}
        >
          {(node.type === 'object' || node.type === 'array') && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(currentPath);
              }}
            >
              {isExpanded ? '−' : '+'}
            </Button>
          )}
          <span className="font-medium">{node.key}:</span>
          {node.type === 'object' && <span className="text-gray-500">{'{'}</span>}
          {node.type === 'array' && <span className="text-gray-500">[</span>}
          {renderValue()}
          {!isExpanded && (node.type === 'object' || node.type === 'array') && (
            <span className="text-gray-500">
              {node.type === 'object' ? '...}' : '...]'}
            </span>
          )}
        </div>
        {isExpanded && node.children && (
          <div className="ml-4">
            {node.children.map((child) => renderNode(child, currentPath))}
          </div>
        )}
        {isExpanded && node.type === 'object' && (
          <div className="ml-4 text-gray-500">{'}'}</div>
        )}
        {isExpanded && node.type === 'array' && (
          <div className="ml-4 text-gray-500">{']'}</div>
        )}
      </div>
    );
  };

  const rootNode = parseJsonNode('root', data);

  return (
    <div className="font-mono text-sm bg-background border rounded-lg p-4 overflow-auto">
      {renderNode(rootNode)}
    </div>
  );
};

export default JsonViewer; 