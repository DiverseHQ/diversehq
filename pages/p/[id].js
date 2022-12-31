import { useRouter } from 'next/router'
import React from 'react'
import LensPostPage from '../../components/Post/pages/LensPostPage'
import PostPage from '../../components/Post/pages/PostPage'

const Page = () => {
  const { id } = useRouter().query

  return (
    <>{id?.includes('-') ? <LensPostPage id={id} /> : <PostPage id={id} />}</>
  )
}

export default Page
