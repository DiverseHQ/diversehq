import React, { useEffect } from 'react'
import { CollectModule, Profile, Publication } from '../../../graphql/generated'
import PopUpWrapper from '../../Common/PopUpWrapper'
import useCollectPublication from './useCollectPublication'
import useLensFollowButton from '../../User/useLensFollowButton'
import { usePopUpModal } from '../../Common/CustomPopUpProvider'
import { useNotify } from '../../Common/NotifyContext'

type Props = {
  setIsCollected: any
  setCollectCount: any
  collectModule: CollectModule
  publication: Publication
  author: Profile
}

const FreeCollectPopUp = ({
  setIsCollected,
  setCollectCount,
  collectModule,
  publication,
  author
}: Props) => {
  const { collectPublication, isSuccess, loading } =
    useCollectPublication(collectModule)
  const { notifySuccess }: any = useNotify()
  const { hideModal }: any = usePopUpModal()

  useEffect(() => {
    if (!loading && isSuccess) {
      setIsCollected(true)
      setCollectCount((prev: number) => prev + 1)
      notifySuccess('Post has been collected, check your collection!')
      hideModal()
    }
  }, [loading, isSuccess])

  const {
    isFollowedByMe,
    handleFollowProfile,
    loading: followLoading
  } = useLensFollowButton(author)
  return (
    <PopUpWrapper
      title="Free Collect"
      isDisabled={
        loading ||
        (collectModule.__typename === 'FreeCollectModuleSettings' &&
          collectModule.followerOnly &&
          !isFollowedByMe)
      }
      loading={loading}
      label="Collect"
      onClick={async () => {
        await collectPublication(publication.id)
      }}
    >
      <div className="px-4 text-p-text">
        {collectModule.__typename === 'FreeCollectModuleSettings' &&
          !collectModule.followerOnly && (
            <div className="">Free collect for everyone</div>
          )}
        {collectModule.__typename === 'FreeCollectModuleSettings' &&
          collectModule.followerOnly && (
            <>
              <div className="">
                Free collect for those who follow {author.handle}
              </div>
              <div>
                {isFollowedByMe ? (
                  <div className="">
                    You are following {author.handle} and can collect for free
                  </div>
                ) : (
                  <>
                    <div className="">
                      You are not following {author.handle}, follow to collect
                      for free
                    </div>

                    <button
                      onClick={() => {
                        handleFollowProfile(author.id)
                      }}
                      className="bg-p-btn text-p-btn-text rounded-full px-4 py-1 text-sm font-semibold"
                    >
                      {followLoading
                        ? 'Following'
                        : author.isFollowing
                        ? 'Follow back'
                        : 'Follow'}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
      </div>
    </PopUpWrapper>
  )
}

export default FreeCollectPopUp