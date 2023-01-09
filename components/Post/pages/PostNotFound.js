import React from 'react'

const PostNotFound = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full md:w-[650px]">
        <div className="flex items-center justify-center w-full bg-s-bg p-3 my-6 sm:rounded-3xl shadow-lg text-bold text-2xl">
          <h2>Post was deleted or does not exist</h2>
        </div>
      </div>
    </div>
  )
}

export default PostNotFound
