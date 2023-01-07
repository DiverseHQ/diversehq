import React, { useEffect, useState } from 'react'
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en)
import Link from 'next/link'
import {
  PublicationMainFocus,
  ReactionTypes,
  useAddReactionMutation
} from '../../graphql/generated'
import { FaRegComment, FaRegCommentDots } from 'react-icons/fa'
import { FiSend } from 'react-icons/fi'
import { useNotify } from '../Common/NotifyContext'
import { LensInfuraEndpoint } from '../../utils/config'
import { useLensUserContext } from '../../lib/LensUserContext'
import JoinCommunityButton from '../Community/JoinCommunityButton'
import useDevice from '../Common/useDevice'
import { getCommunityInfoUsingId } from '../../api/community'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import { useRouter } from 'next/router'

/**
 * Sample post object
 * {
    "__typename": "Post",
    "id": "0x5683-0x1c",
    "profile": {
        "id": "0x5683",
        "name": null,
        "bio": null,
        "attributes": [],
        "isFollowedByMe": false,
        "isFollowing": false,
        "followNftAddress": "0x2aa988BA58F77452242b930F36462D88C3d71c9e",
        "metadata": null,
        "isDefault": true,
        "handle": "daksht.test",
        "picture": null,
        "coverPicture": null,
        "ownedBy": "0xE2C0547Fa4CC1F0242154A93Ade7D744a92a43D7",
        "dispatcher": {
            "address": "0x6C1e1bC39b13f9E0Af9424D76De899203F47755F",
            "canUseRelay": true
        },
        "stats": {
            "totalFollowers": 4,
            "totalFollowing": 7,
            "totalPosts": 21,
            "totalComments": 0,
            "totalMirrors": 0,
            "totalPublications": 21,
            "totalCollects": 9
        },
        "followModule": null,
        "onChainIdentity": {
            "ens": {
                "name": null
            },
            "proofOfHumanity": false,
            "sybilDotOrg": {
                "verified": false,
                "source": {
                    "twitter": {
                        "handle": null
                    }
                }
            },
            "worldcoin": {
                "isHuman": false
            }
        }
    },
    "stats": {
        "totalAmountOfMirrors": 0,
        "totalAmountOfCollects": 2,
        "totalAmountOfComments": 0
    },
    "metadata": {
        "name": "6a7ee164-497d-44cb-bb30-bf4d9b7b4663.png",
        "description": "dragon",
        "content": "dragon",
        "image": "ipfs://bafkreib5blsj4k7tvkrtqo3ixl4i4q6qsjxoxt5vkqkomaknvffiuukooy",
        "media": [
            {
                "original": {
                    "url": "ipfs://bafkreib5blsj4k7tvkrtqo3ixl4i4q6qsjxoxt5vkqkomaknvffiuukooy",
                    "width": null,
                    "height": null,
                    "mimeType": "image/png"
                },
                "small": null,
                "medium": null
            }
        ],
        "attributes": [],
        "encryptionParams": null
    },
    "createdAt": "2022-12-28T11:26:01.000Z",
    "collectModule": {
        "__typename": "FeeCollectModuleSettings",
        "type": "FeeCollectModule",
        "amount": {
            "asset": {
                "name": "Wrapped Matic",
                "symbol": "WMATIC",
                "decimals": 18,
                "address": "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"
            },
            "value": "0.01"
        },
        "recipient": "0xE2C0547Fa4CC1F0242154A93Ade7D744a92a43D7",
        "referralFee": 0
    },
    "referenceModule": {
        "type": "DegreesOfSeparationReferenceModule",
        "contractAddress": "0xe20D64D25779D2Ae0d76711e5Aca23EE633f2E1E",
        "commentsRestricted": true,
        "mirrorsRestricted": true,
        "degreesOfSeparation": 0
    },
    "appId": "nftornot",
    "hidden": false,
    "reaction": null,
    "mirrors": [],
    "hasCollectedByMe": false,
    "isGated": false
}
 */

//sample url https://lens.infura-ipfs.io/ipfs/QmUrfgfcoa7yeHefGCsX9RoxbfpZ1eiASQwp5TnCSsguNA

const LensPostCard = ({ post }) => {
  const { isMobile } = useDevice()
  const { notifyInfo, notifyError } = useNotify()
  const [reaction, setReaction] = useState(post?.reaction)
  const [upvoteCount, setUpvoteCount] = useState(post?.stats.totalUpvotes)
  const [downvoteCount, setDownvoteCount] = useState(post?.stats.totalDownvotes)
  const [voteCount, setVoteCount] = useState(
    post?.stats?.totalUpvotes - post?.stats?.totalDownvotes
  )
  const [postInfo, setPostInfo] = useState(post)
  useEffect(() => {
    setVoteCount(upvoteCount - downvoteCount)
  }, [upvoteCount, downvoteCount])
  const { mutateAsync: addReaction } = useAddReactionMutation()
  const { isSignedIn, hasProfile, data: lensProfile } = useLensUserContext()

  const fetchCommunityInformationAndSetPost = async () => {
    const communityId = post?.metadata?.tags?.[0]
    console.log('communityId', communityId)
    if (!communityId) return
    const communityInfo = await getCommunityInfoUsingId(communityId)
    console.log('communityInfo', communityInfo)
    setPostInfo({ ...post, communityInfo })
  }

  useEffect(() => {
    console.log('lenspotsCardPost', postInfo)
    if (!postInfo) return
    if (!postInfo?.communityInfo) {
      fetchCommunityInformationAndSetPost()
    }
  }, [postInfo])

  const handleShare = async () => {
    try {
      const url = window.location.href
      const text = `${post?.metadata?.content}`
      const title = 'Share this post'
      navigator.share({
        title,
        text,
        url
      })
    } catch (error) {
      console.log(error)
      notifyError('Failed to share post')
    }
  }
  const handleUpvote = async () => {
    if (reaction === ReactionTypes.Upvote) return
    try {
      if (!isSignedIn || !hasProfile) {
        notifyInfo('How about loging in lens, first?')
        return
      }

      setReaction(ReactionTypes.Upvote)
      if (reaction === ReactionTypes.Downvote) {
        setDownvoteCount(downvoteCount - 1)
        setUpvoteCount(upvoteCount + 1)
      } else {
        setUpvoteCount(upvoteCount + 1)
      }
      await addReaction({
        request: {
          profileId: lensProfile.defaultProfile.id,
          publicationId: post.id,
          reaction: ReactionTypes.Upvote
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleDownvote = async () => {
    if (reaction === ReactionTypes.Downvote) return
    try {
      if (!isSignedIn || !hasProfile) {
        notifyInfo('How about loging in lens, first?')
        return
      }
      setReaction(ReactionTypes.Downvote)
      if (reaction === ReactionTypes.Upvote) {
        setUpvoteCount(upvoteCount - 1)
        setDownvoteCount(downvoteCount + 1)
      } else {
        setDownvoteCount(downvoteCount + 1)
      }
      await addReaction({
        request: {
          profileId: lensProfile.defaultProfile.id,
          publicationId: post.id,
          reaction: ReactionTypes.Downvote
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  console.log(post)
  const router = useRouter()
  return (
    <>
      {postInfo && (
        <div className="sm:px-5 flex flex-col w-full bg-s-bg pt-3 my-2 sm:my-3 sm:rounded-2xl shadow-sm">
          {/* top row */}
          <div className="px-3 sm:px-0 flex flex-row items-center justify-between mb-1  w-full">
            {!isMobile && (
              <>
                <div className="flex flex-row w-full items-center">
                  <Link href={`/c/${postInfo?.communityInfo?.name}`} passHref>
                    <ImageWithPulsingLoader
                      src={
                        postInfo?.communityInfo?.logoImageUrl
                          ? postInfo?.communityInfo?.logoImageUrl
                          : '/gradient.jpg'
                      }
                      className="rounded-full lg:w-[40px] lg:h-[40px] h-[30px] w-[30px] object-cover"
                    />
                  </Link>
                  <Link href={`/c/${postInfo?.communityInfo?.name}`}>
                    <div className="pl-2 font-bold text-sm sm:text-xl hover:cursor-pointer hover:underline">
                      {postInfo?.communityInfo?.name}
                    </div>
                  </Link>

                  <Link
                    href={`/u/${postInfo?.profile?.handle}`}
                    className="flex flex-row items-center justify-center text-s-text text-xs sm:text-sm"
                  >
                    <p className="pl-1.5 font-normal"> posted by</p>
                    <div className="pl-1.5 font-normal hover:cursor-pointer hover:underline">
                      u/{postInfo?.profile?.handle}
                    </div>
                  </Link>
                  <div>
                    {postInfo?.createdAt && (
                      <div className="text-xs sm:text-sm text-s-text ml-2">
                        <ReactTimeAgo
                          date={new Date(postInfo.createdAt)}
                          locale="en-US"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {isMobile && (
              <>
                <div className="flex flex-row w-full items-center">
                  <Link href={`/c/${postInfo?.communityInfo?.name}`} passHref>
                    <ImageWithPulsingLoader
                      src={
                        postInfo?.communityInfo?.logoImageUrl
                          ? postInfo?.communityInfo?.logoImageUrl
                          : '/gradient.jpg'
                      }
                      className="rounded-full lg:w-[40px] lg:h-[40px] h-[30px] w-[30px]"
                    />
                  </Link>
                  <div className="flex flex-col justify-center items-start">
                    <Link href={`/c/${postInfo?.communityInfo?.name}`}>
                      <div className="pl-2 font-bold text-sm sm:text-xl hover:cursor-pointer hover:underline">
                        {postInfo?.communityInfo?.name}
                      </div>
                    </Link>
                    <div className="flex flex-row items-center justify-start">
                      <Link
                        href={`/u/${postInfo?.profile?.handle}`}
                        className="flex flex-row items-center justify-center text-s-text text-xs sm:text-sm"
                        passHref
                      >
                        <p className="pl-1.5 font-normal"> posted by</p>
                        <div className="pl-1.5 font-normal hover:cursor-pointer hover:underline">
                          u/{postInfo?.profile?.handle}
                        </div>
                      </Link>
                      <div>
                        {postInfo?.createdAt && (
                          <div className="text-xs sm:text-sm text-s-text ml-2">
                            <ReactTimeAgo
                              date={new Date(postInfo.createdAt)}
                              locale="en-US"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="sm:mr-5">
              <JoinCommunityButton id={postInfo?.communityInfo?._id} />
            </div>
          </div>

          <div className="flex flex-row w-full">
            {!isMobile && (
              <div className="flex flex-col items-center ml-[9px] mt-2">
                <img
                  //  onClick={liked ? handleUnLike : handleLike}
                  src={
                    reaction === ReactionTypes.Upvote
                      ? '/UpvoteFilled.svg'
                      : '/Upvote.svg'
                  }
                  onClick={handleUpvote}
                  className="w-6 h-6 cursor-pointer"
                />
                <div className="font-bold">{voteCount}</div>
                <img
                  src={
                    reaction === ReactionTypes.Downvote
                      ? '/DownvoteFilled.svg'
                      : '/Downvote.svg'
                  }
                  className="w-5 h-5 cursor-pointer"
                  onClick={handleDownvote}
                />
              </div>
            )}

            {/* main content */}
            <div className="flex flex-col w-full">
              <div>
                <div className="break-words mb-2 px-3 sm:pl-5 font-medium text-base sm:text-lg">
                  {postInfo?.metadata?.content}
                </div>
                {postInfo?.metadata?.mainContentFocus ===
                  PublicationMainFocus.Image && (
                  <Link href={`/p/${postInfo?.id}`} passHref>
                    {/* eslint-disable-next-line */}
                    <div className="sm:pl-5  sm:pr-6 sm:pb-1">
                      <ImageWithPulsingLoader
                        src={`${LensInfuraEndpoint}${
                          postInfo?.metadata?.media[0]?.original.url.split(
                            '//'
                          )[1]
                        }`}
                        className={`image-unselectable object-contain sm:rounded-xl w-full ${
                          router.pathname.startsWith('/p')
                            ? ''
                            : 'max-h-[500px]'
                        }`}
                      />
                    </div>
                  </Link>
                )}
                {postInfo?.metadata?.mainContentFocus ===
                  PublicationMainFocus.Video && (
                  <div className="sm:pl-5 sm:pr-6 sm:pb-1">
                    <video
                      src={`${LensInfuraEndpoint}${
                        postInfo?.metadata?.media[0]?.original.url.split(
                          '//'
                        )[1]
                      }`}
                      className={`image-unselectable object-contain sm:rounded-xl w-full ${
                        router.pathname.startsWith('/p') ? '' : 'max-h-[500px]'
                      }`}
                      autoPlay
                      muted
                      loop
                      controls
                    />
                  </div>
                )}
              </div>

              {/* bottom row */}
              <div className="text-s-text sm:text-p-text flex flex-row items-center px-3 sm:px-6 py-2 justify-between sm:justify-start sm:space-x-28">
                {isMobile && (
                  <div className="flex flex-row items-center gap-x-2">
                    <img
                      src={
                        reaction === ReactionTypes.Upvote
                          ? '/UpvoteFilled.svg'
                          : '/Upvote.svg'
                      }
                      onClick={handleUpvote}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <div className="font-bold">{voteCount}</div>
                    <img
                      src={
                        reaction === ReactionTypes.Downvote
                          ? '/DownvoteFilled.svg'
                          : '/Downvote.svg'
                      }
                      className="w-5 h-5 cursor-pointer"
                      onClick={handleDownvote}
                    />
                  </div>
                )}

                <Link
                  href={`/p/${postInfo.id}`}
                  className="flex flex-row items-center"
                  passHref
                >
                  {postInfo?.stats?.totalAmountOfComments === 0 && (
                    <FaRegComment className="hover:cursor-pointer mr-2 w-5 h-5 sm:w-5 sm:h-5" />
                  )}
                  {postInfo?.stats?.totalAmountOfComments > 0 && (
                    <FaRegCommentDots className="hover:cursor-pointer mr-2 w-5 h-5 sm:w-5 sm:h-5" />
                  )}
                  {postInfo?.stats?.totalAmountOfComments}
                </Link>
                <div>
                  <FiSend
                    onClick={handleShare}
                    className="hover:cursor-pointer mr-3 w-5 h-5"
                  />
                </div>
                {/* <div>
               {isAuthor && (
                 <div className="relative">
                   <BsThreeDots
                     className="hover:cursor-pointer mr-1.5 w-4 h-4 sm:w-6 sm:h-6"
                     onClick={showMoreOptions}
                     title="More"
                   />
                 </div>
               )}
             </div> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LensPostCard
