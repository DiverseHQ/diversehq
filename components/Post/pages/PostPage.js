import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { getCommunityInfo } from '../../../api/community'
import CombinedCommentSectionApiNew from '../../Comment/CombinedCommentSectionApiNew'
import CombinedCommentSectionApiTop from '../../Comment/CombinedCommentSectionApiTop'
import CommentFilterNav from '../../Comment/CommentFilterNav'
import ImageWithFullScreenZoom from '../../Common/UI/ImageWithFullScreenZoom'
import MobileLoader from '../../Common/UI/MobileLoader'
import useDevice from '../../Common/useDevice'
import PostCard from '../PostCard'

const PostPage = ({ post }) => {
  const [active, setActive] = useState('top')
  const { isMobile } = useDevice()
  const router = useRouter()
  const [communityInfo, setCommunityInfo] = useState({})

  const fetchCommunityInfo = async () => {
    try {
      const res = await getCommunityInfo(post.communityName)
      if (res.status !== 200) {
        return
      }
      const result = await res.json()
      setCommunityInfo(result)
    } catch (error) {
      console.log(error)
    }
  }

  console.log('community info', communityInfo)

  useEffect(() => {
    fetchCommunityInfo()
  }, [post])

  return (
    <>
      <div className="w-full flex justify-center pb-[50px]">
        <div
          className={`${
            router.pathname.startsWith('/p')
              ? 'w-full md:w-[50%] md:min-w-[650px]'
              : 'w-full md:w-[650px]'
          }`}
        >
          {!post &&
            (isMobile ? (
              <MobileLoader />
            ) : (
              <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-gray-100 animate-pulse my-3 sm:my-6">
                <div className="w-full flex flex-row items-center space-x-4 p-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 rounded-full animate-pulse" />
                  <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                  <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
                  <div className="w-6 sm:w-[50px] h-4 " />
                  <div className="w-full mr-4 rounded-2xl bg-gray-300 h-[200px] sm:h-[300px]" />
                </div>
              </div>
            ))}
          {post && (
            <div>
              <PostCard _post={post} />
              <CommentFilterNav active={active} setActive={setActive} />
              {active === 'top' && (
                <CombinedCommentSectionApiTop
                  postId={post._id}
                  authorAddress={post.authorAddress}
                />
              )}
              {active === 'new' && (
                <CombinedCommentSectionApiNew
                  postId={post._id}
                  authorAddress={post.authorAddress}
                />
              )}
            </div>
          )}
        </div>
        {router.pathname.startsWith('/p/') && !isMobile && (
          <div className="flex flex-col sticky top-[64px] h-[calc(100vh-64px)] rounded-[15px] w-[300px] ml-4 mt-3">
            <ImageWithFullScreenZoom
              src={
                communityInfo.bannerImageUrl
                  ? communityInfo?.bannerImageUrl
                  : '/gradient.jpg'
              }
              className="h-[80px] rounded-t-[15px] w-full"
            />
            <div className="rounded-b-[15px] bg-s-bg pt-2 pb-3 px-3">
              <div className="flex flex-row gap-2 justify-start">
                <div className="flex items-center justify-center rounded-full bg-[#000] w-[50px] h-[50px] xl:w-[60px] xl:h-[60px] -translate-y-6">
                  <ImageWithFullScreenZoom
                    src={
                      communityInfo?.logoImageUrl
                        ? communityInfo?.logoImageUrl
                        : '/gradient.jpg'
                    }
                    className="rounded-full w-[50px] h-[50px] xl:w-[60px] xl:h-[60px] object-cover"
                  />
                </div>
                <div
                  onClick={() => {
                    if (post?.name) router.push(`/c/${post.name}`)
                  }}
                >
                  <h2 className="font-bold text-p-text text-[20px] hover:underline cursor-pointer truncate">
                    {communityInfo?.name}
                  </h2>
                </div>
              </div>
              <p className="mb-2 -translate-y-4 text-p-text">
                {communityInfo?.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default PostPage
