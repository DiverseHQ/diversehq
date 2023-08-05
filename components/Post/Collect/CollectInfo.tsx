import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { AiOutlineRetweet } from 'react-icons/ai'
import { BiTimeFive } from 'react-icons/bi'
import { BsCollection } from 'react-icons/bs'
import { MdGroup } from 'react-icons/md'
import { useAccount, useBalance } from 'wagmi'
import {
  ApprovedAllowanceAmount,
  CollectModules,
  useApprovedModuleAllowanceAmountQuery
} from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import getTokenImage from '../../../lib/getTokenImage'
import { stringToLength } from '../../../utils/utils'
import { usePopUpModal } from '../../Common/CustomPopUpProvider'
import { useNotify } from '../../Common/NotifyContext'
import Markup from '../../Lexical/Markup'
import Attachment from '../Attachment'
import WhoCollectedPublicationPopUp from '../whoWasIt/WhoCollectedPublicationPopUp'
import AllowanceButton from './AllowanceButton'
import Splits from './Splits'
import Uniswap from './Uniswap'
import useCollectPublication from './useCollectPublication'

const CollectInfo = ({
  publication,
  setCollectCount,
  setIsCollected,
  isCollected,
  collectCount
}) => {
  console.log(publication?.collectModule)
  const { showModal, hideModal } = usePopUpModal()
  const { address } = useAccount()
  const [allowed, setAllowed] = useState(true)
  const { data: lensProfile } = useLensUserContext()
  const { notifySuccess, notifyError } = useNotify()

  const collectModule: any = publication?.collectModule

  const endTimestamp =
    collectModule?.endTimestamp ?? collectModule?.optionalEndTimestamp
  const collectLimit =
    collectModule?.collectLimit ?? collectModule?.optionalCollectLimit
  const amount =
    collectModule?.amount?.value ?? collectModule?.fee?.amount?.value
  const currency =
    collectModule?.amount?.asset?.symbol ??
    collectModule?.fee?.amount?.asset?.symbol
  const assetAddress =
    collectModule?.amount?.asset?.address ??
    collectModule?.fee?.amount?.asset?.address
  const assetDecimals =
    collectModule?.amount?.asset?.decimals ??
    collectModule?.fee?.amount?.asset?.decimals
  const referralFee =
    collectModule?.referralFee ?? collectModule?.fee?.referralFee
  const isMultirecipientFeeCollectModule =
    collectModule?.type === CollectModules.MultirecipientFeeCollectModule
  const isFreeCollectModule =
    collectModule?.type === CollectModules.FreeCollectModule
  const isSimpleFreeCollectModule =
    collectModule?.type === CollectModules.SimpleCollectModule && !amount

  const isCollectExpired = endTimestamp
    ? new Date(endTimestamp).getTime() / 1000 < new Date().getTime() / 1000
    : false

  let remainingTimeString = null

  if (endTimestamp && !isCollectExpired) {
    const remainingTime = dayjs(endTimestamp).diff(dayjs(), 'second')
    const remainingDays = Math.floor(remainingTime / 86400)
    remainingTimeString =
      remainingDays > 0
        ? `${remainingDays}d ${Math.floor((remainingTime % 86400) / 3600)}h`
        : `${Math.floor(remainingTime / 3600)}h ${Math.floor(
            (remainingTime % 3600) / 60
          )}m`
  }

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address,
    token: assetAddress,
    formatUnits: assetDecimals,
    watch: true
  })

  const { data: allowanceData, isLoading: allowanceLoading } =
    useApprovedModuleAllowanceAmountQuery({
      request: {
        currencies: assetAddress,
        followModules: [],
        collectModules: [collectModule.type],
        referenceModules: []
      }
    })

  useEffect(() => {
    if (allowanceLoading) return
    if (!allowanceData) return
    setAllowed(
      allowanceData?.approvedModuleAllowanceAmount[0].allowance !== '0x00'
    )
  }, [allowanceData])

  const { collectPublication, isSuccess, loading, error } =
    useCollectPublication(collectModule)

  useEffect(() => {
    if (error) {
      notifyError(error)
    }
  }, [error])

  useEffect(() => {
    if (!loading && isSuccess) {
      setIsCollected(true)
      setCollectCount((prev: number) => prev + 1)
      notifySuccess('Post has been collected, check you collection!')
      hideModal()
    }
  }, [loading, isSuccess])

  let hasAmount = false
  if (balanceData && parseFloat(balanceData?.formatted) < parseFloat(amount)) {
    hasAmount = false
  } else {
    hasAmount = true
  }

  const isLimitedCollectAllCollected = collectLimit
    ? collectCount >= parseInt(collectLimit)
    : false

  return (
    <div className="px-6 pb-3 text-p-text flex flex-col gap-y-1">
      <div className="mb-1 self-start text-xl">
        <Markup>{stringToLength(publication.metadata?.content, 150)}</Markup>
      </div>
      {publication?.metadata?.media.length > 0 && (
        <div className="w-full mb-1">
          <Attachment
            publication={publication}
            attachments={publication?.metadata?.media}
            className="w-full max-h-[300px] rounded-xl"
          />
        </div>
      )}

      {/* total collectors number  */}
      <div
        className="start-row cursor-pointer"
        onClick={() => {
          showModal({
            component: (
              <WhoCollectedPublicationPopUp publicationId={publication?.id} />
            )
          })
        }}
      >
        <MdGroup className="mr-2 w-5 h-5" />
        <div>
          {`${
            publication?.collectModule?.optionalCollectLimit
              ? `${collectCount}/${collectLimit}`
              : `${collectCount}`
          } Collected`}
        </div>
      </div>

      {/* available till */}
      {endTimestamp && !isCollectExpired && (
        <div className="start-row">
          <BiTimeFive className="mr-2 w-5 h-5" />
          <div>
            {`Available till ${dayjs(endTimestamp).format(
              'MMMM DD, YYYY'
            )} ${dayjs(endTimestamp).format(
              'hh:mm a'
            )} ( ${remainingTimeString} remaining )`}
          </div>
        </div>
      )}

      {/* referral fee */}
      {referralFee !== 0 &&
        referralFee !== '0' &&
        referralFee &&
        referralFee !== 'undefined' && (
          <div className="start-row">
            <AiOutlineRetweet className="mr-2 w-5 h-5" />
            <div>{`Mirror & earn ${referralFee}% on collect`}</div>
          </div>
        )}

      {isMultirecipientFeeCollectModule && (
        <Splits recipients={collectModule?.recipients} />
      )}

      {amount ? (
        <div className="flex items-center space-x-1.5 py-1 sm:py-2">
          <img
            className="h-6 w-6"
            height={28}
            width={28}
            src={getTokenImage(currency)}
            alt={currency}
            title={currency}
          />
          <span className="space-x-1">
            <span className="text-2xl font-bold">{amount}</span>
            <span className="text-xs">{currency}</span>
          </span>
        </div>
      ) : (
        <div className="flex items-center space-x-1.5 py-1 sm:py-2">
          <span className="text-2xl font-bold">Free</span>
        </div>
      )}

      <div className="flex items-center space-x-2">
        {lensProfile?.defaultProfile &&
        (!isCollected ||
          (!isFreeCollectModule && !isSimpleFreeCollectModule)) ? (
          (allowanceLoading || balanceLoading) &&
          !isFreeCollectModule &&
          !isSimpleFreeCollectModule ? (
            <div className="animate-pulse bg-p-btn mt-5 h-[34px] w-28 rounded-lg" />
          ) : allowed ? (
            hasAmount ? (
              !isLimitedCollectAllCollected && !isCollectExpired ? (
                <button
                  onClick={async (e) => {
                    e.stopPropagation()
                    await collectPublication(publication?.id)
                  }}
                  disabled={loading || isCollectExpired}
                  className={`bg-p-btn text-p-btn-text py-1 px-4 text-xl rounded-full sm:rounded-md font-semibold sm:w-fit w-full centered-row`}
                >
                  {loading ? (
                    <div className="start-row">
                      <div className="h-4 w-4 border-p-btn-text spinner" />
                      <div className="ml-2">Collecting...</div>
                    </div>
                  ) : (
                    <div className="start-row">
                      <BsCollection className="mr-2 w-5 h-5" />
                      <div>Collect</div>
                    </div>
                  )}
                </button>
              ) : null
            ) : (
              <Uniswap module={collectModule} />
            )
          ) : (
            <AllowanceButton
              module={
                allowanceData
                  ?.approvedModuleAllowanceAmount[0] as ApprovedAllowanceAmount
              }
              allowed={allowed}
              setAllowed={setAllowed}
            />
          )
        ) : null}
        {isCollected && (
          <div className="text-sm sm:text-base">
            You have collected this post
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectInfo
