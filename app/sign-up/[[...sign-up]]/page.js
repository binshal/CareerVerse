import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import Signup from '@/components/Pages/Signup'

const page = () => {
  return (
    <ClerkProvider>
            <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-6 flex items-center justify-center min-h-screen px-4">
              <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <Signup />
              </div>
            </div>
        </ClerkProvider>
  )
}

export default page
