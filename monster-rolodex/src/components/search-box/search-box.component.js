import React from 'react'
import './search-box.style.css'

export const SearchBox = ({ handleChange }) => (

    <input className='search' type='search' placeholder='Search monsters' onChange={handleChange} />

)