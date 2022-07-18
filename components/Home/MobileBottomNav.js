import Image from 'next/image'
import React from 'react'

const MobileBottomNav = () => {
  return (
    <div className="fixed bottom-0 w-full py-2.5 flex flex-row justify-evenly bg-p-bg">
        <Image src='/home.svg' width={25} height={25} />
        <Image src='/explore.svg' width={25} height={25} />
        <Image src='/add.svg' width={35} height={35} />
        <Image src='/search.svg' width={25} height={25} />
        <Image src='/bell.svg' width={25} height={25} />
    </div>
  )
}

export default MobileBottomNav
