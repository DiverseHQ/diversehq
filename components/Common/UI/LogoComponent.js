import Link from 'next/link'
import React from 'react'

const LogoComponent = () => {
  return (
    <Link
      className="flex flex-row justify-center items-center  h-fit w-fit"
      href={'/'}
      passHref
    >
      <img
        src="/LogoV3TrimmedWithBG.png"
        className="w-[25px] h-[25px] sm:w-[35px] sm:h-[35px]"
        alt="DivrseHQ Logo"
      />
      <div className="text-xs sm:text-2xl mx-2 text-p-btn font-semibold">
        Diverse HQ
      </div>
    </Link>
  )
}

export default LogoComponent
