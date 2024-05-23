import React, { useState } from 'react';

const Sluzby = () => {
  const [hoverState, setHoverState] = useState({
    firstBox: { x: '50%', y: '50%', opacity: 0, rotateX: 0, rotateY: 0 },
    secondBox: { x: '50%', y: '50%', opacity: 0, rotateX: 0, rotateY: 0 },
    thirdBox: { x: '50%', y: '50%', opacity: 0, rotateX: 0, rotateY: 0 }
  });

  const handleMouseMove = (e, boxName) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const rotateX = (y - 50) / 5; // Adjust the divisor to control the intensity of the 3D effect
    const rotateY = (x - 50) / -5; // Adjust the divisor to control the intensity of the 3D effect

    setHoverState((prev) => ({
      ...prev,
      [boxName]: { x: `${x}%`, y: `${y}%`, opacity: 1, rotateX, rotateY },
    }));
  };

  const handleMouseLeave = (boxName) => {
    setHoverState((prev) => ({
      ...prev,
      [boxName]: { ...prev[boxName], opacity: 0, rotateX: 0, rotateY: 0 },
    }));
  };

  return (
    <div>
      <div className='md:max-w-[65%] max-w-full'>
        <h2 className='text-white text-2xl'>Služby</h2>
        <h3 className='text-3xl font-medium text-ruzova my-2'>Naše služby</h3>
        <p className='text-3xl font-medium text-white'>
          Nabízíme široké množství řešení v oblasti webových stránek a grafiky na míru
        </p>
      </div>
      <div className='my-10 flex flex-col gap-10'>
        <div
          className='relative h-96 text-2xl border-[2px] bg-graybg border-gray-100 rounded-xl flex justify-between overflow-hidden'
          onMouseMove={(e) => handleMouseMove(e, 'firstBox')}
          onMouseLeave={() => handleMouseLeave('firstBox')}
          style={{
            transform: `rotateX(${hoverState.firstBox.rotateX}deg) rotateY(${hoverState.firstBox.rotateY}deg)`,
            transition: 'transform 0.1s',
          }}
        >
          <div
            className='absolute inset-0 transition-opacity duration-300 pointer-events-none'
            style={{
              background: `radial-gradient(circle at ${hoverState.firstBox.x} ${hoverState.firstBox.y}, rgba(15, 194, 192, 0.2), transparent)`,
              opacity: hoverState.firstBox.opacity,
            }}
          />
          <div className='flex flex-1 flex-col h-full justify-between p-8 z-10'>
            <p className='text-gray'>
              <span className='text-white'>Tvoříme firemní weby </span>
              i osobní portfolia přesně na míru, dle vašich představ.
            </p>
            <a href='#' className='text-white'>
              Zjistit více
            </a>
          </div>
          <div className='flex-1 max-h-full z-10'>
            <img src='/mobil-showcase.svg' className='h-full' alt='Showcase' />
          </div>
        </div>
        <div className='flex gap-10'>
          <div
            className='relative flex-1 h-96 text-2xl border-[2px] bg-graybg border-gray-100 rounded-xl flex justify-between'
            onMouseMove={(e) => handleMouseMove(e, 'secondBox')}
            onMouseLeave={() => handleMouseLeave('secondBox')}
            style={{
              transform: `rotateX(${hoverState.secondBox.rotateX}deg) rotateY(${hoverState.secondBox.rotateY}deg)`,
              transition: 'transform 0.1s',
            }}
          >
            <div
              className='absolute inset-0 transition-opacity duration-300 pointer-events-none'
              style={{
                background: `radial-gradient(circle at ${hoverState.secondBox.x} ${hoverState.secondBox.y}, rgba(15, 194, 192, 0.2), transparent)`,
                opacity: hoverState.secondBox.opacity,
              }}
            />
            <div className='flex flex-1 flex-col h-full justify-between p-8'>
              <p className='text-gray'>
                Potřebujete <span className='text-white'>vytvořit e-shop? <br /></span>
                I s tímto Vám dokážeme pomoci.
              </p>
            </div>
          </div>
          <div
            className='relative flex-1 h-96 text-2xl border-[2px] bg-graybg border-gray-100 rounded-xl flex justify-between'
            onMouseMove={(e) => handleMouseMove(e, 'thirdBox')}
            onMouseLeave={() => handleMouseLeave('thirdBox')}
            style={{
              transform: `rotateX(${hoverState.thirdBox.rotateX}deg) rotateY(${hoverState.thirdBox.rotateY}deg)`,
              transition: 'transform 0.1s',
            }}
          >
            <div className='flex flex-1 flex-col h-full justify-between p-8'>
              <p className='text-gray'>
                <span className='text-white'>Loga, </span>
                grafické návrhy pro reklamační účely. <br />
                <span className='text-white'>UI/UX design, návrhy </span>
                webových stránek
              </p>
            </div>
            <div
              className='absolute inset-0 transition-opacity duration-300 pointer-events-none'
              style={{
                background: `radial-gradient(circle at ${hoverState.thirdBox.x} ${hoverState.thirdBox.y}, rgba(15, 194, 192, 0.2), transparent)`,
                opacity: hoverState.thirdBox.opacity,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sluzby;
