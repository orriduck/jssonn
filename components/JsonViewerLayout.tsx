"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonTreeView } from "./JsonTreeView";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";

interface JsonHistory {
  id: string;
  timestamp: number;
  json: string;
}

export function JsonViewerLayout() {
  const [jsonHistory, setJsonHistory] = useState<JsonHistory[]>([]);
  const [inputJson, setInputJson] = useState("");
  const [beautifiedJson, setBeautifiedJson] = useState("");
  const [currentJson, setCurrentJson] = useState<any>(null);
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const savedHistory = localStorage.getItem("jsonHistory");
    if (savedHistory) {
      setJsonHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("jsonHistory", JSON.stringify(jsonHistory));
  }, [jsonHistory]);

  const handleJsonInput = (json: string) => {
    setInputJson(json);
    try {
      const parsed = JSON.parse(json);
      setCurrentJson(parsed);
      setBeautifiedJson(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setBeautifiedJson("Invalid JSON");
    }
  };

  const saveToHistory = () => {
    if (!inputJson.trim()) return;
    const newHistory = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      json: inputJson,
    };
    setJsonHistory((prev) => [newHistory, ...prev].slice(0, 10));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-xl font-semibold">JSON Viewer</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-5 gap-4">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {jsonHistory.map((item) => {
                const preview =
                  item.json.length > 32
                    ? item.json.slice(0, 32) + "..."
                    : item.json;
                return (
                  <div
                    key={item.id}
                    className="rounded-lg bg-muted p-2 flex flex-col items-start shadow-sm"
                  >
                    <Button
                      onClick={() => handleJsonInput(item.json)}
                      className="w-full text-left text-sm truncate font-mono"
                      title={item.json}
                      variant="ghost"
                    >
                      {preview}
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle>Input JSON</CardTitle>
              <Button
                onClick={saveToHistory}
                variant="default"
                size="icon"
                className="size-6"
              >
                <SaveIcon className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <textarea
                value={inputJson}
                onChange={(e) => handleJsonInput(e.target.value)}
                className="w-full h-[30vh] p-2 font-mono text-sm bg-background border rounded-md resize-none"
                placeholder="Paste your JSON here..."
                style={{ resize: "none" }}
              />
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Beautified JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="w-full h-[30vh] p-2 font-mono text-sm rounded-md overflow-auto"
                style={{ background: theme === "dark" ? "#282c34" : "#f5f5f5" }}
              >
                <pre
                  className="whitespace-pre-wrap break-words"
                  style={{ margin: 0 }}
                >
                  {beautifiedJson}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>JSON Tree</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] overflow-auto">
              {currentJson && (
                <JsonTreeView
                  data={currentJson}
                  onNodeSelect={(path, node) => {
                    setSelectedPath(path);
                    setSelectedNode(node);
                  }}
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Node Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">JMESPath</h3>
                <div className="p-2 bg-muted rounded-md font-mono text-sm">
                  {selectedPath || "No node selected"}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Node Content</h3>
                <pre className="p-2 bg-muted rounded-md font-mono text-sm overflow-auto max-h-[300px]">
                  {selectedNode
                    ? JSON.stringify(selectedNode, null, 2)
                    : "No node selected"}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
