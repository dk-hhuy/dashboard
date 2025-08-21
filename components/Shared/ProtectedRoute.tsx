'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) router.push('/SignIn')
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="hero is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-4">
                <div className="box has-text-centered">
                  <div className="content is-size-7">
                    <h3 className="title is-4 is-size-6">Authentication Required</h3>
                    <p className="is-size-7">Please sign in to access this page.</p>
                    <div className="mt-4">
                      <button 
                        className="button is-primary is-size-7"
                        onClick={() => router.push('/SignIn')}
                      >
                        Go to Sign In
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute 