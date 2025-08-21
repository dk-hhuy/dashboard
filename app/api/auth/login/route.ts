import { NextRequest, NextResponse } from 'next/server'
import { socialLinks } from '@/constants'

// Mock user data - replace with your actual database
const mockUsers = [
  {
    id: 1,
    email: 'admin@aluffm.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    avatar: '/images/husble.png',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    createdAt: '2024-01-15',
    lastLogin: '2024-12-19 14:30',
    status: 'Active',
    emailVerified: true,
    totalOrders: 156,
    completedOrders: 142,
    language: 'English',
    timezone: 'America/New_York',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    socialLinks: socialLinks
  },
  {
    id: 2,
    email: 'user@aluffm.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user',
    avatar: '/images/husble.png',
    phone: '+1 (555) 987-6543',
    location: 'Los Angeles, USA',
    createdAt: '2024-03-20',
    lastLogin: '2024-12-19 10:15',
    status: 'Active',
    emailVerified: true,
    totalOrders: 89,
    completedOrders: 76,
    language: 'English',
    timezone: 'America/Los_Angeles',
    notifications: {
      email: true,
      push: false,
      sms: true
    },
    socialLinks: socialLinks
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { email, password } = body

    // Validate input
    if (!email || !password) {
  
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }


    // Find user
    const user = mockUsers.find(u => u.email === email && u.password === password)

    if (!user) {
  
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }


    // Create user object without password
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      location: user.location,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      status: user.status,
      emailVerified: user.emailVerified,
      totalOrders: user.totalOrders,
      completedOrders: user.completedOrders,
      language: user.language,
      timezone: user.timezone,
      notifications: user.notifications,
      socialLinks: user.socialLinks
    }

    // Generate mock token (in real app, use JWT)
    const token = `mock-jwt-token-${user.id}-${Date.now()}`

    const response = {
      message: 'Login successful',
      user: userWithoutPassword,
      token: token
    }
    

    return NextResponse.json(response)

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 