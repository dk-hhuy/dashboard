'use client'

import { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function SignOut() {
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Perform logout
    logout()
    
    // Redirect to sign in page
    router.push('/SignIn')
  }, [logout, router])

  return (
    <div className="hero is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4">
              <div className="box has-text-centered">
                <div className="content">
                  <h3 className="title is-4">Signing Out...</h3>
                  <p>Please wait while we sign you out.</p>
                  <div className="mt-4">
                    <div className="button is-loading is-primary">Loading</div>
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