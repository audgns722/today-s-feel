import React from 'react'

const Header = () => {
    return (
        <nav className="flex justify-between items-center py-6 px-10">
            <div className='flex gap-1 mr-5'>
                <span className="w-3 h-3 inline-block bg-red-500 rounded-xl mr-2"></span>
                <span className="w-3 h-3 inline-block bg-yellow-400 rounded-xl mr-2"></span>
                <span className="w-3 h-3 inline-block bg-green-400 rounded-xl"></span>
            </div>
            <div className="flex items-center mx-auto gap-3 max-w-screen-xl w-full px-5 p-2 bg-white rounded-lg shadow-lg">
                <span>⭐</span>
                <h1 className='text-1xl'>오늘 기분 어때</h1>
            </div>
        </nav>
    )
}

export default Header