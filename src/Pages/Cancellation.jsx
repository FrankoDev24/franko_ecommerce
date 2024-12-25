import React from 'react'
import { Navigate } from 'react-router-dom'

function Cancellation() {
  return (
    <div className="flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Order Cancellation</h1>
          <p className="text-md text-gray-600 mb-6">
            We're sorry to hear you're cancelling your order. 
          </p>
          
          {/* Cancellation Information */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="text-sm text-yellow-700 font-semibold">Please note:</p>
            <p className="text-sm text-yellow-700">Cancelling an order will remove it from our system, and you will not be charged for this purchase.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              className="w-full sm:w-auto bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300"
              onClick={() => Navigate('/home')}
            >
              Back To Shopping
            </button>
           
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cancellation
