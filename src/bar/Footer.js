import React from 'react'
import { Link } from 'react-router-dom';
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";

export default function Footer() {
  return (
    <div className='bg-black text-white md:py-16 py-10 justify-center px-2 md:px-0'>
      <p className='md:text-center font-sans md:text-3xl text-xl'>Wealth Care</p>
      <ul className="md:flex md:space-x-10 text-gray-500 justify-center py-4">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/bank">Bank</Link>
        </li>
        <li>
          <Link to="/analysis">Analysis</Link>
        </li>
        <li>
          <Link to="/history">History</Link>
        </li>
      </ul>

      <div className='flex justify-center gap-10 py-3'>
        <FaLinkedin  size={24}/>
        <FaInstagramSquare size={24}/>
        <FaFacebookSquare size={24}/>
      </div>

      <p className=' text-gray-500 text-center'>
        © {new Date().getFullYear()} Wealth Care. All rights reserved. Unauthorized use is prohibited.
      </p>
    </div>
  )
}
