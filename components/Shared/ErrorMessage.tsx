import React from 'react'

interface ErrorMessageProps {
  errors: Record<string, string[]>
  fieldName: string
}

const ErrorMessage = React.memo<ErrorMessageProps>(({ 
  errors, 
  fieldName 
}) => {
  const fieldErrors = errors[fieldName] || []
  if (fieldErrors.length === 0) return null
  
  return (
    <div className="help is-danger is-size-7">
      {fieldErrors.map((error, index) => (
        <div key={index}>{error}</div>
      ))}
    </div>
  )
})

ErrorMessage.displayName = 'ErrorMessage'

export default ErrorMessage 