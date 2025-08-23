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

  // Auto hide after duration - memoized effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onClose?.()
      }, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  // Manual close - memoized handler
  const handleClose = React.useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }, [onClose])

  // Toast styling configuration - memoized to prevent recalculation
  const toastConfig = React.useMemo(() => {
    const configs = {
      success: { icon: '✓', bg: 'has-background-success', text: 'has-text-white' },
      error: { icon: '✕', bg: 'has-background-danger', text: 'has-text-white' },
      warning: { icon: '⚠', bg: 'has-background-warning', text: 'has-text-dark' },
      info: { icon: 'ℹ', bg: 'has-background-info', text: 'has-text-white' }
    }
    return configs[type] || configs.info
  }, [type])

  return (
    <div 
      className={`notification ${toastConfig.bg} ${toastConfig.text} is-size-7`}
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
          {toastConfig.icon}
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