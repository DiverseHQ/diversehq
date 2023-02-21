import { Tooltip } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { useNotify } from '../Common/NotifyContext'

interface item {
  title: string
  link: string
  icon: React.ReactNode
  isHidden?: boolean
  disabled?: boolean
  discription?: string
}

const MobileSidebar = ({ items }: { items: item[] }) => {
  const { notifyInfo }: any = useNotify()
  return (
    <div className="text-p-text text-xl w-full space-y-2 px-2 py-4">
      {items.map((item: item) => {
        if (item.isHidden) return null
        if (item.disabled) {
          return (
            <Tooltip title="Coming soon" key={item.title}>
              <div
                className="flex flex-row  items-center justify-between px-4 py-3 rounded-[15px] gap-1 md:gap-2"
                key={item.title}
                onClick={() => notifyInfo('Coming soon')}
              >
                <div className="flex flex-row space-x-3 items-center justify-between">
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </div>
                <MdKeyboardArrowRight className="w-8 h-8" />
              </div>
            </Tooltip>
          )
        }
        return (
          <Link
            className={`flex flex-row items-center justify-between active:bg-p-btn-hover px-4 py-3 rounded-[15px] gap-1 md:gap-2`}
            href={item.link}
            key={item.title}
          >
            <div className="flex flex-row space-x-3 items-center">
              {item.icon}
              <span className="font-medium">{item.title}</span>
            </div>
            <MdKeyboardArrowRight className="w-8 h-8" />
          </Link>
        )
      })}
    </div>
  )
}

export default MobileSidebar
