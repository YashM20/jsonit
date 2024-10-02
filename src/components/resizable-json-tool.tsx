'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Upload, Download, Code, Eye, Check, X, AlertTriangle, Menu, AlignJustify, Copy, Trash2, Search, RefreshCw, ChevronRight, ChevronLeft, FileCode, Tool, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toast } from '@/components/ui/toast'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import dynamic from 'next/dynamic'
import Ajv from 'ajv'
import "@andypf/json-viewer"

const JSONEditor = dynamic(() => import('@json-editor/json-editor'), { ssr: false })
const JSONViewer = dynamic(() => import('@andypf/json-viewer'), { ssr: false })

const ajv = new Ajv()

export function ResizableJsonTool() {
  const [jsonData, setJsonData] = useState('')
  const [parsedJson, setParsedJson] = useState<any>(null)
  const [jsonEditor, setJsonEditor] = useState<any>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [toastMessage, setToastMessage] = useState('')
  const [viewMode, setViewMode] = useState<'code' | 'tree'>('code')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [jsonSchema, setJsonSchema] = useState('')
  const [generatedTypes, setGeneratedTypes] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const schemaInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && editorRef.current) {
      const editor = new JSONEditor(editorRef.current, {
        mode: 'code',
        modes: ['code', 'tree', 'form', 'view'],
        onChangeJSON: (json) => {
          setJsonData(JSON.stringify(json, null, 2))
          setParsedJson(json)
        },
        onEvent: (node, event) => {
          if (event.type === 'click' && node.path) {
            setCurrentPath(node.path)
          }
        },
      })
      setJsonEditor(editor)

      return () => {
        if (editorRef.current) {
          editorRef.current.innerHTML = ''
        }
      }
    }
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setJsonData(content)
        try {
          const parsed = JSON.parse(content)
          setParsedJson(parsed)
          jsonEditor?.set(parsed)
          validateJson(parsed)
          setToastMessage('JSON file imported successfully')
        } catch (error) {
          console.error('Failed to parse JSON:', error)
          setToastMessage('Failed to parse JSON. Please check the format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const validateJson = useCallback((json: any) => {
    if (jsonSchema) {
      try {
        const schema = JSON.parse(jsonSchema)
        const validate = ajv.compile(schema)
        const valid = validate(json)
        if (!valid) {
          setValidationErrors(validate.errors?.map(error => error.message) || [])
        } else {
          setValidationErrors([])
          setToastMessage('JSON is valid according to the schema')
        }
      } catch (error) {
        console.error('Failed to parse JSON schema:', error)
        setToastMessage('Failed to parse JSON schema. Please check the format.')
      }
    } else {
      const schema = {
        type: 'object',
        additionalProperties: true,
      }
      const validate = ajv.compile(schema)
      const valid = validate(json)
      if (!valid) {
        setValidationErrors(validate.errors?.map(error => error.message) || [])
      } else {
        setValidationErrors([])
      }
    }
  }, [jsonSchema])

  const handleExport = useCallback(() => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(jsonData)}`
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute('download', 'data.json')
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
    setToastMessage('JSON data exported successfully')
  }, [jsonData])

  const convertToJson = useCallback(() => {
    try {
      let parsedData
      // First, try to parse as JSON
      try {
        parsedData = JSON.parse(jsonData)
      } catch {
        // If JSON parsing fails, try to evaluate as JavaScript object
        parsedData = Function(`'use strict'; return (${jsonData})`)()
      }
      const convertedJson = JSON.stringify(parsedData, null, 2)
      setJsonData(convertedJson)
      setParsedJson(JSON.parse(convertedJson))
      jsonEditor?.set(JSON.parse(convertedJson))
      setToastMessage('Successfully converted to JSON')
    } catch (error) {
      console.error('Failed to convert to JSON:', error)
      setToastMessage('Failed to convert to JSON. Please check the format.')
    }
  }, [jsonData, jsonEditor])

  const removeWhitespace = useCallback(() => {
    try {
      const compactJson = JSON.stringify(JSON.parse(jsonData))
      setJsonData(compactJson)
      setParsedJson(JSON.parse(compactJson))
      jsonEditor?.set(JSON.parse(compactJson))
      setToastMessage('Whitespace removed successfully')
    } catch (error) {
      console.error('Failed to remove whitespace:', error)
      setToastMessage('Failed to remove whitespace. Please check the JSON format.')
    }
  }, [jsonData, jsonEditor])

  const formatJson = useCallback(() => {
    try {
      const formattedJson = JSON.stringify(JSON.parse(jsonData), null, 2)
      setJsonData(formattedJson)
      setParsedJson(JSON.parse(formattedJson))
      jsonEditor?.set(JSON.parse(formattedJson))
      setToastMessage('JSON formatted successfully')
    } catch (error) {
      console.error('Failed to format JSON:', error)
      setToastMessage('Failed to format JSON. Please check the JSON format.')
    }
  }, [jsonData, jsonEditor])

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(jsonData).then(() => {
      setToastMessage('JSON copied to clipboard')
    }, (err) => {
      console.error('Failed to copy JSON:', err)
      setToastMessage('Failed to copy JSON to clipboard')
    })
  }, [jsonData])

  const pasteFromClipboard = useCallback(() => {
    navigator.clipboard.readText().then((text) => {
      try {
        const parsed = JSON.parse(text)
        setJsonData(JSON.stringify(parsed, null, 2))
        setParsedJson(parsed)
        jsonEditor?.set(parsed)
        validateJson(parsed)
        setToastMessage('JSON pasted from clipboard')
      } catch (error) {
        console.error('Failed to parse pasted JSON:', error)
        setToastMessage('Failed to parse pasted content as JSON')
      }
    }, (err) => {
      console.error('Failed to read clipboard:', err)
      setToastMessage('Failed to read from clipboard')
    })
  }, [jsonEditor, validateJson])

  const resetData = useCallback(() => {
    setJsonData('')
    setParsedJson(null)
    jsonEditor?.set({})
    setValidationErrors([])
    setToastMessage('JSON data reset')
  }, [jsonEditor])

  const reloadData = useCallback(() => {
    if (parsedJson) {
      setJsonData(JSON.stringify(parsedJson, null, 2))
      jsonEditor?.set(parsedJson)
      validateJson(parsedJson)
      setToastMessage('JSON data reloaded')
    }
  }, [parsedJson, jsonEditor, validateJson])

  const handleSearch = useCallback(() => {
    if (searchQuery && parsedJson) {
      const searchRecursive = (obj: any, query: string): string[] => {
        const results: string[] = []
        Object.keys(obj).forEach(key => {
          const value = obj[key]
          if (key.includes(query) || (typeof value === 'string' && value.includes(query))) {
            results.push(key)
          }
          if (typeof value === 'object' && value !== null) {
            const nestedResults = searchRecursive(value, query)
            results.push(...nestedResults.map(r => `${key}.${r}`))
          }
        })
        return results
      }

      const searchResults = searchRecursive(parsedJson, searchQuery)
      if (searchResults.length > 0) {
        setToastMessage(`Found ${searchResults.length} matches: ${searchResults.join(', ')}`)
        // Highlight matches in the viewer
        const highlightedJson = JSON.stringify(parsedJson, null, 2).replace(
          new RegExp(searchQuery, 'gi'),
          match => `<mark>${match}</mark>`
        )
        const jsonViewer = document?.querySelector('.json-viewer');
        if (jsonViewer) {
          jsonViewer.innerHTML = highlightedJson;
        } else {
          setToastMessage('No matches found');
        }
      } else {
        setToastMessage('No matches found')
      }
    }
  }, [searchQuery, parsedJson])

  const handleSchemaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setJsonSchema(content)
        try {
          JSON.parse(content)
          setToastMessage('JSON schema uploaded successfully')
          validateJson(parsedJson)
        } catch (error) {
          console.error('Failed to parse JSON schema:', error)
          setToastMessage('Failed to parse JSON schema. Please check the format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const generateTypes = useCallback(() => {
    if (!parsedJson) {
      setToastMessage('No valid JSON to generate types from')
      return
    }

    try {
      const generateTypeRecursive = (obj: any, typeName: string = 'RootObject'): string => {
        if (Array.isArray(obj)) {
          const itemType = obj.length > 0 ? generateTypeRecursive(obj[0], `${typeName}Item`) : 'any'
          return `${itemType}[]`
        } else if (typeof obj === 'object' && obj !== null) {
          const properties = Object.entries(obj).map(([key, value]) => {
            const propertyType = generateTypeRecursive(value, `${typeName}${key.charAt(0).toUpperCase() + key.slice(1)}`)
            return `  ${key}: ${propertyType};`
          })
          return `{\n${properties.join('\n')}\n}`
        } else {
          return typeof obj
        }
      }

      const generatedType = `type ${generateTypeRecursive(parsedJson)}`
      setGeneratedTypes(generatedType)
      setToastMessage('TypeScript types generated successfully')
    } catch (error) {
      console.error('Failed to generate types:', error)
      setToastMessage('Failed to generate TypeScript types. Please check your JSON structure.')
    }
  }, [parsedJson])

  const downloadTypes = useCallback(() => {
    if (generatedTypes) {
      const blob = new Blob([generatedTypes], { type: 'text/typescript' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'generated-types.ts'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setToastMessage('TypeScript types downloaded successfully')
    } else {
      setToastMessage('No types generated yet. Please generate types first.')
    }
  }, [generatedTypes])

  const fixJson = useCallback(() => {
    try {
      // Attempt to parse the JSON
      JSON.parse(jsonData)
      setToastMessage('JSON is already valid')
    } catch (error) {
      // If parsing fails, attempt to fix common issues
      let fixedJson = jsonData
        // Fix missing quotes around property names
        .replace(/(\w+)(?=\s*:)/g, '"$1"')
        // Fix single quotes to double quotes
        .replace(/'/g, '"')
        // Remove trailing commas
        .replace(/,\s*([\]}])/g, '$1')
        // Add missing braces
        .replace(/^(?!\s*[{[])/, '{\n').replace(/(?<![}\]])\s*$/, '\n}')
        // Fix unquoted strings
        .replace(/:\s*([a-zA-Z]\w*)(?=\s*[,}])/g, ':"$1"')

      try {
        const parsed = JSON.parse(fixedJson)
        setJsonData(JSON.stringify(parsed, null, 2))
        setParsedJson(parsed)
        jsonEditor?.set(parsed)
        setToastMessage('JSON fixed successfully')
      } catch (fixError) {
        console.error('Failed to fix JSON:', fixError)
        setToastMessage('Unable to automatically fix JSON. Please check manually.')
      }
    }
  }, [jsonData, jsonEditor])

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-700 text-white p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Json It</h1>
          <nav className="flex flex-wrap justify-center sm:justify-end space-x-2 space-y-2 sm:space-y-0">
            <Button variant="outline" className="text-white border-white hover:bg-blue-600" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Import
            </Button>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileUpload} aria-label="Import JSON file" />
            <Button variant="outline" className="text-white border-white hover:bg-blue-600" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-white border-white hover:bg-blue-600">
                  <Menu className="mr-2 h-4 w-4" /> Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={convertToJson}>
                  <Code className="mr-2 h-4 w-4" /> Convert to JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={removeWhitespace}>
                  <Copy className="mr-2 h-4 w-4" /> Remove Whitespace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={formatJson}>
                  <AlignJustify className="mr-2 h-4 w-4" /> Format JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={pasteFromClipboard}>
                  <Copy className="mr-2 h-4 w-4" /> Paste
                </DropdownMenuItem>
                <DropdownMenuItem onClick={resetData}>
                  <Trash2 className="mr-2 h-4 w-4" /> Reset
                </DropdownMenuItem>
                <DropdownMenuItem onClick={reloadData}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Reload
                </DropdownMenuItem>
                <DropdownMenuItem onClick={generateTypes}>
                  <FileCode className="mr-2 h-4 w-4" /> Generate Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={downloadTypes}>
                  <Download className="mr-2 h-4 w-4" /> Download Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={fixJson}>
                  <Tool className="mr-2 h-4 w-4" /> Fix JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {sidebarOpen && (
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="h-full bg-white border-r border-gray-200 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Input Data</h2>
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-grow p-4">
                <pre className="text-sm whitespace-pre-wrap">{jsonData}</pre>
              </ScrollArea>
            </div>
          </ResizablePanel>
        )}
        {sidebarOpen && <ResizableHandle />}
        <ResizablePanel>
          <main className="h-full flex flex-col overflow-hidden">
            {!sidebarOpen && (
              <Button variant="ghost" size="sm" className="m-2" onClick={() => setSidebarOpen(true)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            <div className="p-4 flex items-center space-x-2 bg-gray-50 border-b border-gray-200">
              <div className="flex-1">
                <p className="text-sm text-gray-500">Current Path: {currentPath.join(' > ')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search JSON..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Tabs defaultValue="editor" className="flex-1 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center p-4">
                <TabsList>
                  <TabsTrigger value="editor" className="flex items-center">
                    <Code className="mr-2 h-4 w-4" /> Editor
                  </TabsTrigger>
                  <TabsTrigger value="viewer" className="flex items-center">
                    <Eye className="mr-2 h-4 w-4" /> Viewer
                  </TabsTrigger>
                  <TabsTrigger value="schema" className="flex items-center">
                    <AlignJustify className="mr-2 h-4 w-4" /> Schema
                  </TabsTrigger>
                  <TabsTrigger value="types" className="flex items-center">
                    <FileCode className="mr-2 h-4 w-4" /> Types
                  </TabsTrigger>
                </TabsList>
                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === 'code' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('code')}
                  >
                    <Code className="mr-2 h-4 w-4" /> Code
                  </Button>
                  <Button
                    variant={viewMode === 'tree' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('tree')}
                  >
                    <Eye className="mr-2 h-4 w-4" /> Tree
                  </Button>
                </div>
              </div>
              <ResizablePanelGroup direction="vertical" className="flex-1">
                <ResizablePanel defaultSize={70}>
                  <TabsContent value="editor" className="h-full">
                    <div ref={editorRef} className="h-full"></div>
                  </TabsContent>
                  <TabsContent value="viewer" className="h-full">
                    <ScrollArea className="h-full p-4">
                      {viewMode === 'code' ? (
                        <pre className="text-sm json-viewer">{JSON.stringify(parsedJson, null, 2)}</pre>
                      ) : (
                        parsedJson && <JSONViewer data={parsedJson} />
                      )}
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="schema" className="h-full p-4">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <Button onClick={() => schemaInputRef.current?.click()}>
                          Upload JSON Schema
                        </Button>
                        <input
                          ref={schemaInputRef}
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={handleSchemaUpload}
                          aria-label="Upload JSON schema file"
                        />
                      </div>
                      <Textarea
                        value={jsonSchema}
                        onChange={(e) => setJsonSchema(e.target.value)}
                        placeholder="Paste your JSON schema here..."
                        className="flex-1 font-mono"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="types" className="h-full p-4">
                    <ScrollArea className="h-full">
                      <pre className="text-sm whitespace-pre-wrap">{generatedTypes}</pre>
                    </ScrollArea>
                  </TabsContent>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={30}>
                  {validationErrors.length > 0 && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                      <p className="font-bold">Validation Errors:</p>
                      <ul className="list-disc list-inside">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </ResizablePanel>
              </ResizablePanelGroup>
            </Tabs>
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
      {toastMessage && (
        <Toast>
          <div className="flex items-center">
            {validationErrors.length > 0 ? (
              <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
            ) : (
              <Check className="h-4 w-4 text-green-500 mr-2" />
            )}
            <span>{toastMessage}</span>
          </div>
        </Toast>
      )}
    </div>
  )
}