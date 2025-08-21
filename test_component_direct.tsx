"use client"

import React, { useState } from 'react'
import { validateUpdatePriceField } from '@/schemas/updatePriceSchema'

export default function TestComponent() {
  const [input, setInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    
    console.log('Testing validation for:', value)
    const result = validateUpdatePriceField('cost', value)
    console.log('Validation result:', result)
    
    if (!result.success && result.errors.cost) {
      setErrors({ '0.cost': result.errors.cost })
      console.log('Setting errors:', result.errors.cost)
    } else {
      setErrors({})
      console.log('Clearing errors')
    }
  }

  const error = errors['0.cost']?.[0]
  console.log('Current error to display:', error)

  return (
    <div style={{ padding: '20px' }}>
      <h2>Validation Test</h2>
      
      <div>
        <label>Cost:</label>
        <input 
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Enter cost"
          style={{ 
            padding: '8px', 
            margin: '8px',
            border: error ? '2px solid red' : '1px solid #ccc'
          }}
        />
      </div>
      
      {error && (
        <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </p>
      )}
      
      <div style={{ marginTop: '10px', fontSize: '12px', color: 'gray' }}>
        <p>Input: "{input}"</p>
        <p>Has Error: {!!error ? 'true' : 'false'}</p>
        <p>Error: {error || 'none'}</p>
        <p>All Errors: {JSON.stringify(errors)}</p>
      </div>
    </div>
  )
} 