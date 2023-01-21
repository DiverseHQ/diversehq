import React from 'react'
import SearchModal from '../Search/SearchModal'

// import Link from 'next/link'
import LensLoginButton from '../Common/LensLoginButton'
import LogoComponent from '../Common/UI/LogoComponent'

const Navbar = () => {
  return (
    <div className="flex flex-row flex-1 z-40 justify-between px-4 md:px-8 py-2 items-center shadow-md gap-2 sticky top-0 bg-p-bg">
      <div className="w-[150px] md:w-[250px] lg:w-[300px] xl:w-[350px]">
        <LogoComponent />
      </div>
      <SearchModal />
      <div className="w-[150px] md:w-[250px] lg:w-[300px] xl:w-[350px] flex flex-row justify-end">
        <LensLoginButton />
      </div>
    </div>
  )
}

export default Navbar
