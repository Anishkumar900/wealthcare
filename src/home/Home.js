import React, { useContext, useEffect, useState } from 'react'
import Header from '../bar/Header'
import Footer from '../bar/Footer'
import AddExpenses from './AddExpenses';

const baseURL = process.env.REACT_APP_API_BASE_URL;
export default function Home() {

  return (
    <div>
      <Header/>
      <div className='pt-16 z-0'>
        <AddExpenses/>
        <Footer />
      </div>
      
    </div>
  )
}
