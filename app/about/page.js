import About from '@/components/about/About'
import { AboutNav } from '@/components/Pages/AboutNav'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EA502C] via-[#EA502C] to-[#EA502C] text-white p-6">
        <AboutNav/>
      <About/>
    </div>
  )
}

export default page
