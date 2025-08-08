'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {

      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Use AuthContext to login
        login(data.user, data.token)

        
        // Redirect to dashboard
        router.push('/')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="hero is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5">
              <div className="box" style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                borderRadius: '12px',
                border: '2px solid #f0f0f0',
                backgroundColor: '#ffffff'
              }}>
                <h1 className="title has-text-centered mb-5 has-text-black">Sign In</h1>
                
                {/* Demo credentials */}
                <div className="notification is-info is-light mb-4">
                  <strong>Demo Credentials:</strong><br/>
                  Admin: admin@aluffm.com / admin123<br/>
                  User: user@aluffm.com / user123
                </div>
                
                {error && (
                  <div className="notification is-danger is-light mb-4">
                    <button className="delete" onClick={() => setError('')}></button>
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <p className="control has-icons-left">
                      <input 
                        className="input is-medium" 
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="icon is-small is-left">
                        <i className="material-icons">email</i>
                      </span>
                    </p>
                  </div>
                  
                  <div className="field">
                    <p className="control has-icons-left">
                      <input 
                        className="input is-medium" 
                        type="password" 
                        name="password"
                        placeholder="Password" 
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="icon is-small is-left">
                        <i className="material-icons">lock</i>
                      </span>
                    </p>
                  </div>
                  
                  <div className="field">
                    <p className="control">
                      <button 
                        className={`button is-primary is-medium is-fullwidth ${isLoading ? 'is-loading' : ''}`}
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        </div>
    </div>
  )
}

export default SignIn