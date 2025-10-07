import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../components/common/Nav'

const RootLayout = () => {
  return (
    <div className='body'>
        <Nav />
        <main className='page-container'>
            <Outlet />
        </main>
    </div>
  )
}

export default RootLayout
