// import { useRouter } from 'next/router'
import React from 'react'
import { getSinglePostInfo } from '../../api/post'
import LensPostPage from '../../components/Post/pages/LensPostPage'
import PostNotFound from '../../components/Post/pages/PostNotFound'
import PostPage from '../../components/Post/pages/PostPage'
import LensPostSeo from '../../components/Post/PostSeos/LensPostSeo'
import OffChainPostSeo from '../../components/Post/PostSeos/OffChainPostSeo'
import PostNotFoundSeo from '../../components/Post/PostSeos/PostNotFoundSeo'
import getSinglePublicationInfo from '../../lib/post/get-single-publication-info'

// types are post, lens, notFound
// post is a offchain post
// lens is a onchain lens post
// notFound is a 404 page
const Page = ({ type, post, id }) => {
  return (
    <>
      {type === 'lens' && <LensPostSeo post={post} />}
      {type === 'post' && <OffChainPostSeo post={post} />}
      {type === 'notFound' && <PostNotFoundSeo />}
      {type === 'lens' && <LensPostPage id={id} post={post} />}
      {type === 'post' && <PostPage id={id} post={post} />}
      {type === 'notFound' && <PostNotFound />}
    </>
  )
}

export async function getServerSideProps({ params = {} }) {
  const { id } = params

  const getPost = async (id) => {
    if (id?.includes('-')) {
      try {
        const response = await getSinglePublicationInfo(id)
        if (response?.publication) {
          return { type: 'lens', post: response.publication }
        }
      } catch (error) {
        console.log(error)
        return { type: 'notFound', post: null }
      }
    } else {
      try {
        const res = await getSinglePostInfo(id)
        if (res.status !== 200) {
          return { type: 'notFound', post: null }
        }
        const post = await res.json()
        return { type: 'post', post }
      } catch (error) {
        console.log(error)
        return { type: 'notFound', post: null }
      }
    }
    return { type: 'notFound', post: null }
  }
  const { type, post } = await getPost(id)
  return {
    props: {
      type,
      post,
      id
    }
  }
}

export default Page
