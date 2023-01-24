import Image from 'next/image'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { IoIosArrowRoundBack } from 'react-icons/io'
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
    <div className="bg-p-bg sm:rounded-3xl py-4 w-screen h-screen sm:w-[550px] sm:h-full sm:max-h-[calc(100vh-50px)] overflow-y-auto overflow-x-hidden ">
      <div className="flex flex-row justify-between items-center pb-4 px-4">
        <div className="flex flex-row justify-center items-center">
          {isDesktop && (
            <AiOutlineClose
              className="text-s-text w-5 h-5  hover:text-p-text  items-center cursor-pointer"
              onClick={() => hideModal()}
            />
          )}
          {!isDesktop && (
            <IoIosArrowRoundBack
              className="text-s-text w-7 h-7  hover:text-p-text  items-center cursor-pointer"
              onClick={() => hideModal()}
            />
          )}

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
