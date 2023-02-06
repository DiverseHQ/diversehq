import { CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BsCollection } from 'react-icons/bs'
import { RiUserFollowLine } from 'react-icons/ri'
import { useBalance } from 'wagmi'
import {
  CollectModule,
  Profile,
  Publication,
  PublicationMainFocus,
  useApprovedModuleAllowanceAmountQuery
} from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { LensInfuraEndpoint } from '../../../utils/config'
import { getURLsFromText } from '../../../utils/utils'
import { useNotify } from '../../Common/NotifyContext'
import ImageWithPulsingLoader from '../../Common/UI/ImageWithPulsingLoader'
import VideoWithAutoPause from '../../Common/UI/VideoWithAutoPause'
import useDevice from '../../Common/useDevice'
// import PopUpWrapper from '../../Common/PopUpWrapper'
import useLensFollowButton from '../../User/useLensFollowButton'
import ReactEmbedo from '../embed/ReactEmbedo'
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
  setIsCollecting: any
}
const FeeCollectPopUp = ({
  setIsCollected,
  setCollectCount,
  collectModule,
  publication,
  author,
  setIsDrawerOpen,
  setShowOptionsModal,
  setIsCollecting
}: Props) => {
  if (collectModule.__typename !== 'FeeCollectModuleSettings') return null
  const { data: lensProfile } = useLensUserContext()
  const { collectPublication, isSuccess, loading, error } =
    useCollectPublication(collectModule)
  const { notifySuccess, notifyError }: any = useNotify()
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
    if (allowanceLoading) return
    if (!allowanceData) return
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
      setIsCollecting(false)
    }
  }, [loading, isSuccess])

  useEffect(() => {
    if (error) {
      notifyError(error)
      setIsDrawerOpen(false)
      setShowOptionsModal(false)
      setIsCollecting(false)
    }
  }, [error])

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
      console.log(balanceData?.formatted, '----- USERS BALANCE ')
      console.log(
        collectModule?.amount?.asset?.address,
        '----- ASSET CONTRACT ADDRESS'
      )
      setHasAmount(false)
    } else {
      setHasAmount(true)
    }
  }, [balanceData])

  useEffect(() => {
    if (loading) {
      setIsCollecting(true)
    }
  }, [loading])

  const { isDesktop } = useDevice()

  const shortTitle = (title) => {
    if (title.length > 20) {
      return title.substring(0, 20) + '...'
    }
    return title
  }
  return (
    <>
      {isDesktop ? (
        <div className="grid w-96 min-h-48  shadow-p-btn">
          <div className="col-span-full row-span-full w-full h-[80px] flex flex-row justify-center space-x-6  ">
            <div className="flex flex-col  justify-center items-center mt-2">
              {collectModule.followerOnly && !isFollowedByMe && (
                <div className="flex flex-row  space-x-4">
                  <button
                    onClick={() => {
                      handleFollowProfile(author.id)
                    }}
                    className="bg-p-btn text-p-btn-text rounded-full px-4 py-1 text-sm font-semibold"
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
                  <p className="ml-1">To Collect the Post</p>
                </div>
              )}

              {allowanceLoading && (
                <div className="text-p-text flex flex-row space-x-1">
                  <CircularProgress size="18px" color="primary" />
                  <p>Loading Allowance</p>
                </div>
              )}

              {isAllowed && hasAmount ? (
                <>
                  <div className="m-1 text-p-text font-medium ">
                    Collect for {collectModule?.amount?.value}{' '}
                    {collectModule.amount?.asset?.symbol} <br></br>
                    <span>
                      Balance :{' '}
                      {parseFloat(
                        balanceData?.formatted ? balanceData?.formatted : '0'
                      )}{' '}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {!isAllowed && (
                    <div className="space-x-2 flex flex-row justify-center items-center">
                      <AllowanceButton
                        module={allowanceData?.approvedModuleAllowanceAmount[0]}
                        allowed={isAllowed}
                        setAllowed={setIsAllowed}
                      />
                      <div>to collect</div>
                    </div>
                  )}
                  {!hasAmount && isAllowed && (
                    <div className="text-p-text font-medium">
                      <p>
                        Collect for {collectModule?.amount?.value} {''}{' '}
                        {collectModule?.amount?.asset?.symbol}
                      </p>
                      <span>
                        In Wallet :{' '}
                        {parseFloat(
                          balanceData?.formatted ? balanceData?.formatted : '0'
                        )}{' '}
                        {collectModule?.amount?.asset?.symbol}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {isAllowed && hasAmount && (
              <button
                onClick={async (e) => {
                  e.stopPropagation()
                  await collectPublication(publication.id)
                }}
                disabled={
                  loading ||
                  (collectModule.__typename === 'FeeCollectModuleSettings' &&
                    collectModule.followerOnly &&
                    !isFollowedByMe)
                }
                className={`bg-p-btn text-p-btn-text rounded-md py-1.5 px-4 text-center  flex font-semibold text-p-text justify-center items-center h-10 self-center ${
                  !isAllowed ? 'hidden' : ''
                }`}
              >
                {loading ? (
                  <div className="flex flex-row justify-center items-center space-x-2">
                    <CircularProgress size="18px" color="primary" />
                    <p>Collecting</p>
                  </div>
                ) : (
                  <div className="flex flex-row items-center space-x-2">
                    <BsCollection className="w-5 h-5" />
                    <p>Collect</p>
                  </div>
                )}
              </button>
            )}
          </div>
          <div className="col-span-full row-span-full translate-y-1 bg-s-bg h-[4px] w-3 rounded self-end justify-self-center rounded-b-full border-b border-l border-r"></div>{' '}
        </div>
      ) : (
        <>
          <div className="m-2 self-start ">
            <h1 className="font-medium text-lg ">
              Post By u/{publication.profile?.handle}
            </h1>
            <p className="font-normal text-sm">
              {shortTitle(publication.metadata?.name)}
            </p>
          </div>
          <div className="flex items-center flex-col justify-center text-p-text">
            {collectModule.followerOnly && !isFollowedByMe && (
              <>
                <div className="flex flex-row  space-x-4">
                  <button
                    onClick={() => {
                      handleFollowProfile(author.id)
                    }}
                    className="bg-p-btn text-p-btn-text rounded-full px-4 py-1 text-sm font-semibold"
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
                  <p className="ml-1">To Collect the Post</p>
                </div>
              </>
            )}
            {allowanceLoading && (
              <div className="text-p-text flex flex-row Items-center">
                <CircularProgress size="18px" color="primary" />
                <p className="text-p-text ">Allowance loading</p>
              </div>
            )}

            {publication?.metadata?.media.length > 0 && (
              <div className="w-full px-4">
                {publication?.metadata?.mainContentFocus ===
                  PublicationMainFocus.Image && (
                  <ImageWithPulsingLoader
                    src={`${LensInfuraEndpoint}${
                      publication?.metadata?.media[0]?.original.url.split(
                        '//'
                      )[1]
                    }`}
                    className={`rounded-xl w-full mb-1 max-h-[300px] ${
                      (collectModule.followerOnly && !isFollowedByMe) ||
                      !isAllowed
                        ? 'hidden'
                        : ''
                    } `}
                  />
                )}
              </div>
            )}
            {publication?.metadata?.mainContentFocus ===
              PublicationMainFocus.Video && (
              <div className="w-full mb-1 px-4">
                <VideoWithAutoPause
                  src={`${LensInfuraEndpoint}${
                    publication?.metadata?.media[0]?.original.url.split('//')[1]
                  }`}
                  className={`image-unselectable object-contain rounded-xl w-full max-h-[300px] ${
                    (collectModule.followerOnly && !isFollowedByMe) ||
                    !isAllowed
                      ? 'hidden'
                      : ''
                  } `}
                  loop
                  controls
                  muted
                />
              </div>
            )}
            {publication?.metadata?.mainContentFocus !==
              PublicationMainFocus.Image &&
              publication?.metadata?.mainContentFocus !==
                PublicationMainFocus.Video &&
              getURLsFromText(publication?.metadata?.content).length > 0 && (
                <ReactEmbedo
                  url={getURLsFromText(publication?.metadata?.content)[0]}
                  className={`w-full pb-1 max-h-[300px] px-4 ${
                    (collectModule.followerOnly && !isFollowedByMe) ||
                    !isAllowed
                      ? 'hidden'
                      : ''
                  } `}
                />
              )}

            {isAllowed && hasAmount ? (
              <div className="text-p-text text-medium font-semibold">
                Balance : {parseFloat(balanceData?.formatted)} | Gifting:{' '}
                {collectModule?.amount?.value}
              </div>
            ) : (
              <>
                {!isAllowed && (
                  <div className="mb-2">
                    <div className="space-x-2 flex flex-row justify-center items-center">
                      <AllowanceButton
                        module={allowanceData?.approvedModuleAllowanceAmount[0]}
                        allowed={isAllowed}
                        setAllowed={setIsAllowed}
                      />
                      <div>to collect</div>
                    </div>
                  </div>
                )}
                {!hasAmount && (
                  <div className="text-p-text font-medium text-center justify-center mb-2">
                    Balance : {parseFloat(balanceData?.formatted)} | Required:{' '}
                    {collectModule?.amount?.value}
                  </div>
                )}
              </>
            )}
            {isAllowed && hasAmount && (
              <div className="px-4 w-full bg-s-bg mb-1 mt-1">
                <button
                  onClick={async (e) => {
                    e.stopPropagation()
                    await collectPublication(publication.id)
                  }}
                  disabled={
                    loading ||
                    (collectModule.__typename === 'FeeCollectModuleSettings' &&
                      collectModule.followerOnly &&
                      !isFollowedByMe)
                  }
                  className={`bg-p-btn rounded-full text-center flex font-semibold text-p-text py-1 justify-center items-center text-p-text w-full text-xl ${
                    !isAllowed ? 'hidden' : ''
                  }`}
                >
                  {/* { show circular progress when loading otherwise show the collect } */}
                  {loading ? (
                    <div className="flex flex-row justify-center items-center space-x-2">
                      <CircularProgress size="18px" color="primary" />
                      <p>Collecting</p>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center space-x-2">
                      <BsCollection className="w-5 h-5" />
                      <p>
                        Collect for {parseFloat(collectModule?.amount?.value)}
                        {''} {collectModule?.amount?.asset?.symbol}
                      </p>
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default FeeCollectPopUp
