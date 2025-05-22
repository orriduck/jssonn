import { useState } from 'react'
import JsonViewer from './components/JsonViewer'
import { Button } from './components/ui/button'

function App() {
  const [jsonInput, setJsonInput] = useState('')
  const [jsonData, setJsonData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState<string[]>([])
  const [selectedValue, setSelectedValue] = useState<any>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value)
    setError(null)
  }

  const handleParseJson = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      setJsonData(parsed)
      setError(null)
    } catch (err) {
      setError('Invalid JSON format')
      setJsonData(null)
    }
  }

  const handleBeautify = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      setJsonInput(JSON.stringify(parsed, null, 2))
      setError(null)
    } catch (err) {
      setError('Invalid JSON format')
    }
  }

  const handleNodeSelect = (path: string[], value: any) => {
    setSelectedPath(path)
    setSelectedValue(value)
  }

  const handleCopySelected = () => {
    if (selectedValue !== null) {
      navigator.clipboard.writeText(JSON.stringify(selectedValue, null, 2))
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">JSON Viewer</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={handleParseJson}>Parse JSON</Button>
              <Button variant="secondary" onClick={handleBeautify}>Beautify</Button>
            </div>
            <textarea
              value={jsonInput}
              onChange={handleInputChange}
              className="w-full h-[400px] p-4 font-mono text-sm bg-background border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Paste your JSON here..."
            />
            {error && <p className="text-destructive">{error}</p>}
          </div>

          <div className="space-y-4">
            {jsonData && (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">JSON Tree View</h2>
                  {selectedValue !== null && (
                    <Button variant="outline" size="sm" onClick={handleCopySelected}>
                      Copy Selected
                    </Button>
                  )}
                </div>
                <JsonViewer data={jsonData} onNodeSelect={handleNodeSelect} />
                {selectedPath.length > 0 && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Selected Node</h3>
                    <p className="text-sm text-muted-foreground">
                      Path: {selectedPath.join('.')}
                    </p>
                    <pre className="mt-2 p-2 bg-background rounded text-sm overflow-auto">
                      {JSON.stringify(selectedValue, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
