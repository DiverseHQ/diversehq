import React, { useEffect } from 'react'
import { CollectModule, Profile, Publication } from '../../../graphql/generated'
import useCollectPublication from './useCollectPublication'
import useLensFollowButton from '../../User/useLensFollowButton'
import { useNotify } from '../../Common/NotifyContext'
import { CircularProgress } from '@mui/material'
import { RiUserFollowLine } from 'react-icons/ri'
import useDevice from '../../Common/useDevice'
type Props = {
  setIsCollected: any
  setCollectCount: any
  collectModule: CollectModule
  publication: Publication
  author: Profile
  setIsDrawerOpen: any
  setShowOptionsModal: any
}

const FreeCollectPopUp = ({
  setIsCollected,
  setCollectCount,
  collectModule,
  publication,
  author,
  setIsDrawerOpen,
  setShowOptionsModal
}: Props) => {
  const { collectPublication, isSuccess, loading } =
    useCollectPublication(collectModule)
  const { notifySuccess }: any = useNotify()
  useEffect(() => {
    if (!loading && isSuccess) {
      console.log('--- post collected successfully ---')
      notifySuccess('Post has been collected, check your collection!')
      setIsCollected(true)
      setCollectCount((prev: number) => prev + 1)
      setIsDrawerOpen(false)
      setShowOptionsModal(false)
    }
  }, [loading, isSuccess])

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
                  <div className="font-semibold">Free collect for everyone</div>
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
              onClick={async () => {
                console.log('--- collect button clicked ---')
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
                <div>Collect</div>
              )}
            </button>
            {/* </div> */}
          </div>
          <div className="col-span-full row-span-full translate-y-1 bg-s-bg  h-[4px] w-3 rounded self-end justify-self-center rounded-b-full border-b border-l border-r"></div>
        </div>
      ) : (
        <div className=" flex items-center flex-col justify-center px-4 text-p-text">
          {collectModule?.__typename === 'FreeCollectModuleSettings' &&
            !collectModule.followerOnly && (
              <div className="font-bold text-lg mt-3 mb-2">Free collect </div>
            )}
          {collectModule?.__typename === 'FreeCollectModuleSettings' &&
            collectModule.followerOnly && (
              <>
                <div className="font-bold text-lg mt-3 mb-2">Free Collect</div>
                <div>
                  {isFollowedByMe ? (
                    <div className="font-semibold">
                      You are following {author.handle} and can collect for free
                    </div>
                  ) : (
                    <div className="flex flex-row items-center justify-center space-x-2 mb-2 font-medium">
                      <button
                        onClick={() => {
                          handleFollowProfile(author.id)
                        }}
                        className="bg-p-btn text-p-btn-text rounded-full px-4 py-1 text-sm font-semibold "
                      >
                        {followLoading ? (
                          <div className="flex flex-row justify-center items-center space-x-2">
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
                </div>
              </>
            )}
          <button
            onClick={async () => {
              await collectPublication(publication.id)
            }}
            disabled={
              loading ||
              (collectModule.__typename === 'FreeCollectModuleSettings' &&
                collectModule.followerOnly &&
                !isFollowedByMe)
            }
            className="bg-p-btn text-p-btn-text rounded-full text-center flex font-semibold text-p-text py-1 justify-center items-center text-p-text w-full text-xl m-1"
          >
            Collect
          </button>
        </div>
      )}
    </>
  )
}

export default FreeCollectPopUp
