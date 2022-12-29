import React from 'react'
import { useRouter } from 'next/router'
import SearchModal from '../Search/SearchModal'
import { useConnectModal } from '@rainbow-me/rainbowkit'
// import { useProfile } from '../Common/WalletContext'

const Navbar = () => {
  const router = useRouter()
  const { openConnectModal } = useConnectModal()
  //   const { user, address } = useProfile()

  const routeToHome = () => {
    router.push('/')
  }

  return (
    <div className="flex flex-row flex-1 z-10 justify-between px-4 md:px-8 py-4 items-center shadow-nav gap-2 sticky top-0 bg-[#eef1ff]">
      <div
        className="flex flex-row items-center border-[1px] border-[#C9A4F4] rounded-[50px] hover:cursor-pointer"
        onClick={routeToHome}
      >
        <img
          className="w-[44px] h-[44px] object-contain"
          src="./logo.svg"
          alt="Diverse HQ logo"
        />
        <h2 className="text-[18px] text-p-btn font-semibold tracking-wide p-1 md:p-2">
          DIVERSE HQ
        </h2>
      </div>
      {/* <div className="hidden sm:flex flex-row items-center border-[1px] border-p-btn p-1 rounded-[50px] bg-s-text w-[200px] md:w-[300px] lg:w-[400px] xl:w-[450px] 2xl:w-[600px]  gap-2 md:gap-4">
          <div className="bg-p-btn rounded-[22px] py-1 px-2 md:px-3 ">
            <AiOutlineSearch className="w-[23px] h-[23px] text-s-text" />
          </div>
          <input
            className="bg-transparent mr-1 text-[14px] text-[#111] outline-none w-full"
            type="text"
            placeholder="Search Diverse"
          />
        </div> */}
      <SearchModal />
      <div>
        <button
          className="justify-end bg-p-btn text-s-text px-4 py-2 rounded-[50px] text-[14px] font-bold"
          onClick={openConnectModal}
        >
          Connect Wallet
        </button>
      </div>
    </div>
  )
}

export default Navbar
