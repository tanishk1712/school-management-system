import React from 'react'

export default function Loader() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
            <p className="mt-2 text-gray-500">Loading...</p>
        </div>
    )
}
