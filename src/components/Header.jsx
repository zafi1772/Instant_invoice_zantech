import React from 'react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">
              Zantech Instant Order
            </h1>
            <p className="text-gray-600 text-lg">
              Product Management & Invoice Generation System
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
