// import { useRouter } from 'next/router'
import React from 'react'
import { getSinglePostInfo } from '../../api/post'
import useDevice from '../../components/Common/useDevice'
import LensPostPage from '../../components/Post/pages/LensPostPage'
import PostNotFound from '../../components/Post/pages/PostNotFound'
import PostPage from '../../components/Post/pages/PostPage'
import LensPostSeo from '../../components/Post/PostSeos/LensPostSeo'
import OffChainPostSeo from '../../components/Post/PostSeos/OffChainPostSeo'
import PostNotFoundSeo from '../../components/Post/PostSeos/PostNotFoundSeo'
import getSinglePublicationInfo from '../../lib/post/get-single-publication-info'
import PostPageMobileTopNav from '../../components/Post/PostPageMobileTopNav'
import { getCommunityInfoUsingId } from '../../api/community'
import { getCommunityInfoFromAppId } from '../../utils/helper'
import { postWithCommunityInfoType } from '../../types/post'
// types are post, lens, notFound
// post is a offchain post
// lens is a onchain lens post
// notFound is a 404 page
interface Props {
  type: string
  post?: postWithCommunityInfoType
  id: string
}
const Page = ({ type, post, id }: Props) => {
  const { isMobile } = useDevice()
  return (
    <>
      {type === 'post' && <OffChainPostSeo post={post} />}
      {type === 'lens' && <LensPostSeo post={post} />}
      {type === 'notFound' && <PostNotFoundSeo />}
      <>
        {isMobile && <PostPageMobileTopNav />}
        {type === 'lens' && <LensPostPage id={id} post={post} />}
        {type === 'post' && <PostPage post={post} />}
        {type === 'notFound' && <PostNotFound />}
      </>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { id } = params

  interface ReutrnProps {
    newId: string
    type: string
    post?: postWithCommunityInfoType
  }

  const getPost = async (id: string): Promise<ReutrnProps> => {
    if (id?.includes('-')) {
      try {
        const response = await getSinglePublicationInfo(id)

        if (response?.publication) {
          let newId = id
          // @ts-ignore
          let post: postWithCommunityInfoType
          if (response?.publication?.__typename === 'Post') {
            // @ts-ignore
            post = response.publication
          } else if (response?.publication?.__typename === 'Mirror') {
            newId = response.publication.mirrorOf.id
            // @ts-ignore
            post = response.publication.mirrorOf
            // @ts-ignore
            post.mirroredBy = response.publication.profile
          }

          const communityId = post?.metadata?.tags?.[0]
          if (!communityId) {
            post.communityInfo = getCommunityInfoFromAppId(post?.appId)
            return { newId: newId, type: 'lens', post }
          }
          const communityInfo = await getCommunityInfoUsingId(communityId)
          if (communityInfo?.handle) {
            post.communityInfo = communityInfo
            post.isLensCommunityPost = true
            return { newId: newId, type: 'lens', post }
          } else if (communityInfo?._id) {
            post.communityInfo = communityInfo
            return { newId: newId, type: 'lens', post }
          } else {
            post.communityInfo = getCommunityInfoFromAppId(post?.appId)
            return { newId: newId, type: 'lens', post }
          }
        }
      } catch (error) {
        console.log(error)
        return { newId: id, type: 'notFound', post: null }
      }
    } else {
      try {
        const res = await getSinglePostInfo(id)
        if (res.status !== 200) {
          return { newId, type: 'notFound', post: null }
        }
        const post = await res.json()
        return { newId, type: 'post', post }
      } catch (error) {
        console.log(error)
        return { newId, type: 'notFound', post: null }
      }
    }
    return { newId: id, type: 'notFound', post: null }
  }
  const { newId, type, post } = await getPost(id)
  return {
    props: {
      type,
      post,
      id: newId
    }
  }
}

export default Page
