import React from 'react'

const _offline = () => {
  const msg = 'You are offline buddy, world is waiting for you to come back :)'
  return (
    <div className="h-screen w-full flex justify-center items-center text-center">
      {msg}
    </div>
  )
}

export default _offline
