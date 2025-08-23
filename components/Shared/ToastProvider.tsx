import React, { createContext, useContext, useState, ReactNode } from 'react'
import Toast, { ToastProps, ToastContextType } from './Toast'

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// ============================================================================
// TOAST PROVIDER COMPONENT
// ============================================================================

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([])
  const [toastCounter, setToastCounter] = useState(0)

  // Show toast function - memoized to prevent unnecessary re-renders
  const showToast = React.useCallback((message: string, type: ToastProps['type'], duration = 6000) => {
    const id = `toast-${Date.now()}-${toastCounter}`
    setToastCounter(prev => prev + 1)
    
    const newToast: ToastProps = {
      id,
      message,
      type,
      duration,
      onClose: () => hideToast(id)
    }
    
    // Thêm toast mới vào cuối, giữ tối đa 5 toast
    setToasts(prev => {
      const updatedToasts = [...prev, newToast]
      // Nếu có hơn 5 toast, xóa toast cũ nhất
      if (updatedToasts.length > 5) {
        return updatedToasts.slice(-5)
      }
      return updatedToasts
    })
  }, [toastCounter])

  // Hide specific toast - memoized
  const hideToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  // Hide all toasts - memoized
  const hideAllToasts = React.useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast: hideAllToasts }}>
      {children}
      
      {/* Toast Container */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        zIndex: 99999, 
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxHeight: 'calc(100vh - 40px)',
        overflow: 'hidden'
      }}>
        {toasts.map((toast, index) => (
          <div 
            key={toast.id || index}
            style={{ 
              pointerEvents: 'auto',
              marginBottom: '10px'
            }}
          >
            <Toast {...toast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
} 