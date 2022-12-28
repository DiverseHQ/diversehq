import React from 'react'
import { useEffect } from 'react'
import LensPostsColumn from '../../components/Post/LensPostsColumn'
import NavFilterAllPosts from '../../components/Post/NavFilterAllPosts'
import { useLensUserContext } from '../../lib/LensUserContext'

const lens = () => {
  const { data: lensProfile } = useLensUserContext()

  useEffect(() => {
    console.log('lensProfile', lensProfile)
  }, [lensProfile])
  return (
    <>
      <NavFilterAllPosts />
      {lensProfile?.defaultProfile?.id ? (
        <LensPostsColumn source="all" data={lensProfile.defaultProfile.id} />
      ) : (
        <LensPostsColumn source="all" data={null} />
      )}
    </>
  )
}

export default lens
