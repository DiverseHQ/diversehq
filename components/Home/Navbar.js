import React from 'react'
import SearchModal from '../Search/SearchModal'

import Link from 'next/link'
import LensLoginButton from '../Common/LensLoginButton'

const Navbar = () => {
  return (
    <div className="flex flex-row flex-1 z-10 justify-between px-4 md:px-8 py-2 items-center shadow-md gap-2 sticky top-0 bg-p-bg">
      <Link
        className="flex flex-row items-center border-[1px] border-[#C9A4F4] rounded-[50px] hover:cursor-pointer"
        href={'/'}
      >
        <img
          className="w-[44px] h-[44px] object-contain"
          src="/logo.svg"
          alt="Diverse HQ logo"
        />
        <h2 className="text-[18px] text-p-btn font-semibold tracking-wide p-1 md:p-2">
          DIVERSE HQ
        </h2>
      </Link>
      <SearchModal />
      <LensLoginButton />
    </div>
  )
}

export default Navbar
