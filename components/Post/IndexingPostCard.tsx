import React from 'react'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'

import ReactTimeAgo from 'react-time-ago'

import { PublicationMainFocus } from '../../graphql/generated'
import ReactEmbedo from './embed/ReactEmbedo'
import { getURLsFromText, stringToLength } from '../../utils/utils'
import { BsCollection } from 'react-icons/bs'
import Link from 'next/link'
import Attachment from './Attachment'
import { Tooltip } from '@mui/material'
import formatHandle from '../User/lib/formatHandle'
import Markup from '../Lexical/Markup'
import { AiOutlineRetweet } from 'react-icons/ai'
import { useDevice } from '../Common/DeviceWrapper'
import { useLensUserContext } from '../../lib/LensUserContext'
import getAvatar from '../User/lib/getAvatar'
import { PublicationMetadataWithoutMedia } from '../../types/post'
import { getContent } from './getContent'

export interface singleMedia {
  original: {
    url: string
    mimeType: string
  }
}
// extend to PublicationMetadata except for media
export interface extendedMetadata extends PublicationMetadataWithoutMedia {
  media: singleMedia[]
}

export type IndexingPostInfo = {
  tempId?: string
  communityInfo?: {
    _id?: string
    name?: string
    image?: string
  }
  createdAt?: string
  hasCollectedByMe?: boolean
  hidden?: boolean
  isGated?: boolean
  metadata?: extendedMetadata
  profile: {
    _id: string
    handle: string
    ownedBy: string
  }
  reaction: 'UPVOTE'
  stats: {
    totalUpvotes: number
    totalAmountOfCollects: number
    totalAmountOfComments: number
    totalDownvotes: number
  }
}

interface Props {
  postInfo: IndexingPostInfo
}

const IndexingPostCard = ({ postInfo }: Props) => {
  const { isMobile } = useDevice()
  const { data } = useLensUserContext()

  // @ts-ignore
  const content = getContent({
    ...postInfo,
    appId: 'diversehq'
  })

  return (
    <>
      {postInfo && (
        <div className="relative sm:px-5 flex flex-col w-full bg-s-bg pt-3 pb-2 sm:my-3 border-b border-s-border">
          {/* top row */}
          <div className="px-3 sm:px-0 flex flex-row items-center justify-between mb-1  w-full">
            {!isMobile && (
              <>
                <div className="flex flex-row w-full items-center">
                  {postInfo?.communityInfo ? (
                    <>
                      <Link
                        href={`/c/${postInfo?.communityInfo?.name}`}
                        passHref
                      >
                        <ImageWithPulsingLoader
                          src={postInfo?.communityInfo?.image}
                          className="rounded-full lg:w-[40px] lg:h-[40px] h-[30px] w-[30px] object-cover"
                        />
                      </Link>
                      <Link href={`/c/${postInfo?.communityInfo?.name}`}>
                        <div className="pl-2 font-bold text-sm sm:text-lg hover:cursor-pointer hover:underline text-p-text">
                          {postInfo?.communityInfo?.name}
                        </div>
                      </Link>
                    </>
                  ) : (
                    <>
                      <ImageWithPulsingLoader
                        // @ts-ignore
                        src={getAvatar(data?.defaultProfile)}
                        className="rounded-full lg:w-[40px] lg:h-[40px] h-[30px] w-[30px] object-cover"
                      />
                      <div className="pl-2 font-bold text-sm sm:text-lg hover:cursor-pointer hover:underline text-p-text">
                        {stringToLength(data?.defaultProfile?.name, 20)}
                      </div>
                    </>
                  )}

                  <Link href={`/u/${formatHandle(postInfo?.profile?.handle)}`}>
                    <div className="flex flex-row items-center justify-center text-s-text text-xs sm:text-sm">
                      {postInfo?.communityInfo && (
                        <p className="pl-1.5 font-normal"> posted by</p>
                      )}
                      <div className="pl-1.5 font-normal hover:cursor-pointer hover:underline">
                        u/{formatHandle(postInfo?.profile?.handle)}
                      </div>
                    </div>
                  </Link>
                  <div>
                    {postInfo?.createdAt && (
                      <div className="text-xs sm:text-sm text-s-text ml-2">
                        <ReactTimeAgo
                          timeStyle="twitter"
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
                  {postInfo?.communityInfo ? (
                    <Link href={`/c/${postInfo?.communityInfo?.name}`} passHref>
                      <ImageWithPulsingLoader
                        src={postInfo?.communityInfo?.image}
                        className="rounded-full lg:w-[40px] lg:h-[40px] h-[30px] w-[30px] object-cover"
                      />
                    </Link>
                  ) : (
                    <ImageWithPulsingLoader
                      // @ts-ignore
                      src={getAvatar(data?.defaultProfile)}
                      className="rounded-full lg:w-[40px] lg:h-[40px] h-[30px] w-[30px] object-cover"
                    />
                  )}
                  <div className="flex flex-col justify-center items-start text-p-text">
                    {postInfo?.communityInfo ? (
                      <Link href={`/c/${postInfo?.communityInfo?.name}`}>
                        <div className="pl-2 font-bold text-sm sm:text-xl hover:cursor-pointer hover:underline">
                          {postInfo?.communityInfo?.name}
                        </div>
                      </Link>
                    ) : (
                      <div className="pl-2 font-bold text-sm sm:text-xl hover:cursor-pointer hover:underline">
                        {stringToLength(data?.defaultProfile?.name, 20)}
                      </div>
                    )}
                    <div className="flex flex-row items-center justify-start">
                      <Link
                        href={`/u/${formatHandle(postInfo?.profile?.handle)}`}
                        passHref
                      >
                        <div className="flex flex-row items-center justify-center text-s-text text-xs sm:text-sm">
                          {postInfo?.communityInfo && (
                            <p className="pl-1.5 font-normal"> posted by</p>
                          )}
                          <div className="pl-1.5 font-normal hover:cursor-pointer hover:underline">
                            u/{formatHandle(postInfo?.profile?.handle)}
                          </div>
                        </div>
                      </Link>
                      <div>
                        {postInfo?.createdAt && (
                          <div className="text-xs sm:text-sm text-s-text ml-2">
                            <ReactTimeAgo
                              timeStyle="twitter"
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
            <div className="sm:mr-5 flex flex-row items-center">
              {/* pulsing dot */}
              <Tooltip
                enterDelay={1000}
                leaveDelay={200}
                title="Indexing"
                arrow
              >
                <div className="w-2 h-2 rounded-full bg-p-btn animate-ping" />
              </Tooltip>
            </div>
          </div>

          <div className="flex flex-row w-full">
            {!isMobile && (
              <div className="flex flex-col items-center ml-1.5 mt-1">
                <button className="hover:bg-p-btn-hover rounded-md p-1 cursor-pointer">
                  <img
                    //  onClick={liked ? handleUnLike : handleLike}
                    src={'/UpvotedFilled.svg'}
                    className="w-5 h-5"
                  />
                </button>
                <div className="font-bold leading-5">1</div>
                <button className="hover:bg-p-btn-hover rounded-md p-1 cursor-pointer">
                  <img src={'/downvoteGray.svg'} className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* main content */}
            <div className="flex flex-col w-full justify-between min-h-[76px]">
              <div>
                <div className="mb-2 px-3 sm:pl-3.5">
                  {postInfo?.metadata?.name && (
                    <div className="font-medium text-base sm:text-lg w-full break-words">
                      {postInfo?.metadata?.name}
                    </div>
                  )}
                  {!!content && (
                    <div
                      className={`sm:max-w-[550px] overflow-hidden break-words`}
                    >
                      <Markup
                        className={`linkify whitespace-pre-wrap break-words text-sm sm:text-base`}
                      >
                        {content}
                      </Markup>
                    </div>
                  )}
                </div>
                {postInfo?.metadata?.media?.length > 0 && (
                  <div className="sm:pl-5  sm:pr-6 sm:pb-1">
                    <Attachment
                      // @ts-ignore
                      publication={postInfo}
                      attachments={postInfo?.metadata?.media}
                      className="w-full"
                    />
                  </div>
                )}
                {postInfo?.metadata?.mainContentFocus !==
                  PublicationMainFocus.Image &&
                  postInfo?.metadata?.mainContentFocus !==
                    PublicationMainFocus.Video &&
                  getURLsFromText(postInfo?.metadata?.content).length > 0 && (
                    <ReactEmbedo
                      url={getURLsFromText(postInfo?.metadata?.content)[0]}
                      className="w-full sm:w-[500px] sm:pl-5 sm:pr-6 sm:pb-1"
                    />
                  )}
              </div>

              {/* bottom row */}
              <div
                className={`text-p-text flex flex-row items-center px-3 sm:px-6 py-1 justify-between sm:justify-start sm:space-x-28 ${
                  isMobile
                    ? 'border-b-[1px] border-[#eee] dark:border-p-border pb-2'
                    : ''
                }`}
              >
                {isMobile && (
                  <div className="flex flex-row items-center gap-x-1">
                    <button className="hover:bg-p-btn-hover cursor-pointer rounded-md p-1">
                      <img src={'/UpvotedFilled.svg'} className="w-4 h-4" />
                    </button>
                    <div className="font-bold">1</div>
                    <button className="hover:bg-p-btn-hover rounded-md p-1 cursor-pointer">
                      <img src={'/downvoteGray.svg'} className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex flex-row items-center cursor-pointer  hover:bg-p-btn-hover rounded-md p-1">
                  <img
                    src="/comment.svg"
                    alt="Comment"
                    className="w-4 h-4 mr-2"
                  />
                  <span className="text-[#687684]">
                    {postInfo?.stats?.totalAmountOfComments}
                  </span>
                </div>
                <button
                  disabled={true}
                  className="hover:bg-p-btn-hover text-[#687684] rounded-md p-1 cursor-pointer flex flex-row items-center"
                >
                  <BsCollection className="w-4 h-4 " />
                  <div className="ml-2">0</div>
                </button>
                <button
                  disabled={true}
                  className="hover:bg-p-btn-hover text-[#687684] rounded-md p-1 cursor-pointer flex flex-row items-center"
                >
                  <AiOutlineRetweet className={` rounded-md w-4 h-4 `} />
                  <p className="ml-2 font-medium text-[#687684]">0</p>
                </button>
                <div className="hover:bg-p-btn-hover rounded-md p-1">
                  <img
                    src="/share.svg"
                    alt="Share"
                    className="hover:cursor-pointer w-4 h-4 sm:w-[18px] sm:h-[18px] "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default IndexingPostCard
