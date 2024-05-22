import React from 'react'
import { AiOutlineCode } from "react-icons/ai";

const Sidebar = () => {
  return (
        <div className='h-full'>
          <div className='w-1 m-auto big:h-52 h-44 bg-gradient-to-b from-[#0D1117] via-[#0668CF] to-modra'>          
          </div>
          <div className="my-4 relative">
            <div className="absolute inset-0 bg-modra opacity-80 blur-xl"></div>
              <AiOutlineCode color='white' size={36}/>
          </div>
          <div className='w-1 h-64 m-auto bg-gradient-to-b to-ruzova from-modra'>            
          </div>
          <div className="my-4 relative">
            <div className="absolute inset-0 bg-ruzova opacity-80 blur-xl"></div>
              <AiOutlineCode color='white' size={36}/>
          </div>
          <div className='w-1 h-screen m-auto bg-gradient-to-b from-ruzova to-modra'></div>
        </div>
        
    
  )
}

export default Sidebar