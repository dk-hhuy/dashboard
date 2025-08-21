'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

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
            <div className="column is-5 is-size-7">
              <div className="box has-shadow is-size-7">
                <h1 className="title has-text-centered mb-5 has-text-white is-size-6">Sign In</h1>
                
                {/* Demo credentials */}
                <div className="notification is-info is-light mb-4 is-size-7">
                  <strong>Demo Credentials:</strong><br/>
                  Admin: admin@aluffm.com / admin123<br/>
                  User: user@aluffm.com / user123
                </div>
                
                {error && (
                  <div className="notification is-danger is-light mb-4 is-size-7">
                    <button className="delete" onClick={() => setError('')}></button>
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="field is-size-7">
                    <p className="control has-icons-left is-size-7">
                      <input 
                        className="input is-medium is-size-7" 
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="icon is-small is-left is-size-7">
                        <i className="material-icons is-size-7">email</i>
                      </span>
                    </p>
                  </div>
                  
                  <div className="field is-size-7">
                    <p className="control has-icons-left is-size-7">
                      <input 
                        className="input is-medium is-size-7" 
                        type="password" 
                        name="password"
                        placeholder="Password" 
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="icon is-small is-left is-size-7">
                        <i className="material-icons is-size-7">lock</i>
                      </span>
                    </p>
                  </div>
                  
                  <div className="field is-size-7">
                    <p className="control is-size-7">
                      <button 
                        className={`button is-primary is-medium is-fullwidth is-size-7 ${isLoading ? 'is-loading' : ''}`}
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