import { useRouter } from 'next/router'
import React from 'react'
import { BiArrowBack } from 'react-icons/bi'

interface Props {
  title: string
  subtitle?: string
}

const MobileTopNavbarWithTitle = ({ title, subtitle }: Props) => {
  const router = useRouter()
  return (
    <>
      <div className="flex flex-row justify-between px-3 py-1 items-center shadow-sm sticky top-0 w-full z-30 min-h-[50px] bg-s-bg">
        <div className="h-[32px] flex flex-row items-center gap-3 text-[18px]">
          <div className="flex items-center justify-center w-8 h-8 hover:bg-p-btn-hover rounded-full">
            <BiArrowBack
              onClick={() => router.back()}
              className="w-6 h-6 rounded-full cursor-pointer"
            />
          </div>
          <div className="flex flex-col leading-5">
            <div className="font-medium sm:font-bold text-xl sm:text-2xl">
              {title}
            </div>
            {subtitle && (
              <div className="text-[14px] text-s-text">{subtitle}</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileTopNavbarWithTitle
