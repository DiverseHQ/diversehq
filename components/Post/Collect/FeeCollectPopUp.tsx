import React, { useEffect, useState } from 'react'
import { useBalance } from 'wagmi'
import {
  CollectModule,
  Profile,
  Publication,
  useApprovedModuleAllowanceAmountQuery
} from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { usePopUpModal } from '../../Common/CustomPopUpProvider'
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
}
const FeeCollectPopUp = ({
  setIsCollected,
  setCollectCount,
  collectModule,
  publication,
  author
}: Props) => {
  console.log('FeeCollectPopUp', collectModule)
  if (collectModule.__typename !== 'FeeCollectModuleSettings') return null
  const { data: lensProfile } = useLensUserContext()
  const { collectPublication, isSuccess, loading } =
    useCollectPublication(collectModule)
  const { notifySuccess }: any = useNotify()
  const { hideModal }: any = usePopUpModal()
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
      hideModal()
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
    <>
      <h1>{`Collect and Gift ${
        publication.collectModule.__typename === 'FeeCollectModuleSettings' &&
        publication.collectModule.amount.value
      } ${
        publication.collectModule.__typename === 'FeeCollectModuleSettings' &&
        publication.collectModule.amount.asset.symbol
      }`}</h1>
      {collectModule.followerOnly && !isFollowedByMe && (
        <div className="flex flex-row items-center text-p-text">
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
          <div>{author.handle} to collect this post</div>
        </div>
      )}
      {allowanceLoading && <div className="text-p-text">loading allowance</div>}

      {isAllowed && hasAmount ? (
        <>
          <div className="m-4 text-p-text">
            Balance : {parseFloat(balanceData?.formatted)} | Gifting:{' '}
            {collectModule?.amount?.value}
          </div>
          <div className="m-4 text-p-text">You can collect this post</div>
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
      <button
        onClick={async () => {
          await collectPublication(publication.id)
        }}
        disabled={
          loading ||
          (collectModule.followerOnly && !isFollowedByMe) ||
          !isAllowed ||
          !hasAmount
        }
      >
        Collect
      </button>
    </>
  )
}

export default FeeCollectPopUp
