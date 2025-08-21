'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from './Shared'

const Providers = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <ToastProvider>
      {children}
    </ToastProvider>
  </AuthProvider>
)

export default Providers 