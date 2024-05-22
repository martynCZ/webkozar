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
                <li>Služby</li>
                <li>Reference</li>
                <li>Ceník</li>
                <li>Kontakty</li>
            </ul>
        </div>

    </div>
  )
}

export default Header