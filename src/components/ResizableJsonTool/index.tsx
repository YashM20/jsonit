// import React, { useState, useRef } from 'react'
// import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
// import Header from './Header'
// import Sidebar from './Sidebar'
// import MainContent from './MainContent'
// import Toast from './Toast'

// export function ResizableJsonTool() {
//   const [jsonData, setJsonData] = useState('')
//   const [parsedJson, setParsedJson] = useState<any>(null)
//   const [validationErrors, setValidationErrors] = useState<string[]>([])
//   const [toastMessage, setToastMessage] = useState('')
//   const [sidebarOpen, setSidebarOpen] = useState(true)
//   const [currentPath, setCurrentPath] = useState<string[]>([])
//   const [jsonSchema, setJsonSchema] = useState('')
//   const [generatedTypes, setGeneratedTypes] = useState('')
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const schemaInputRef = useRef<HTMLInputElement>(null)

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <Header
//         fileInputRef={fileInputRef}
//         setJsonData={setJsonData}
//         setParsedJson={setParsedJson}
//         setToastMessage={setToastMessage}
//         validateJson={validateJson}
//       />
//       <ResizablePanelGroup direction="horizontal" className="flex-1">
//         {sidebarOpen && (
//           <ResizablePanel defaultSize={20} minSize={15}>
//             <Sidebar
//               jsonData={jsonData}
//               setSidebarOpen={setSidebarOpen}
//             />
//           </ResizablePanel>
//         )}
//         {sidebarOpen && <ResizableHandle />}
//         <ResizablePanel>
//           <MainContent
//             sidebarOpen={sidebarOpen}
//             setSidebarOpen={setSidebarOpen}
//             currentPath={currentPath}
//             setCurrentPath={setCurrentPath}
//             jsonData={jsonData}
//             setJsonData={setJsonData}
//             parsedJson={parsedJson}
//             setParsedJson={setParsedJson}
//             validationErrors={validationErrors}
//             setValidationErrors={setValidationErrors}
//             jsonSchema={jsonSchema}
//             setJsonSchema={setJsonSchema}
//             generatedTypes={generatedTypes}
//             setGeneratedTypes={setGeneratedTypes}
//             schemaInputRef={schemaInputRef}
//           />
//         </ResizablePanel>
//       </ResizablePanelGroup>
//       <Toast message={toastMessage} validationErrors={validationErrors} />
//     </div>
//   )
// }