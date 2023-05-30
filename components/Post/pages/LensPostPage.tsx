import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { usePublicationQuery } from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import MobileLoader from '../../Common/UI/MobileLoader'
import CombinedCommentSection from '../LensComments/CombinedCommentSection'
import LensPostCard from '../LensPostCard'
import { IoMdClose } from 'react-icons/io'
import LensPageProfileCard from '../Cards/LensPageProfileCard'
import { postWithCommunityInfoType } from '../../../types/post'
import LensPostPageCommunityCard from '../Cards/LensPostPageCommunityCard'
import PostPageMentionsColumn, {
  getAllMentionsHandlFromContent
} from '../PostPageMentionsColumn'
import { useDevice } from '../../Common/DeviceWrapper'
import { useCommonStore } from '../../../store/common'

interface Props {
  id: string
  post?: postWithCommunityInfoType
}

const LensPostPage = ({ id, post }: Props) => {
  const [postInfo, setPostInfo] = useState<postWithCommunityInfoType>(post)
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
      },
      profileId: lensProfile?.defaultProfile?.id
    },
    {
      enabled: !!id && !!lensProfile?.defaultProfile?.id
    }
  )

  const numberOfRoutesChanged = useCommonStore(
    (state) => state.numberOfRoutesChanged
  )

  useEffect(() => {
    if (!data?.publication) return
    // @ts-ignore
    setPostInfo({ ...postInfo, ...post, ...data.publication })
  }, [data, post])

  const router = useRouter()

  const onBackClick = () => {
    if (!numberOfRoutesChanged) {
      // If no referrer is available, replace the current URL with the home page URL
      router.push('/')
    } else {
      // Go back to the previous page
      router.back()
    }
  }

  return (
    <>
      <div className="w-full flex flex-row space-x-12 justify-center pb-[100px]">
        <div className={`w-full md:w-[650px]`}>
          {!post &&
            (isMobile ? (
              <MobileLoader />
            ) : (
              <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-s-bg dark:bg-s-bg my-3 sm:my-6">
                <div className="w-full flex flex-row items-center space-x-4 p-2 px-4 animate-pulse">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 dark:bg-p-bg rounded-full " />
                  <div className="h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300 dark:bg-p-bg" />
                  <div className="h-4 w-[50px] rounded-full bg-gray-300 dark:bg-p-bg" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 sm:p-4 sm:py-2 py-1 pr-4 my-1 animate-pulse">
                  <div className="w-6 sm:w-[50px] h-4" />
                  <div className="w-full rounded-xl bg-gray-300 dark:bg-p-bg h-[20px] sm:h-[20px]" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 sm:p-4 sm:pb-2 pr-4 animate-pulse">
                  <div className="w-6 sm:w-[50px] h-4" />
                  <div className="w-full rounded-2xl bg-gray-300 dark:bg-p-bg h-[200px] sm:h-[300px]" />
                </div>
              </div>
            ))}
          {/* lens post card */}
          {postInfo && <LensPostCard post={postInfo} />}
          <CombinedCommentSection postId={id} postInfo={postInfo} />
        </div>
        {router.pathname.startsWith('/p/') && !isMobile && (
          <>
            <div className="flex flex-col sticky top-[64px] mb-20">
              <div className="flex flex-row items-center ml-4 mt-3 justify-end">
                <div
                  className="flex hover:bg-s-hover text-s-text hover:text-p-text rounded-full px-3 py-1 cursor-pointer items-center gap-2"
                  onClick={onBackClick}
                >
                  <span className="text-[18px]">Close</span>
                  <IoMdClose className="w-5 h-5 " />
                </div>
              </div>
              {postInfo?.communityInfo?._id && (
                <>
                  <div className="px-5 font-medium">Community</div>
                  {postInfo?.isLensCommunityPost ? (
                    <LensPageProfileCard
                      isLensCommunity={!!postInfo?.isLensCommunityPost}
                      _profile={postInfo?.profile}
                      verified={postInfo?.communityInfo?.verified}
                    />
                  ) : (
                    <LensPostPageCommunityCard
                      communityInfo={postInfo?.communityInfo}
                    />
                  )}
                </>
              )}
              <div className="px-5 mt-6 font-medium">Related Profiles</div>
              {postInfo?.isLensCommunityPost ? (
                <LensPageProfileCard
                  profileHandle={
                    getAllMentionsHandlFromContent(
                      postInfo?.metadata?.content
                    )[0]
                  }
                />
              ) : (
                <LensPageProfileCard _profile={postInfo?.profile} />
              )}

              <PostPageMentionsColumn
                isLensCommunityPost={postInfo?.isLensCommunityPost}
                content={postInfo?.metadata?.content}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default LensPostPage
