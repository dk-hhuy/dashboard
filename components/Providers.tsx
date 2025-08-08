'use client'

import { AuthProvider } from '../contexts/AuthContext'

const Providers = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
)

export default Providers 