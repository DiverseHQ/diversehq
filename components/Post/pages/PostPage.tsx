import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AiOutlineFileAdd } from 'react-icons/ai'
import { IoMdClose } from 'react-icons/io'
import { getCommunityInfo } from '../../../apiHelper/community'
import CombinedCommentSectionApiNew from '../../Comment/CombinedCommentSectionApiNew'
import CombinedCommentSectionApiTop from '../../Comment/CombinedCommentSectionApiTop'
import CommentFilterNav from '../../Comment/CommentFilterNav'
import ImageWithFullScreenZoom from '../../Common/UI/ImageWithFullScreenZoom'
import MobileLoader from '../../Common/UI/MobileLoader'
import PostCard from '../PostCard'
import { xpPerMember } from '../../../utils/config'
import { getLevelAndThresholdXP } from '../../../lib/helpers'
import JoinCommunityButton from '../../Community/JoinCommunityButton'
import { getUserFromAddressOrName, getUserInfo } from '../../../apiHelper/user'
import getLensProfileInfo from '../../../lib/profile/get-profile-info'
import getDefaultProfileInfo from '../../../lib/profile/get-default-profile-info'
import useLensFollowButton from '../../User/useLensFollowButton'
import MessageButton from '../../Messages/MessageButton'
import { useDevice } from '../../Common/DeviceWrapper'
import getIPFSLink from '../../User/lib/getIPFSLink'

const PostPage = ({ post }) => {
  const [active, setActive] = useState('top')
  const { isMobile } = useDevice()
  const router = useRouter()
  const [communityInfo, setCommunityInfo] = useState<any>({})

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

  const { currentXP, level, thresholdXP } = getLevelAndThresholdXP(
    // @ts-ignore
    communityInfo?.membersCount * xpPerMember || 0
  )

  const calculateBarPercentage = (currentXP, threshold) => {
    const percentage = Math.round((threshold * 100) / currentXP)
    return percentage
  }
  console.log('post', post)
  useEffect(() => {
    fetchCommunityInfo()
    if (post?.profile?.handle) {
      getUserProfileAndLensProfile(post.profile.handle)
    } else {
      getUserProfileAndLensProfile(post.author)
    }
  }, [post])

  const [profile, setProfile] = useState<any>({})
  const [lensProfile, setLensProfile] = useState(null)
  console.log('profile', profile)
  console.log('lens profile', lensProfile)

  const getUserProfileAndLensProfile = async (id) => {
    if (id?.endsWith('.test')) {
      try {
        const lensProfileRes = await getLensProfileInfo({
          handle: id
        })
        if (lensProfileRes.profile) {
          setLensProfile(lensProfileRes.profile)
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
    } else {
      try {
        const res = await getUserFromAddressOrName(id)
        if (res.status === 200) {
          const userInfo = await res.json()
          setProfile(userInfo)
          const lensProfileRes = await getDefaultProfileInfo({
            ethereumAddress: userInfo.walletAddress
          })

          if (lensProfileRes.defaultProfile) {
            setLensProfile(lensProfileRes.defaultProfile)
          }
        } else {
          setProfile(null)
          setLensProfile(null)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const { FollowButton } = useLensFollowButton({
    profileId: lensProfile?.id
  })

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
              {/* @ts-ignore */}
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
                src={
                  // @ts-ignore
                  communityInfo.bannerImageUrl
                    ? // @ts-ignore
                      getIPFSLink(communityInfo?.bannerImageUrl)
                    : '/gradient.jpg'
                }
                className="h-[80px] rounded-t-[15px] w-full object-cover"
              />
              <div className="rounded-b-[15px] bg-s-bg pt-2 pb-3 px-3">
                <div className="flex flex-row gap-2 justify-start">
                  <div className="flex items-center justify-center rounded-full bg-[#000] w-[50px] h-[50px] xl:w-[60px] xl:h-[60px] -translate-y-6">
                    <ImageWithFullScreenZoom
                      src={
                        // @ts-ignore
                        getIPFSLink(communityInfo?.logoImageUrl) ??
                        '/gradient.jpg'
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
                      {new Date(communityInfo?.createdAt)
                        .toDateString()
                        .split(' ')
                        .slice(1)
                        .join(' ')}
                    </span>
                  </div>
                </div>
                <p className="mb-2 text-p-text">{communityInfo?.description}</p>
                <div className="mb-2 text-p-text">
                  <span>Members: </span>
                  <span className="font-semibold">
                    {communityInfo?.membersCount}
                  </span>
                </div>
                <JoinCommunityButton id={communityInfo?._id} />
              </div>
            </div>
            <div className="flex flex-col rounded-[15px] w-[250px] lg:w-[300px] ml-4 mt-3">
              <ImageWithFullScreenZoom
                src={profile?.bannerImageUrl}
                className="h-[80px] rounded-t-[15px] w-full object-cover"
              />
              <div className="rounded-b-[15px] bg-s-bg pt-2 pb-3 px-3">
                <div className="flex flex-row gap-2 justify-between">
                  <div className="flex flex-row gap-2">
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
                        {profile?.name ||
                          'u/' + profile.walletAddress?.slice(0, 6) + '...'}
                      </h2>
                      {lensProfile && (
                        <h2
                          className="font-bold text-p-text text-[16px]  hover:underline cursor-pointer truncate mb-3"
                          onClick={() => {
                            if (lensProfile?.handle)
                              router.push(`/u/${lensProfile?.handle}`)
                          }}
                        >
                          {lensProfile?.handle}
                        </h2>
                      )}
                    </div>
                  </div>
                  <div className="self-start">
                    <MessageButton userLensProfile={lensProfile} />
                  </div>
                </div>
                <p className="-translate-y-2 text-p-text">{profile?.bio}</p>
                {lensProfile && (
                  <>
                    <div className="mb-2 text-p-text flex flex-row gap-2">
                      <span>
                        Followers:{' '}
                        <span className="font-semibold">
                          {lensProfile?.stats?.totalFollowers}
                        </span>
                      </span>
                      <span>
                        Following:{' '}
                        <span className="font-semibold">
                          {lensProfile?.stats?.totalFollowing}
                        </span>
                      </span>
                    </div>
                    <FollowButton />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default PostPage
