import React from 'react'

const ProfileNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full mt-10">
      <div className="text-2xl font-bold">No Profile Found</div>
      <div className="text-sm text-gray-500">
        This user has not created a profile yet.
      </div>
    </div>
  )
}

export default ProfileNotFound
