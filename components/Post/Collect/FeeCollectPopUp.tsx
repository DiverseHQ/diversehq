import { CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { MdOutlinePersonAddAlt } from 'react-icons/md'
import { RiUserFollowLine } from 'react-icons/ri'
import { useBalance } from 'wagmi'
import {
  CollectModule,
  Profile,
  Publication,
  useApprovedModuleAllowanceAmountQuery
} from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { useNotify } from '../../Common/NotifyContext'
// import PopUpWrapper from '../../Common/PopUpWrapper'
import useLensFollowButton from '../../User/useLensFollowButton'
import AllowanceButton from './AllowanceButton'
import useCollectPublication from './useCollectPublication'

type Props = {
  setIsCollected: any
  setCollectCount: any
  collectModule: CollectModule
  publication: Publication
  author: Profile
  setIsDrawerOpen: any
  setShowOptionsModal: any
}
const FeeCollectPopUp = ({
  setIsCollected,
  setCollectCount,
  collectModule,
  publication,
  author,
  setIsDrawerOpen,
  setShowOptionsModal
}: Props) => {
  console.log('FeeCollectPopUp', collectModule)
  if (collectModule.__typename !== 'FeeCollectModuleSettings') return null
  const { data: lensProfile } = useLensUserContext()
  const { collectPublication, isSuccess, loading } =
    useCollectPublication(collectModule)
  const { notifySuccess }: any = useNotify()
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
    <div className="grid w-96 min-h-48  shadow-p-btn">
      <div className="col-span-full row-span-full w-full h-[80px] flex flex-row   ">
        <div className="flex flex-col items-start mt-2">
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
            <div className="text-p-text">loading allowance</div>
          )}

          {isAllowed && hasAmount ? (
            <>
              <div className="m-1 text-p-text font-medium mx-12">
                Collect for {collectModule?.amount?.value} WMATIC <br></br>
                <span>Balance : {parseFloat(balanceData?.formatted)} </span>
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
                <div className="text-p-text font-medium mx-12 ">
                  Collect for {''}
                  {collectModule?.amount?.value} {''} WMATIC <br />
                  Required: {collectModule?.amount?.value}
                </div>
              )}
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
          className="bg-p-btn text-p-btn-text rounded-md py-1.5 px-4 text-center w-20 flex font-semibold text-p-text justify-center items-center h-10 self-center"
        >
          {loading ? (
            <div className="flex flex-row justify-center items-center space-x-2">
              <CircularProgress size="18px" color="primary" />
              <p>Collecting</p>
            </div>
          ) : (
            <p>Collect</p>
          )}
        </button>
      </div>
      <div className="col-span-full row-span-full translate-y-1 bg-s-bg h-[4px] w-3 rounded self-end justify-self-center rounded-b-full border-b border-l border-r"></div>{' '}
    </div>
  )
}

export default FeeCollectPopUp
