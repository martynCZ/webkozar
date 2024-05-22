import React from 'react'

const Sluzby = () => {
  return (
    <div>
        <div className='md:max-w-[65%] max-w-full'>
            <h2 className='text-white text-2xl'>Služby</h2>
            <h3 className='text-3xl font-medium text-ruzova my-2'>Naše služby</h3>
            <p className='text-3xl font-medium text-white'>Nabízíme široké množství řešení v oblasti 
            webových stránek a grafiky na míru
            </p>
        </div>
        <div className='my-10 flex flex-col gap-10'>
            <div className='h-96 text-2xl border-[2px] bg-graybg border-gray-100 rounded-xl flex justify-between'>
                <div className='flex flex-1 flex-col h-full justify-between p-8'>
                    <p className='text-gray'><span className='text-white'>Tvoříme firemní weby </span>
                    i osobní portfolia přesně na míru, dle vašich představ.</p>
                    <a href="#" className='text-white'>
                        Zjistit více
                    </a>
                </div>
                <div className='flex-1 max-h-full'>
                    <img src="/mobil-showcase.svg" className='h-full' alt="" />
                </div>
            </div>
            <div className='flex gap-10'>
                <div className='flex-1 h-96 text-2xl border-[2px] bg-graybg border-gray-100 rounded-xl flex justify-between'>
                    <div className='flex flex-1 flex-col h-full justify-between p-8'>
                        <p className='text-gray'>Potřebujete <span className='text-white'>vytvořit e-shop? <br /></span>
                        I s tímto Vám dokážeme pomoci.</p>
                  
                    </div>
                </div>
                <div className='flex-1 h-96 text-2xl border-[2px] bg-graybg border-gray-100 rounded-xl flex justify-between'>
                    <div className='flex flex-1 flex-col h-full justify-between p-8'>
                        <p className='text-gray'><span className='text-white'>Loga, </span>
                        grafické návrhy pro rekační účely. <br /><span className='text-white'>UI/UX design, návrhy </span>
                        webových stránek
                        </p>
                  
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Sluzby