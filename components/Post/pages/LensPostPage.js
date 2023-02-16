import { Link } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { getCommunityInfoUsingId } from '../../../api/community'
import { usePublicationQuery } from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import ImageWithFullScreenZoom from '../../Common/UI/ImageWithFullScreenZoom'
import MobileLoader from '../../Common/UI/MobileLoader'
import useDevice from '../../Common/useDevice'
import CombinedCommentSection from '../LensComments/CombinedCommentSection'
import LensPostCard from '../LensPostCard'

const LensPostPage = ({ id, post }) => {
  const [postInfo, setPostInfo] = useState(post)
  // const [notFound, setNotFound] = useState(false)
  const { isMobile } = useDevice()
  const { data: lensProfile } = useLensUserContext()
  const { data } = usePublicationQuery(
    {
      request: {
        publicationId: id
      },
      reactionRequest: {
        profileId: lensProfile?.defaultProfile?.id
      }
    },
    {
      enabled: !!id && !!lensProfile?.defaultProfile?.id
    }
  )

  useEffect(() => {
    if (!data?.publication) return
    setPostInfo(data.publication)
  }, [data])

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const fetchCommunityInformationAndSetPost = async () => {
    try {
      const communityId = postInfo?.metadata?.tags?.[0]
      if (!communityId) return
      setLoading(true)
      const communityInfo = await getCommunityInfoUsingId(communityId)
      setPostInfo({ ...postInfo, communityInfo })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!postInfo) return
    if (!postInfo?.communityInfo) {
      fetchCommunityInformationAndSetPost()
    }
  }, [postInfo])

  return (
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

        {/* lens post card */}
        {postInfo && (
          <div className="flex flex-row">
            <LensPostCard post={postInfo} loading={loading} />
          </div>
        )}
        <CombinedCommentSection postId={id} postInfo={postInfo} />
      </div>
      {router.pathname.startsWith('/p/') && !isMobile && (
        <div className="flex flex-col sticky top-[64px] h-[calc(100vh-64px)] rounded-[15px] w-[300px] ml-4 mt-3">
          <ImageWithFullScreenZoom
            src={postInfo?.communityInfo?.bannerImageUrl}
            className="h-[80px] rounded-t-[15px] w-full"
          />
          <div className="rounded-b-[15px] bg-s-bg pt-2 pb-3 px-3">
            <div className="flex flex-row gap-2 justify-start">
              <div className="flex items-center justify-center rounded-full bg-[#000] w-[50px] h-[50px] xl:w-[60px] xl:h-[60px] -translate-y-6">
                {loading ? (
                  <div className="animate-pulse rounded-full bg-p-bg lg:w-[40px] lg:h-[40px] h-[30px] w-[30px]" />
                ) : (
                  <ImageWithFullScreenZoom
                    src={
                      postInfo?.communityInfo?.logoImageUrl
                        ? postInfo?.communityInfo?.logoImageUrl
                        : '/gradient.jpg'
                    }
                    className="rounded-full w-[50px] h-[50px] xl:w-[60px] xl:h-[60px] object-cover"
                  />
                )}
              </div>
              <div
                onClick={() => {
                  if (postInfo?.communityInfo?.name)
                    router.push(`/c/${postInfo?.communityInfo?.name}`)
                }}
              >
                {loading ? (
                  <div className="animate-pulse rounded-full bg-p-bg w-32 h-4 ml-4" />
                ) : (
                  <h2 className="font-bold text-p-text text-[20px]  hover:underline cursor-pointer truncate">
                    {postInfo?.communityInfo?.name}
                  </h2>
                )}
              </div>
            </div>
            <p className="mb-2 -translate-y-4 text-p-text">
              {postInfo?.communityInfo?.description}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default LensPostPage
