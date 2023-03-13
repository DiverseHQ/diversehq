import Link from 'next/link'
import React from 'react'
import ReactTimeAgo from 'react-time-ago'
import { addBannedUserToCommunity } from '../../../../api/community'
import { resolvePublicationReport } from '../../../../api/report'
import { BannedUser, CommunityType } from '../../../../types/community'
import { postWithCommunityInfoType } from '../../../../types/post'
import { PostReportType } from '../../../../types/report'
import { resolveActions } from '../../../../utils/config'
import { useNotify } from '../../../Common/NotifyContext'
import ImageWithPulsingLoader from '../../../Common/UI/ImageWithPulsingLoader'
import LensPostCard from '../../../Post/LensPostCard'
import formatHandle from '../../../User/lib/formatHandle'
import getAvatar from '../../../User/lib/getAvatar'

interface Props {
  report: PostReportType
  publication: postWithCommunityInfoType
  fetchAndSetUnResolvedReprots: () => void
  community: CommunityType
}

const LensReportPost = ({
  report,
  publication,
  fetchAndSetUnResolvedReprots,
  community
}: Props) => {
  const { notifyInfo, notifyError } = useNotify()
  const [showBanUserModal, setShowBanUserModal] = React.useState(false)
  const [extraReason, setExtraReason] = React.useState<string>('')
  const [ruleViolated, setRuleViolated] = React.useState<string>(
    community?.rules[0]?.title ?? null
  )
  if (!report) return null
  const handleIgnore = async () => {
    await resolvePublicationReport(
      report._id,
      publication?.communityInfo?._id,
      resolveActions.IGNORE
    )
    fetchAndSetUnResolvedReprots()
  }

  const handleBanUser = async () => {
    try {
      const bannedUser: BannedUser = {
        address: publication.profile.ownedBy,
        profileId: publication.profile.id,
        reason: `Violated rule : ${ruleViolated} \n Other Reason : ${extraReason}`
      }
      const res = await addBannedUserToCommunity(community?.name, bannedUser)
      if (res.status === 200) {
        setShowBanUserModal(false)
        fetchAndSetUnResolvedReprots()
      } else {
        const resJson = await res.json()
        notifyInfo(resJson.msg)
      }
      await resolvePublicationReport(
        report._id,
        publication?.communityInfo?._id,
        resolveActions.BAN_USER
      )
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }

  const handleHidePost = async () => {
    notifyInfo('This feature is comming soon')
    // todo
    // await resolvePublicationReport(
    //   reportId,
    //   publication?.communityInfo?._id,
    //   resolveActions.HIDE_POST
    // )
  }
  return (
    <div key={publication.id}>
      <div className="pt-6 mx-6">
        <div className="text-xs leading-4">
          Reported by{' '}
          <span className="font-medium">{report.reportedBy.length}</span>{' '}
          {`${report.reportedBy.length > 1 ? 'members' : 'member'}`}
        </div>
        <div className="text-xs leading-4">
          Reason - {report.reason.toLowerCase()} &{' '}
          {report.subReason.toLowerCase()}, {report.additionalComments}
        </div>
        <div className="text-xs leading-4">
          Last Reported{' '}
          <ReactTimeAgo
            timeStyle="twitter"
            // @ts-ignore
            date={report.updatedAt}
          />
        </div>
        <div className="text-xs text-s-text pt-1.5 pb-0.5">Resolve Actions</div>
        {/* actions buttons */}
        <div className="flex flex-row items-center space-x-2 pb-2">
          <button
            onClick={handleIgnore}
            className="text-p-text border-2 border-p-border font-medium rounded-xl px-3 py-1"
          >
            Ignore
          </button>
          {!showBanUserModal && (
            <button
              onClick={() => {
                setShowBanUserModal(true)
              }}
              className="bg-red-400 text-p-btn-text font-medium rounded-xl px-3 py-1"
            >
              Ban User
            </button>
          )}
          <button
            onClick={handleHidePost}
            className="bg-blue-400 text-p-btn-text font-medium rounded-xl px-3 py-1"
          >
            Hide Post
          </button>
        </div>

        {showBanUserModal && (
          <div className="rounded-xl w-full sm:w-[500px] bg-s-bg border border-s-border p-3 space-y-2">
            {/* banned user info */}
            <div className="flex flex-row items-center space-x-1.5">
              <div className="font-medium pr-1">Ban </div>

              <ImageWithPulsingLoader
                className="w-6 h-6 rounded-full"
                src={getAvatar(publication.profile)}
              />
              {publication.profile?.name && (
                <div className="font-medium">{publication.profile.name}</div>
              )}
              <Link href={`/u/${formatHandle(publication.profile.handle)}`}>
                <span className="cursor-pointer hover:underline text-s-text">
                  u/{formatHandle(publication.profile.handle)}
                </span>
              </Link>
            </div>

            {/* select rule violation */}
            <div>
              <div className="text-sm">
                Select the rule that the user violated. This will be shown to
                the user as a reason of ban.
              </div>
              <select
                onChange={(e) => {
                  setRuleViolated(e.target.value)
                }}
                value={ruleViolated}
                placeholder="Select rule violated"
                className="w-full p-2 border border-s-border rounded-xl mt-2 text-sm"
              >
                {community?.rules?.map((rule, index) => (
                  <option
                    key={rule.title}
                    className="w-[500px]"
                    value={rule.title}
                  >
                    Rule{index + 1} : {rule.title}
                  </option>
                ))}
              </select>
            </div>

            {/* extra reason */}
            <div>
              <input
                type="text"
                placeholder="(Optional) Any addition reason or last words of advice.. ?"
                className="w-full p-2 border border-s-border rounded-xl mt-2 text-sm"
                onChange={(e) => setExtraReason(e.target.value)}
              />
            </div>

            {/* ban button and cancel button */}
            <div className="flex flex-row items-center space-x-2">
              <button
                className="bg-s-bg text-p-text border border-s-border rounded-xl p-2 w-full text-sm"
                onClick={() => {
                  setShowBanUserModal(false)
                }}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-p-btn-text font-bold tracking-wider border border-p-base rounded-xl p-2 w-full text"
                onClick={handleBanUser}
              >
                Ban
              </button>
            </div>
          </div>
        )}
      </div>
      <LensPostCard key={publication.id} post={publication} />
    </div>
  )
}

export default LensReportPost
