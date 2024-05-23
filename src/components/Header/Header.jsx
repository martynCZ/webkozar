import React from 'react'


const Header = () => {
  return (
    <div className='flex justify-between items-center text-white h-20'>
        <div className='flex items-center gap-2'>
            <h1>Webkozar</h1>
            <img src="/logo.svg" alt="" />
        </div>
        <div className='flex items-center gap-2'>
            <ul className='flex gap-20'>
                <li className='hover:text-gray transition'><a href="#sluzby">Služby</a></li>
                <li className='hover:text-gray transition'><a href="#reference">Reference</a></li>
                <li className='hover:text-gray transition'><a href="#cenik">Ceník</a></li>
                <li className='hover:text-gray transition'><a href="#kontakty">Kontakty</a></li>
            </ul>
        </div>

    </div>
  )
}

export default Header