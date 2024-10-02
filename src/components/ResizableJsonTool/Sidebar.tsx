import React from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronLeft } from 'lucide-react'

interface SidebarProps {
  jsonData: string
  setSidebarOpen: (open: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ jsonData, setSidebarOpen }) => {
  return (
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
  )
}

export default Sidebar