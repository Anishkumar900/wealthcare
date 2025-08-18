import React from 'react'

export default function Loader() {
    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-lg font-semibold text-gray-600 animate-pulse">
                Loading...
            </p>
        </div>
    )
}
