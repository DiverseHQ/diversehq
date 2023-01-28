import { Link } from '@mui/material'
import React from 'react'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import useDevice from '../Common/useDevice'

import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

import { PublicationMainFocus, ReactionTypes } from '../../graphql/generated'
import ImageWithFullScreenZoom from '../Common/UI/ImageWithFullScreenZoom'
import VideoWithAutoPause from '../Common/UI/VideoWithAutoPause'
import ReactEmbedo from './embed/ReactEmbedo'
import { Markup } from 'interweave'
import {
  LensInfuraEndpoint,
  MAX_CONTENT_LINES_FOR_POST
} from '../../utils/config'
import { countLinesFromMarkdown, getURLsFromText } from '../../utils/utils'
import { FaRegComment } from 'react-icons/fa'
import { BsCollection } from 'react-icons/bs'
import { IoIosShareAlt } from 'react-icons/io'
TimeAgo.addDefaultLocale(en)

const IndexingPostCard = ({ postInfo }) => {
  const { isMobile } = useDevice()
  const showMore =
    countLinesFromMarkdown(postInfo?.metadata?.content) >
      MAX_CONTENT_LINES_FOR_POST || postInfo?.metadata?.content?.length > 400

  return (
    <>
      {postInfo && (
        <div className="relative sm:px-5 flex flex-col w-full bg-s-bg pt-3 pb-2 sm:my-3 sm:rounded-2xl shadow-sm">
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
                    <div className="pl-2 font-bold text-sm sm:text-lg hover:cursor-pointer hover:underline text-p-text">
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
                      className="rounded-full lg:w-[40px] lg:h-[40px] h-[30px] w-[30px] object-cover"
                    />
                  </Link>
                  <div className="flex flex-col justify-center items-start text-p-text">
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
            <div className="sm:mr-5 flex flex-row items-center">
              {/* pulsing dot */}
              <div className="text-xs sm:text-sm">Indexing</div>
              <div className="w-2 h-2 rounded-full bg-p-btn animate-pulse" />
            </div>
          </div>

          <div className="flex flex-row w-full">
            {!isMobile && (
              <div className="flex flex-col items-center ml-1.5 mt-1">
                <button className="hover:bg-p-btn-hover rounded-md p-1 cursor-pointer">
                  <img
                    //  onClick={liked ? handleUnLike : handleLike}
                    src={
                      postInfo.reaction === ReactionTypes.Upvote
                        ? '/UpvoteFilled.svg'
                        : '/Upvote.svg'
                    }
                    className="w-6 h-6"
                  />
                </button>
                <div className="font-bold leading-5">1</div>
                <button className="hover:bg-p-btn-hover rounded-md p-1 cursor-pointer">
                  <img src={'/Downvote.svg'} className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* main content */}
            <div className="flex flex-col w-full justify-between min-h-[76px]">
              <div>
                <div className="mb-2 px-3 sm:pl-3.5 ">
                  {postInfo?.metadata?.name !== 'Created with DiverseHQ' && (
                    <div className="font-medium text-base sm:text-lg w-full break-words">
                      {postInfo?.metadata?.name}
                    </div>
                  )}
                  {postInfo?.metadata?.name !== postInfo?.metadata?.content && (
                    <div
                      className={`${
                        showMore ? 'h-[150px]' : ''
                      } sm:max-w-[550px] overflow-hidden break-words`}
                    >
                      <Markup
                        className={`${
                          showMore ? 'line-clamp-5' : ''
                        } linkify whitespace-pre-wrap break-words text-sm sm:text-base`}
                      >
                        {postInfo?.metadata?.content}
                      </Markup>
                    </div>
                  )}
                  {showMore && (
                    <Link
                      href={`/p/${postInfo?.id}`}
                      className="text-blue-400 text-sm sm:text-base"
                    >
                      Show more
                    </Link>
                  )}
                </div>
                {postInfo?.metadata?.media?.length > 0 && (
                  <>
                    {postInfo?.metadata?.mainContentFocus ===
                      PublicationMainFocus.Image && (
                      <div className="sm:pl-5  sm:pr-6 sm:pb-1">
                        <ImageWithFullScreenZoom
                          src={`${LensInfuraEndpoint}${
                            postInfo?.metadata?.media[0]?.original.url.split(
                              '//'
                            )[1]
                          }`}
                        />
                      </div>
                    )}
                  </>
                )}
                {postInfo?.metadata?.mainContentFocus ===
                  PublicationMainFocus.Video && (
                  <div className="sm:pl-5 sm:pr-6 sm:pb-1">
                    <VideoWithAutoPause
                      src={`${LensInfuraEndpoint}${
                        postInfo?.metadata?.media[0]?.original.url.split(
                          '//'
                        )[1]
                      }`}
                      className={`image-unselectable object-contain sm:rounded-xl w-full
                        max-h-[500px]
                      `}
                      loop
                      controls
                      muted
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
                className={`text-p-text flex flex-row items-center px-3 sm:px-4.5 py-1 justify-between sm:justify-start sm:space-x-28 ${
                  isMobile
                    ? 'border-b-[1px] border-[#eee] dark:border-p-border pb-2'
                    : ''
                }`}
              >
                {isMobile && (
                  <div className="flex flex-row items-center gap-x-1">
                    <button className="hover:bg-p-btn-hover cursor-pointer rounded-md p-1">
                      <img src={'/UpvoteFilled.svg'} className="w-5 h-5" />
                    </button>
                    <div className="font-bold">1</div>
                    <button className="hover:bg-p-btn-hover rounded-md p-1 cursor-pointer">
                      <img src={'/Downvote.svg'} className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <div className="flex flex-row items-center cursor-pointer  hover:bg-p-btn-hover rounded-md p-1">
                  <FaRegComment className=" mr-2 w-5 h-5 sm:w-5 sm:h-5" />

                  {postInfo?.stats?.totalAmountOfComments}
                </div>
                <button
                  disabled={true}
                  className="hover:bg-p-btn-hover rounded-md p-1 cursor-pointer flex flex-row items-center"
                >
                  <BsCollection className="w-5 h-5" />
                  <div className="ml-2">1</div>
                </button>
                <div className="hover:bg-p-btn-hover rounded-md p-1">
                  <IoIosShareAlt className="hover:cursor-pointer w-6 h-6 " />
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
