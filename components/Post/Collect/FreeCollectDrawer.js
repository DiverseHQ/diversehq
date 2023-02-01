import React, { useEffect } from 'react'
import BottomDrawerWrapper from '../../Common/BottomDrawerWrapper'
import { useNotify } from '../../Common/NotifyContext'
import useLensFollowButton from '../../User/useLensFollowButton'
import useCollectPublication from './useCollectPublication'
import { MdOutlinePersonAddAlt } from 'react-icons/md'
const FreeCollectDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  setIsCollected,
  setCollectCount,
  collectModule,
  publication,
  author,
  isCollected
}) => {
  const { collectPublication, isSuccess, loading } =
    useCollectPublication(collectModule)
  const { notifySuccess } = useNotify()

  const {
    isFollowedByMe,
    handleFollowProfile,
    loading: followLoading
  } = useLensFollowButton({ profileId: author.id })

  useEffect(() => {
    if (!loading && isSuccess) {
      setIsCollected(true)
      setCollectCount((prev) => prev + 1)
      notifySuccess('Post has been collected, check your collection!')
    }
  }, [loading, isSuccess])
  return (
    <>
      <BottomDrawerWrapper
        setIsDrawerOpen={setIsDrawerOpen}
        isDrawerOpen={isDrawerOpen}
        showClose
      >
        <div className=" flex items-center flex-col justify-center px-4 text-p-text">
          {collectModule.__typename === 'FreeCollectModuleSettings' &&
            !collectModule.followerOnly && (
              <div className="font-bold text-lg mt-3 mb-2">Free collect </div>
            )}
          {collectModule.__typename === 'FreeCollectModuleSettings' &&
            collectModule.followerOnly && (
              <>
                <div className="font-bold text-lg mt-3 mb-2">Free Collect</div>
                <div>
                  {isFollowedByMe ? (
                    <div className="font-semibold">
                      You are following {author.handle} and can collect for free
                    </div>
                  ) : (
                    <div className="flex justify-center items-center font-semibold mb-1">
                      <p>Follow {author.handle}, to collect it for Free</p>
                      <button
                        onClick={() => {
                          handleFollowProfile(author.id)
                        }}
                        className="ml-0.5 px-3"
                      >
                        {followLoading ? (
                          'Following'
                        ) : author.isFollowing ? (
                          'Follow back'
                        ) : (
                          <MdOutlinePersonAddAlt className="w-5 h-5" />
                        )}
                      </button>
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
                !isFollowedByMe) ||
              isCollected
            }
            className="bg-p-btn text-p-btn-text rounded-full text-center flex font-semibold text-p-text py-1 justify-center items-center text-p-text w-full text-xl m-1"
          >
            Collect
          </button>
        </div>
      </BottomDrawerWrapper>
    </>
  )
}

export default FreeCollectDrawer
