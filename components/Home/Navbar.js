import React from 'react'
import SearchModal from '../Search/SearchModal'

import Link from 'next/link'
import LensLoginButton from '../Common/LensLoginButton'

const Navbar = () => {
  return (
    <div className="flex flex-row flex-1 z-10 justify-between px-4 md:px-8 py-2 items-center shadow-md gap-2 sticky top-0 bg-p-bg">
      <div className="w-[150px] md:w-[250px] lg:w-[300px] xl:w-[350px]">
        <Link
          className="flex flex-row items-center w-fit hover:cursor-pointer"
          href={'/'}
          passHref
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
      </div>
      <SearchModal />
      <div className="w-[150px] md:w-[250px] lg:w-[300px] xl:w-[350px] flex flex-row justify-end">
        <LensLoginButton />
      </div>
    </div>
  )
}

export default Navbar
