import CpBody from '@/components/career-path/CpBody'
import { Navbar } from '@/components/Pages/Navbar'
import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div>
      <ClerkProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-6">
      <Navbar/>
      <CpBody/>
      </div>
      </ClerkProvider>
    </div>
  )
}

export default page
