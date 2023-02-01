import React, { useEffect, useState } from 'react'
import { MdOutlinePersonAddAlt } from 'react-icons/md'
import { useBalance } from 'wagmi'
import { useApprovedModuleAllowanceAmountQuery } from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import BottomDrawerWrapper from '../../Common/BottomDrawerWrapper'
import { useNotify } from '../../Common/NotifyContext'
import useLensFollowButton from '../../User/useLensFollowButton'
import AllowanceButton from './AllowanceButton'
import useCollectPublication from './useCollectPublication'

const FeeCollectDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  setIsCollected,
  setCollectCount,
  collectModule,
  publication,
  author,
  isCollected
}) => {
  if (collectModule.__typename !== 'FeeCollectModuleSettings') return null
  const { data: lensProfile } = useLensUserContext()
  const { collectPublication, isSuccess, loading } =
    useCollectPublication(collectModule)
  const { notifySuccess } = useNotify()
  const [isAllowed, setIsAllowed] = useState(true)
  const { data: allowanceData, isLoading: allowanceLoading } =
    useApprovedModuleAllowanceAmountQuery({
      request: {
        currencies: collectModule.amount.asset.address,
        followModules: [],
        collectModules: [collectModule.type],
        referenceModules: []
      }
    })

  useEffect(() => {
    setIsAllowed(
      allowanceData?.approvedModuleAllowanceAmount[0].allowance !== '0x00'
    )
  }, [allowanceData])
  useEffect(() => {
    if (!loading && isSuccess) {
      setIsCollected(true)
      setCollectCount((prev) => prev + 1)
      notifySuccess('Post has been collected, check your collection!')
    }
  }, [loading, isSuccess])

  const {
    isFollowedByMe,
    handleFollowProfile,
    loading: followLoading
  } = useLensFollowButton(author)

  const [hasAmount, setHasAmount] = useState(false)

  const { data: balanceData } = useBalance({
    address: lensProfile?.defaultProfile?.ownedBy,
    token: collectModule?.amount?.asset?.address,
    formatUnits: collectModule?.amount?.asset?.decimals,
    watch: true
  })

  useEffect(() => {
    if (
      balanceData &&
      parseFloat(balanceData?.formatted) <
        parseFloat(collectModule?.amount?.value)
    ) {
      setHasAmount(false)
    } else {
      setHasAmount(true)
    }
  }, [balanceData])
  return (
    <BottomDrawerWrapper
      setIsDrawerOpen={setIsDrawerOpen}
      isDrawerOpen={isDrawerOpen}
      showClose
    >
      <div className="font-bold text-lg mt-3 mb-2 flex items-center justify-center">
        Collect
      </div>
      <div>
        {collectModule.followerOnly && !isFollowedByMe && (
          <div className="flex flex-row justify-center items-center text-p-text">
            FOLLOW
            <button
              onClick={() => {
                handleFollowProfile(author.id)
              }}
              className="bg-p-btn text-p-btn-text rounded-full px-4 py-1 text-sm font-semibold"
            >
              {followLoading ? (
                'Following'
              ) : author.isFollowing ? (
                'Follow back'
              ) : (
                <MdOutlinePersonAddAlt className="w-5 h-5" />
              )}
            </button>
            <div>{author.handle} to collect this post</div>
          </div>
        )}
        {allowanceLoading && (
          <div className="text-p-text">loading allowance</div>
        )}

        {isAllowed && hasAmount ? (
          <>
            <div className="m-4 text-p-text ">
              Balance : {parseFloat(balanceData?.formatted)} | Gifting:{' '}
              {collectModule?.amount?.value}
            </div>
            <div className="m-4 text-p-text align-center">
              You can collect this post
            </div>
          </>
        ) : (
          <>
            {!isAllowed && (
              <AllowanceButton
                module={allowanceData?.approvedModuleAllowanceAmount[0]}
                allowed={isAllowed}
                setAllowed={setIsAllowed}
              />
            )}
            {!hasAmount && (
              <div className="text-p-text">
                Balance : {parseFloat(balanceData?.formatted)} | Required:{' '}
                {collectModule?.amount?.value}
              </div>
            )}
          </>
        )}
        <div className="px-4 w-full bg-s-bg mb-1 mt-1">
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
            className="bg-p-btn rounded-full text-center flex font-semibold text-p-text py-1 justify-center items-center text-p-text w-full text-xl"
          >
            Collect
          </button>
        </div>
      </div>
    </BottomDrawerWrapper>
  )
}

export default FeeCollectDrawer
