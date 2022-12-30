import React from 'react'

const LogoComponent = () => {
  return (
    <div className="flex flex-row justify-center items-center border-2 rounded-full border-[#3EBDFA] w-fit  h-fit">
      <img
        src="/logo.png"
        className="rounded-full w-[30px] h-[30px] sm:w-[50px] sm:h-[50px]"
      />
      <div className="text-xs sm:text-xl mx-1 sm:mx-2">Diverse HQ</div>
    </div>
  )
}

export default LogoComponent
