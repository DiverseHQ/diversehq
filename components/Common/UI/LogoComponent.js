import Link from 'next/link'
import React from 'react'

const LogoComponent = () => {
  return (
    <Link href={'/'} passHref>
      <div className="flex flex-row justify-center items-center  h-fit w-fit">
        <img
          src="/LogoV3TrimmedWithBG.png"
          className="w-[25px] h-[25px] sm:w-[35px] sm:h-[35px]"
          alt="DivrseHQ Logo"
        />
        <div className="text-xs sm:text-2xl mx-2 text-p-btn font-semibold">
          Diverse HQ
        </div>
        <div className="flex flex-col justify-center items-start">
          <div className="text-xs text-s-text leading-3">Beta</div>
          <div className="text-xs text-s-text leading-3">Testnet</div>
        </div>
      </div>
    </Link>
  )
}

export default LogoComponent
