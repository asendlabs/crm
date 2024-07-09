import React from 'react'

const Navbar = () => {
  return (
    <nav className='w-screen h-16 flex items-center justify-between bg-white'>
      <div className='flex items-center gap-5'>
        <img src='/logo.png' alt='logo' className='w-10 h-10' />
        <h1 className='text-2xl font-semibold'>Warisare</h1>
      </div>
      <div className='flex items-center gap-5'>
        <a href='#' className='text-primary'>
          Home
        </a>
        <a href='#' className='text-primary'>
          About
        </a>
        <a href='#' className='text-primary'>
          Contact
        </a>
      </div>
    </nav>
  )
}

export default Navbar