import React, { useEffect, useState } from 'react'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ToastProps {
  id?: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose?: () => void
}

export interface ToastContextType {
  showToast: (message: string, type: ToastProps['type'], duration?: number) => void
  hideToast: () => void
}

// ============================================================================
// TOAST COMPONENT
// ============================================================================

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  duration = 6000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true)

  // Auto hide after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onClose?.()
      }, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  // Manual close
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
        return 'ℹ'
      default:
        return 'ℹ'
    }
  }

  // Get background color based on type
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'has-background-success'
      case 'error':
        return 'has-background-danger'
      case 'warning':
        return 'has-background-warning'
      case 'info':
        return 'has-background-info'
      default:
        return 'has-background-info'
    }
  }

  // Get text color based on type
  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'has-text-white'
      case 'error':
        return 'has-text-white'
      case 'warning':
        return 'has-text-dark'
      case 'info':
        return 'has-text-white'
      default:
        return 'has-text-white'
    }
  }

  return (
    <div 
      className={`notification ${getBackgroundColor()} ${getTextColor()} is-size-7`}
      style={{
        minWidth: '300px',
        maxWidth: '500px',
        maxHeight: '200px',
        overflow: 'hidden',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'all 0.3s ease-in-out',
        borderRadius: '8px',
        pointerEvents: 'auto'
      }}
    >
      {/* Close button */}
      <button 
        className="delete is-small" 
        onClick={handleClose}
        style={{ 
          position: 'absolute', 
          top: '6px', 
          right: '6px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          border: 'none',
          width: '16px',
          height: '16px',
          minWidth: '16px',
          minHeight: '16px'
        }}
      />
      
      {/* Toast content */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <span 
          style={{ 
            fontSize: '12px', 
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            flexShrink: 0,
            lineHeight: '1'
          }}
        >
          {getIcon()}
        </span>
                    <p 
              className="is-size-7 mb-0" 
              style={{ 
                flex: 1,
                lineHeight: '1.4',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                maxHeight: '150px',
                overflow: 'auto',
                paddingRight: '8px',
                margin: 0
              }}
              dangerouslySetInnerHTML={{
                __html: message.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #2563eb;">$1</strong>')
              }}
            />
      </div>
    </div>
  )
}

export default Toast 