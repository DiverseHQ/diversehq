import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AiOutlineFileAdd } from 'react-icons/ai'
import { getCommunityInfoUsingId } from '../../../api/community'
import { getUserInfo } from '../../../api/user'
import { usePublicationQuery } from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import getLensProfileInfo from '../../../lib/profile/get-profile-info'
import ImageWithFullScreenZoom from '../../Common/UI/ImageWithFullScreenZoom'
import MobileLoader from '../../Common/UI/MobileLoader'
import useDevice from '../../Common/useDevice'
import JoinCommunityButton from '../../Community/JoinCommunityButton'
import CombinedCommentSection from '../LensComments/CombinedCommentSection'
import LensPostCard from '../LensPostCard'
import { IoMdClose } from 'react-icons/io'
import useLensFollowButton from '../../User/useLensFollowButton'
import { xpPerMember } from '../../../utils/config'
import { getLevelAndThresholdXP } from '../../../lib/helpers'

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
  const [userLensProfile, setUserLensProfile] = useState({})
  const [profile, setProfile] = useState({})
  const { FollowButton } = useLensFollowButton({
    profileId: userLensProfile?.id
  })

  const { currentXP, level, thresholdXP } = getLevelAndThresholdXP(
    postInfo?.communityInfo?.members.length * xpPerMember || 0
  )

  useEffect(() => {
    if (!data?.publication) return
    setPostInfo(data.publication)
  }, [data])

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // fetches the communityInfo and sets the feild in the postInfo object
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

  const calculateBarPercentage = (currentXP, threshold) => {
    const percentage = Math.round((threshold * 100) / currentXP)
    return percentage
  }

  // fetch the new communityInfo every time post changes
  useEffect(() => {
    if (!postInfo) return
    if (!postInfo?.communityInfo) {
      fetchCommunityInformationAndSetPost()
    }
    if (postInfo?.profile?.handle) {
      getUserProfileAndLensProfile(postInfo?.profile?.handle)
    }
  }, [postInfo])

  const getUserProfileAndLensProfile = async (id) => {
    try {
      const lensProfileRes = await getLensProfileInfo({
        handle: id
      })
      if (lensProfileRes.profile) {
        setUserLensProfile(lensProfileRes.profile)
      }
      if (lensProfileRes.profile.ownedBy) {
        const userInfo = await getUserInfo(lensProfileRes.profile.ownedBy)
        if (userInfo) {
          setProfile(userInfo)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="w-full flex flex-row space-x-10 justify-center pb-[50px]">
        <div
          className={`${
            router.pathname.startsWith('/p')
              ? 'w-full md:w-[700px]'
              : 'w-full md:w-[650px]'
          }`}
        >
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
          {postInfo && <LensPostCard post={postInfo} loading={loading} />}
          <CombinedCommentSection postId={id} postInfo={postInfo} />
        </div>
        {router.pathname.startsWith('/p/') && !isMobile && (
          <div className="flex flex-col sticky top-[64px] h-[calc(100vh-64px)] overflow-scroll no-scrollbar">
            <div className="flex flex-row items-center ml-4 mt-3 justify-end">
              <div
                className="flex hover:bg-p-btn-hover rounded-md p-1 cursor-pointer items-center gap-2"
                onClick={() => router.back()}
              >
                <IoMdClose className="w-6 h-6" />
                <span className="text-[18px]">Close</span>
              </div>
            </div>
            <div className="flex flex-col rounded-[15px] w-[250px] lg:w-[300px] ml-4 mt-3">
              <ImageWithFullScreenZoom
                src={postInfo?.communityInfo?.bannerImageUrl}
                className="h-[80px] rounded-t-[15px] w-full object-cover"
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
                <div className="-translate-y-2 mb-2">
                  <div className="flex flex-row gap-1 items-center w-[80%] mb-1">
                    <div className="text-[12px] md:text-[14px] items-center">
                      {`Lvl${level}`}
                    </div>
                    <div className="flex flex-col w-full items-end">
                      <div className="text-[10px] text-[#bbb]">{`${currentXP}/${thresholdXP}`}</div>
                      <div className="relative bg-[#AA96E2] rounded-full h-2.5 w-full">
                        <div
                          className="absolute h-full bg-[#6668FF] rounded-full transition-all duration-500 ease-in-out"
                          style={{
                            width: `${calculateBarPercentage(
                              thresholdXP,
                              currentXP
                            )}%`,
                            maxWidth: '100%'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  {/* createdat */}
                  <div className="flex flex-row gap-0.5 items-center text-xs md:text-[14px] text-[#aaa]">
                    <AiOutlineFileAdd />
                    <span>
                      Created{' '}
                      {new Date(postInfo?.communityInfo?.createdAt)
                        .toDateString()
                        .split(' ')
                        .slice(1)
                        .join(' ')}
                    </span>
                  </div>
                </div>
                <p className="mb-2 text-p-text">
                  {postInfo?.communityInfo?.description}
                </p>
                <div className="mb-2 text-p-text">
                  <span>Members: </span>
                  <span className="font-semibold">
                    {postInfo?.communityInfo?.members?.length}
                  </span>
                </div>
                <JoinCommunityButton
                  id={postInfo?.communityInfo?._id}
                  showJoined
                />
              </div>
            </div>
            <div className="flex flex-col rounded-[15px] w-[250px] lg:w-[300px] ml-4 mt-3">
              <ImageWithFullScreenZoom
                src={profile?.bannerImageUrl}
                className="h-[80px] rounded-t-[15px] w-full object-cover"
              />
              <div className="rounded-b-[15px] bg-s-bg pt-2 pb-3 px-3">
                <div className="flex flex-row gap-2 justify-start">
                  <div className="flex items-center justify-center rounded-full bg-[#000] w-[50px] h-[50px] xl:w-[60px] xl:h-[60px] -translate-y-6">
                    <ImageWithFullScreenZoom
                      src={
                        profile?.profileImageUrl
                          ? profile?.profileImageUrl
                          : '/gradient.jpg'
                      }
                      className="rounded-full w-[50px] h-[50px] xl:w-[60px] xl:h-[60px] object-cover"
                    />
                  </div>
                  <div>
                    <h2
                      className="font-bold text-p-text text-[16px]  hover:underline cursor-pointer truncate"
                      onClick={() => {
                        if (profile?.walletAddress)
                          router.push(`/u/${profile?.walletAddress}`)
                      }}
                    >
                      {profile?.name}
                    </h2>
                    <h2
                      className="font-bold text-p-text text-[16px]  hover:underline cursor-pointer truncate mb-3"
                      onClick={() => {
                        if (postInfo?.profile?.handle)
                          router.push(`/u/${postInfo?.profile?.handle}`)
                      }}
                    >
                      {postInfo?.profile?.handle}
                    </h2>
                  </div>
                </div>
                <p className="-translate-y-2 text-p-text">{profile?.bio}</p>
                <div className="mb-2 text-p-text flex flex-row gap-2">
                  <span>
                    Followers:{' '}
                    <span className="font-semibold">
                      {userLensProfile?.stats?.totalFollowers}
                    </span>
                  </span>
                  <span>
                    Following:{' '}
                    <span className="font-semibold">
                      {userLensProfile?.stats?.totalFollowing}
                    </span>
                  </span>
                </div>
                <FollowButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default LensPostPage
