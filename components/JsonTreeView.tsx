"use client"

import React, { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface JsonTreeViewProps {
  data: any
  path?: string
  onNodeSelect: (path: string, node: any) => void
  level?: number
}

export const JsonTreeView: React.FC<JsonTreeViewProps> = ({ data, path = '', onNodeSelect, level = 0 }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const isExpandable = typeof data === 'object' && data !== null && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isExpandable) {
      setExpanded(prev => {
        const newSet = new Set(prev)
        if (newSet.has(path)) {
          newSet.delete(path)
        } else {
          newSet.add(path)
        }
        return newSet
      })
    }
    onNodeSelect(path, data)
  }

  const renderValue = (value: any): string => {
    if (value === null) return 'null'
    if (typeof value === 'string') return `"${value}"`
    if (typeof value === 'object') {
      if (Array.isArray(value)) return `Array[${value.length}]`
      return `Object{${Object.keys(value).length}}`
    }
    return String(value)
  }

  if (typeof data !== 'object' || data === null) {
    return (
      <div
        className="flex items-center py-1 hover:bg-accent rounded cursor-pointer"
        style={{ paddingLeft: `${level * 0.5 + 1}px` }}
        onClick={handleClick}
      >
        <span className="text-muted-foreground">{renderValue(data)}</span>
      </div>
    )
  }

  const isArray = Array.isArray(data)
  const items = isArray ? data : Object.entries(data)
  const expandedHere = expanded.has(path)

  return (
    <div>
      <div
        className="flex items-center py-1 hover:bg-accent rounded cursor-pointer"
        style={{ paddingLeft: `${level * 0.5 + 1}px` }}
        onClick={handleClick}
      >
        <span className="font-semibold text-primary">{isArray ? '[ ]' : '{ }'}</span>
        <span className="ml-2 text-xs text-muted-foreground">{isArray ? `${items.length} items` : `${Object.keys(data).length} properties`}</span>
        <span className="ml-2 text-xs text-muted-foreground">{expandedHere ? (
          <ChevronDown className="w-4 h-4" />
        ) : <ChevronRight className="w-4 h-4" />}</span>
      </div>
      {expandedHere && (
        <div>
          {items.map((item: any, index: number) => {
            const key = isArray ? index : item[0]
            const value = isArray ? item : item[1]
            const newPath = path ? `${path}.${key}` : String(key)
            return (
              <div key={key}>
                {!isArray && (
                  <div
                    className="flex items-start py-1 hover:bg-accent/30 rounded cursor-pointer"
                    style={{ paddingLeft: `${level * 0.5 + 1}px` }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (typeof value === 'object' && value !== null) {
                        setExpanded(prev => {
                          const newSet = new Set(prev)
                          if (newSet.has(newPath)) {
                            newSet.delete(newPath)
                          } else {
                            newSet.add(newPath)
                          }
                          return newSet
                        })
                      }
                      onNodeSelect(newPath, value)
                    }}
                  >
                    <span className="text-primary font-mono rounded px-1 bg-muted">{key}</span>
                    {typeof value === 'object' && value !== null ? (
                      <JsonTreeView
                        data={value}
                        path={newPath}
                        onNodeSelect={onNodeSelect}
                        level={level + 1}
                      />
                    ) : (
                      <span className="text-muted-foreground font-mono">{renderValue(value)}</span>
                    )}
                  </div>
                )}
                {isArray && (
                  <JsonTreeView
                    data={value}
                    path={newPath}
                    onNodeSelect={onNodeSelect}
                    level={level + 1}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
} 