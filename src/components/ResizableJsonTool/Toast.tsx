import React from 'react'
import { Toast as ToastComponent } from '@/components/ui/toast'
import { Check, AlertTriangle } from 'lucide-react'

interface ToastProps {
  message: string
  validationErrors: string[]
}

const Toast: React.FC<ToastProps> = ({ message, validationErrors }) => {
  if (!message) return null

  return (
    <ToastComponent>
      <div className="flex items-center">
        {validationErrors.length > 0 ? (
          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
        ) : (
          <Check className="h-4 w-4 text-green-500 mr-2" />
        )}
        <span>{message}</span>
      </div>
    </ToastComponent>
  )
}

export default Toast