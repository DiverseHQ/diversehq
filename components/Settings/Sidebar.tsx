import { Tooltip } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useNotify } from '../Common/NotifyContext'

interface item {
  title: string
  link: string
  icon: React.ReactNode
  isHidden?: boolean
  disabled?: boolean
}

const Sidebar = ({ items }: { items: item[] }) => {
  const { asPath } = useRouter()
  const { notifyInfo }: any = useNotify()
  return (
    <div className="text-p-text bg-s-bg w-full rounded-[15px] border-[1px] border-s-border space-y-2 p-2">
      {items.map((item: item) => {
        if (item.isHidden) return null
        if (item.disabled) {
          return (
            <Tooltip
              title="Coming soon"
              placement="left"
              arrow
              key={item.title}
            >
              <div
                className="flex cursor-pointer flex-row items-center px-4 py-3 rounded-[15px] gap-1 md:gap-2"
                key={item.title}
                onClick={() => notifyInfo('Coming soon')}
              >
                {item.icon}
                <span className="text-[16px] font-medium">{item.title}</span>
              </div>
            </Tooltip>
          )
        }

        return (
          <Link href={item.link} key={item.title}>
            <div
              className={`flex cursor-pointer flex-row items-center ${
                asPath === item.link ? 'bg-s-hover' : ''
              }  hover:bg-s-hover px-4 py-3 rounded-[15px] gap-1 md:gap-2`}
            >
              {item.icon}
              <span className="text-[16px] font-medium">{item.title}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default Sidebar
