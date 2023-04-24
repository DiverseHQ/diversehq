// import { useRouter } from 'next/router'
import React, { useState } from 'react'
import LensPostPage from '../../components/Post/pages/LensPostPage'
import LensPostSeo from '../../components/Post/PostSeos/LensPostSeo'
import PostPageMobileTopNav from '../../components/Post/PostPageMobileTopNav'
import { postWithCommunityInfoType } from '../../types/post'
import getPostWithCommunityInfo from '../../lib/post/getPostWithCommunityInfo'
import { usePublicationStore } from '../../store/publication'
import { GetServerSidePropsContext } from 'next'
import { useProfileStore } from '../../store/profile'
import MobileLoader from '../../components/Common/UI/MobileLoader'
import PostNotFound from '../../components/Post/pages/PostNotFound'
import { useDevice } from '../../components/Common/DeviceWrapper'
// types are post, lens, notFound
// post is a offchain post
// lens is a onchain lens post
// notFound is a 404 page

const Page = ({
  _post,
  postId
}: {
  _post: postWithCommunityInfoType | null
  postId: string
}) => {
  const { isMobile } = useDevice()
  const [post, setPost] = useState<postWithCommunityInfoType | null>(_post)
  const publications = usePublicationStore((state) => state.publications)
  const addPublication = usePublicationStore((state) => state.addPublication)
  const addProfile = useProfileStore((state) => state.addProfile)
  const [loading, setLoading] = useState(true)

  const fetchAndSetPublication = async () => {
    try {
      const publicationRes = await getPostWithCommunityInfo({
        publicationId: postId
      })
      setPost(publicationRes)
      addPublication(publicationRes.id, publicationRes)
      addProfile(publicationRes.profile.handle, publicationRes.profile)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (!postId || _post) return
    if (publications.get(postId) && publications) {
      setPost(publications.get(postId))
      setLoading(false)
    } else {
      fetchAndSetPublication()
    }
  }, [publications, postId])

  return (
    <>
      {/* {type === 'post' && <OffChainPostSeo post={post} />} */}
      {post && <LensPostSeo post={post} />}
      {/* {type === 'notFound' && <PostNotFoundSeo />} */}
      {isMobile && <PostPageMobileTopNav />}
      {post && !loading && <LensPostPage id={postId} post={post} />}
      {!post && !loading && <PostNotFound />}
      {loading && <MobileLoader />}
      {/* {type === 'post' && <PostPage post={post} />} */}
      {/* {type === 'notFound' && <PostNotFound />} */}
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, params } = context
  const { id } = params

  const isClient = Boolean(req?.cookies?.isClient)

  if (isClient) {
    return {
      props: {
        _post: null,
        postId: id
      }
    }
  }

  const _post = await getPostWithCommunityInfo({
    publicationId: id
  })
  return {
    props: {
      _post: _post,
      id: id
    }
  }
}

export default Page
