import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { usePublicationQuery } from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
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
            <LensPostCard post={postInfo} />
          </div>
        )}
        <CombinedCommentSection postId={id} postInfo={postInfo} />
      </div>
      {router.pathname.startsWith('/p/') && !isMobile && (
        <div className="flex flex-col sticky top-[64px] h-[calc(100vh-64px)] rounded-[15px] w-[300px] ml-4 mt-3">
          <img src="/diverseBanner.png" className="h-[80px]" />
          <div className="rounded-b-[15px] bg-s-bg pt-2 pb-3 px-3">
            <div className="flex flex-row gap-2 justify-start">
              <div className="flex items-center justify-center rounded-full bg-[#000] w-[60px] h-[60px] xl:w-[70px] xl:h-[70px] -translate-y-6">
                <img
                  src="/LogoV3TrimmedWithBG.png"
                  className="w-[25px] h-[25px] sm:w-[35px] sm:h-[35px]"
                  alt="DivrseHQ Logo"
                />
              </div>
              <h2 className="font-semibold text-[18px] text-p-text">
                DiverseHQ
              </h2>
            </div>
            <p className="mb-2 -translate-y-4 text-p-text">
              Monetization and content reach is not just for famous few.
            </p>
            {/* <button
                    className="flex flex-row items-center justify-center w-full rounded-[10px] text-[16px] font-semibold text-m-btn-hover-text bg-m-btn-hover-bg py-2 px-2 mb-3"
                    onClick={createPost}
                  >
                    Create Post
                  </button>
                  <button
                    className="flex flex-row items-center justify-center w-full px-2 py-2 rounded-[10px] border-[1px] border-p-btn dark:border-p-text bg-m-btn-bg text-m-btn-text hover:bg-m-btn-hover-bg hover:text-m-btn-hover-text text-[16px] font-semibold transition-all duration-400"
                    onClick={createCommunity}
                  >
                    Create Community
                  </button> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default LensPostPage
