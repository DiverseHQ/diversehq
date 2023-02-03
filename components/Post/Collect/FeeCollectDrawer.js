import { CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { MdOutlinePersonAddAlt } from 'react-icons/md'
import { RiUserFollowLine } from 'react-icons/ri'
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
  } = useLensFollowButton({ profileId: author.id })

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
          <div className="flex flex-row  space-x-4">
            <button
              onClick={() => {
                handleFollowProfile(author.id)
              }}
              className="bg-p-btn text-p-btn-text rounded-full px-4 py-1 text-sm font-semibold"
            >
              {loading ? (
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
            <p className="ml-1">To Collect the Post</p>
          </div>
        )}
        {allowanceLoading && (
          <div className="text-p-text flex flex-row Items-center">
            <CircularProgress size="18px" color="primary" />
            <p className='text-p-text '>Alllowance loading</p>
          </div>
        )}

        {isAllowed && hasAmount ? (
          <div className='flex flex-col font-medium items-center'>
            <div className="m-4 text-p-text ">
              Balance : {parseFloat(balanceData?.formatted)} | Gifting:{' '}
              {collectModule?.amount?.value}
            </div>
            <div className="m-4 text-p-text align-center">
              You can collect this post
            </div>
          </div>
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
              <div className="text-p-text font-medium text-center justify-center mb-2">
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
            {loading ? (
              <div className="flex flex-row justify-center items-center space-x-2">
                <CircularProgress size="18px" color="primary" />
                <p>Collecting ...</p>
              </div>
            ) : (
              <p>Collect</p>
            )}
          </button>
        </div>
      </div>
    </BottomDrawerWrapper>
  )
}

export default FeeCollectDrawer
