import React, { useEffect } from 'react'
import { CollectModule, Profile, Publication } from '../../../graphql/generated'
import useCollectPublication from './useCollectPublication'
import useLensFollowButton from '../../User/useLensFollowButton'
import { useNotify } from '../../Common/NotifyContext'
import { MdOutlinePersonAddAlt } from 'react-icons/md'
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
      setIsCollected(true)
      setCollectCount((prev: number) => prev + 1)
      notifySuccess('Post has been collected, check your collection!')
      setIsDrawerOpen(false)
      setShowOptionsModal(false)
    }
  }, [loading, isSuccess])

  const {
    isFollowedByMe,
    handleFollowProfile,
    loading: followLoading
  } = useLensFollowButton({ profileId: author.id })
  return (
    <div className="lg:w-[350px] flex flex-col justify-center items-center p-8 rounded-2xl">
      <div className="px-4 text-p-text">
        {collectModule.__typename === 'FreeCollectModuleSettings' &&
          !collectModule.followerOnly && (
            <div className="font-semibold">Free collect for everyone</div>
          )}
        {collectModule.__typename === 'FreeCollectModuleSettings' &&
          collectModule.followerOnly && (
            <>
              <div>
                {isFollowedByMe ? (
                  <div className="">
                    You are following {author.handle} and can collect for free
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
                        disabled={followLoading || isFollowedByMe}
                        className=" py-1 text-sm font-semibold mx-1"
                      >
                        {followLoading ? (
                          'Following'
                        ) : author.isFollowing ? (
                          'Follow back'
                        ) : (
                          <MdOutlinePersonAddAlt className="w-5 h-5" />
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
          await collectPublication(publication.id)
        }}
        disabled={
          loading ||
          (collectModule.__typename === 'FreeCollectModuleSettings' &&
            collectModule.followerOnly &&
            !isFollowedByMe)
        }
        className="bg-p-btn text-p-btn-text rounded-full text-center flex font-semibold text-p-text py-1 px-2 justify-center items-center text-p-text m-1 "
      >
        Collect
      </button>
    </div>
  )
}

export default FreeCollectPopUp
