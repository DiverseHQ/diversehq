import React, { useEffect } from 'react'
import { CollectModule, Profile, Publication } from '../../../graphql/generated'
import useCollectPublication from './useCollectPublication'
import useLensFollowButton from '../../User/useLensFollowButton'
import { useNotify } from '../../Common/NotifyContext'
import { CircularProgress } from '@mui/material'
import { RiUserFollowLine } from 'react-icons/ri'
import useDevice from '../../Common/useDevice'
import { BsCollection } from 'react-icons/bs'
type Props = {
  setIsCollected: any
  setCollectCount: any
  collectModule: CollectModule
  publication: Publication
  author: Profile
  setIsDrawerOpen: any
  setShowOptionsModal: any
  setIsCollecting: any
}

const FreeCollectPopUp = ({
  setIsCollected,
  setCollectCount,
  collectModule,
  publication,
  author,
  setIsDrawerOpen,
  setShowOptionsModal,
  setIsCollecting
}: Props) => {
  const { collectPublication, isSuccess, loading } =
    useCollectPublication(collectModule)
  const { notifySuccess }: any = useNotify()
  useEffect(() => {
    if (!loading && isSuccess) {
      notifySuccess('Post has been collected, check your collections!')
      setIsCollected(true)
      setCollectCount((prev: number) => prev + 1)
      setIsDrawerOpen(false)
      setShowOptionsModal(false)
      setIsCollecting(false)
    }
  }, [loading, isSuccess])

  useEffect(() => {
    if (loading) {
      setIsCollecting(true)
    }
  }, [loading])

  const {
    isFollowedByMe,
    handleFollowProfile,
    loading: followLoading
  } = useLensFollowButton({ profileId: author.id })

  const { isDesktop } = useDevice()

  return (
    <>
      {isDesktop ? (
        <div className="grid w-96 min-h-48 shadow-p-btn">
          <div className="col-span-full row-span-full  w-full h-[80px] flex flex-row items-center justify-around  ">
            <div className="  ">
              {collectModule.__typename === 'FreeCollectModuleSettings' &&
                !collectModule.followerOnly && (
                  <div className="font-semibold">Free collect for all</div>
                )}
              {collectModule.__typename === 'FreeCollectModuleSettings' &&
                collectModule.followerOnly && (
                  <>
                    <div>
                      {isFollowedByMe ? (
                        <div className="flex flex-col items-center justify-start font-semibold">
                          You are following {author.handle} and can collect for
                          free
                          <br />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="">
                            You are not following {author.handle}
                          </div>
                          <div className="flex flex-row items-center justify-center">
                            <button
                              onClick={() => {
                                handleFollowProfile(author.id)
                              }}
                              className="bg-p-btn text-p-btn-text rounded-full px-4 py-1 text-sm font-semibold"
                            >
                              {followLoading ? (
                                <div className="flex flex-row justify-center items-center space-x-2">
                                  <CircularProgress
                                    size="18px"
                                    color="primary"
                                  />
                                  <p>Follow</p>
                                </div>
                              ) : author.isFollowing ? (
                                'Follow back'
                              ) : (
                                <div className="flex flex-row justify-center items-center space-x-1 ">
                                  <RiUserFollowLine /> <p>Follow</p>
                                </div>
                              )}
                            </button>
                            <p>to Collect for Free</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
            </div>
            <button
              onClick={async (e) => {
                e.stopPropagation()
                await collectPublication(publication.id)
              }}
              disabled={
                loading ||
                (collectModule.__typename === 'FreeCollectModuleSettings' &&
                  collectModule.followerOnly &&
                  !isFollowedByMe)
              }
              className={` ${
                loading ||
                (collectModule.__typename === 'FreeCollectModuleSettings' &&
                  collectModule.followerOnly &&
                  !isFollowedByMe)
                  ? 'bg-p-btn-disabled'
                  : 'bg-p-btn'
              } text-p-btn-text mr-1.5 rounded-md py-1.5 px-4 text-center flex font-semibold text-p-text justify-center items-center `}
            >
              {loading ? (
                <div className="flex flex-row justify-center items-center space-x-2">
                  <CircularProgress size="18px" color="primary" />
                  <div>Collect</div>
                </div>
              ) : (
                <div className="flex flex-row items-center space-x-2">
                  <BsCollection className="w-5 h-5" />
                  <p>Collect</p>
                </div>
              )}
            </button>
            {/* </div> */}
          </div>
          <div className="col-span-full row-span-full translate-y-1 bg-s-bg  h-[4px] w-3 rounded self-end justify-self-center rounded-b-full border-b border-l border-r"></div>
        </div>
      ) : (
        // mobile
        <div className="flex items-center flex-col justify-center px-4 text-p-text">
          {collectModule?.__typename === 'FreeCollectModuleSettings' &&
            collectModule.followerOnly && (
              <>
                {!isFollowedByMe && (
                  <div className="flex flex-row items-center self-start space-x-2 mb-2 font-medium">
                    <button
                      onClick={() => {
                        handleFollowProfile(author.id)
                      }}
                      className="bg-p-btn text-p-btn-text rounded-full px-4 py-1 text-sm font-semibold "
                    >
                      {followLoading ? (
                        <div className="flex flex-row self-start space-x-2">
                          <CircularProgress size="18px" color="primary" />
                          <p>Follow</p>
                        </div>
                      ) : author.isFollowing ? (
                        'Follow back'
                      ) : (
                        <div className="flex flex-row justify-center items-center space-x-1 ">
                          <RiUserFollowLine /> <p>Follow</p>
                        </div>
                      )}
                    </button>
                    <p>{author.handle} to Collect for Free</p>
                  </div>
                )}
              </>
            )}

          <button
            onClick={async (e) => {
              e.stopPropagation()
              await collectPublication(publication.id)
            }}
            disabled={
              loading ||
              (collectModule.__typename === 'FreeCollectModuleSettings' &&
                collectModule.followerOnly &&
                !isFollowedByMe)
            }
            className="bg-p-btn text-p-text rounded-full text-center flex font-semibold text-p-text py-1 justify-center items-center text-p-text w-full text-xl m-1"
          >
            {loading ? (
              <div className="flex flex-row justify-center items-center space-x-2">
                <CircularProgress size="18px" color="primary" />
                <div>Collecting</div>
              </div>
            ) : (
              <div className="flex flex-row items-center space-x-2">
                <BsCollection className="w-5 h-5" />
                <p>Collect For Free</p>
              </div>
            )}
          </button>
        </div>
      )}
    </>
  )
}

export default FreeCollectPopUp
