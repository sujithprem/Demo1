import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Billing from './pages/Billing'
import Products from './pages/Products'
import Staff from './pages/Staff'
import Billhistory from './pages/Billhistory'

const App = () => {
  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/bill' element={<Billing />}/>
        <Route path='/billhistory' element={<Billhistory />}/>
        <Route path='/product' element={<Products />}/>
        <Route path='/staff' element={<Staff />}/>
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App