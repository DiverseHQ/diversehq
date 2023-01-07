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

// export async function getServerSideProps({ params = {}}) {
//   const {id} = params
//   let post = {}

//   if (id?.includes('-')) {
//     try {
//       const res = await
//     } catch (error) {
//       console.log(error)
//     }
//   } else {
//     try {
//       const res = await fetch(`https://api.lensapp.co/posts/${id}`)
//       post = await res.json()
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   return {
//     props: {
//       id,
//       post
//   }
// }

// export async function getStaticPaths() {

//   return {
//     paths: [],
//     fallback: 'blocking',
//   }
// }

export default Page
