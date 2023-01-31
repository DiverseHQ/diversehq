import React, { useEffect, useState } from 'react'
import { MdOutlinePersonAddAlt } from 'react-icons/md'
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
    <div className="lg:w-[350px] flex flex-col justify-center items-center p-8 rounded-2xl">
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
      {allowanceLoading && <div className="text-p-text">loading allowance</div>}

      {isAllowed && hasAmount ? (
        <>
          <div className="m-1 text-p-text">
            Balance : {parseFloat(balanceData?.formatted)} | Gifting:{' '}
            {collectModule?.amount?.value}
          </div>
          <div className=" text-p-text">You can collect this post</div>
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
        className="bg-p-btn text-p-btn-text rounded-full text-center flex font-semibold text-p-text py-1 px-2 justify-center items-center text-p-text m-1"
      >
        Collect
      </button>
    </div>
  )
}

export default FeeCollectPopUp
