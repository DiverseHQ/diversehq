import Image from 'next/image'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { BiArrowBack } from 'react-icons/bi'
import { usePopUpModal } from './CustomPopUpProvider'
import useDevice from './useDevice'

const PopUpWrapper = ({
  title,
  onClick,
  label,
  loading,
  children,
  isDisabled
}) => {
  const { hideModal } = usePopUpModal()
  const { isDesktop } = useDevice()
  return (
    <div className="bg-p-bg sm:rounded-3xl py-4 w-screen h-screen sm:w-[550px] sm:h-full sm:max-h-[calc(100vh-50px)] overflow-y-auto overflow-x-hidden text-p-text z-40">
      <div className="flex flex-row justify-between items-center pb-4 px-4">
        <div className="flex flex-row justify-center items-center">
          <div className="w-8 h-8 text-p-text hover:text-s-bg hover:bg-p-hover flex justify-center items-center rounded-full">
            {isDesktop && (
              <AiOutlineClose
                className="w-5 h-5  items-center cursor-pointer"
                onClick={() => hideModal()}
              />
            )}
            {!isDesktop && (
              <BiArrowBack
                className="w-6 h-6 items-center cursor-pointer"
                onClick={() => hideModal()}
              />
            )}
          </div>
          <div className="text-p-text ml-4 text-xl">{title}</div>
        </div>
        {onClick && (
          <>
            {!loading ? (
              <button
                className={`text-p-btn-text ${
                  isDisabled ? 'bg-p-btn-disabled' : 'bg-p-btn'
                } px-3 py-1 font-bold uppercase rounded-full text-base text-p-btn-text`}
                type="button"
                onClick={onClick}
                disabled={loading || isDisabled}
              >
                {label}
              </button>
            ) : (
              <Image src="/loading.svg" alt="loading" width={30} height={30} />
            )}
          </>
        )}
      </div>
      {children}
    </div>
  )
}

export default PopUpWrapper
