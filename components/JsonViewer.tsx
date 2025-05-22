import React, { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'

interface JsonViewerProps {
  data: any
  onNodeSelect: (path: string[], value: any) => void
  path?: string[]
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, onNodeSelect, path = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const handleClick = () => {
    onNodeSelect(path, data)
  }

  const renderValue = (value: any, key: string | number, currentPath: string[]) => {
    if (value === null) {
      return <span className="text-muted-foreground">null</span>
    }

    if (typeof value === 'object') {
      return (
        <div className="pl-4">
          <JsonViewer
            data={value}
            onNodeSelect={onNodeSelect}
            path={currentPath}
          />
        </div>
      )
    }

    if (typeof value === 'string') {
      return <span className="text-green-600">"{value}"</span>
    }

    if (typeof value === 'number') {
      return <span className="text-blue-600">{value}</span>
    }

    if (typeof value === 'boolean') {
      return <span className="text-purple-600">{value.toString()}</span>
    }

    return <span className="text-muted-foreground">{String(value)}</span>
  }

  if (Array.isArray(data)) {
    return (
      <div className="font-mono text-sm">
        <div
          className="flex items-center cursor-pointer hover:bg-muted/50 rounded px-1"
          onClick={handleClick}
        >
          {data.length > 0 && (
            <button
              onClick={handleToggle}
              className="p-1 hover:bg-muted rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          <span className="text-muted-foreground">[</span>
          {!isExpanded && data.length > 0 && (
            <span className="text-muted-foreground ml-1">...{data.length} items</span>
          )}
          {isExpanded && (
            <>
              {data.map((item, index) => (
                <div key={index} className="pl-4">
                  {renderValue(item, index, [...path, index.toString()])}
                  {index < data.length - 1 && <span className="text-muted-foreground">,</span>}
                </div>
              ))}
            </>
          )}
          <span className="text-muted-foreground">]</span>
        </div>
      </div>
    )
  }

  if (typeof data === 'object' && data !== null) {
    const entries = Object.entries(data)
    return (
      <div className="font-mono text-sm">
        <div
          className="flex items-center cursor-pointer hover:bg-muted/50 rounded px-1"
          onClick={handleClick}
        >
          {entries.length > 0 && (
            <button
              onClick={handleToggle}
              className="p-1 hover:bg-muted rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          <span className="text-muted-foreground">{'{'}</span>
          {!isExpanded && entries.length > 0 && (
            <span className="text-muted-foreground ml-1">...{entries.length} properties</span>
          )}
          {isExpanded && (
            <>
              {entries.map(([key, value], index) => (
                <div key={key} className="pl-4">
                  <span className="text-orange-600">"{key}"</span>
                  <span className="text-muted-foreground">: </span>
                  {renderValue(value, key, [...path, key])}
                  {index < entries.length - 1 && <span className="text-muted-foreground">,</span>}
                </div>
              ))}
            </>
          )}
          <span className="text-muted-foreground">{'}'}</span>
        </div>
      </div>
    )
  }

  return renderValue(data, '', path)
}

export default JsonViewer 