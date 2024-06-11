import React from 'react'

export default function Unauthorized() {
  return (
    <div>
            <div className="w-56 h-72 my-12 mx-auto">
                <h1 className="text-3xl font-bold text-red-700">Unauthorized Entry</h1>
                <p className="text-xl py-6">Sorry, an unexpected error has occurred.</p>
            
                <div className="my-6 text-blue-600">
                    <Link to={'/'}>Return Home</Link>
                </div>
            </div>
    </div>
  )
}
