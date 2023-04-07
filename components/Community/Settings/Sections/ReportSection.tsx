import React from 'react'
import { getUnresolvedPublicationReportsOfCommunity } from '../../../../api/report'
import { useLensUserContext } from '../../../../lib/LensUserContext'
import { CommunityType } from '../../../../types/community'
import { PostReportType } from '../../../../types/report'
import { useNotify } from '../../../Common/NotifyContext'

import usePublicationWithCommunityInfo from '../../hook/usePublicationWithCommunityInfo'
import LensReportPost from './LensReportPost'
const ReportSection = ({
  community,
  isLensCommunity = false
}: {
  community: CommunityType
  isLensCommunity?: boolean
}) => {
  const { data: lensProfile } = useLensUserContext()
  const [rawReports, setRawReports] = React.useState<PostReportType[]>([])
  const { notifyError } = useNotify()

  const { isLoading, publications } = usePublicationWithCommunityInfo({
    request: {
      publicationIds: rawReports.map((report) => report.publicationId)
    },
    profileId: lensProfile?.defaultProfile?.id,
    reactionRequest: {
      profileId: lensProfile?.defaultProfile?.id
    }
  })

  const fetchAndSetUnResolvedReprots = async () => {
    try {
      const res = await getUnresolvedPublicationReportsOfCommunity(
        community?._id
      )
      if (res.status === 200) {
        const result = await res.json()
        setRawReports(result)
      } else {
        notifyError('Something went wrong')
      }
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong')
    }
  }

  React.useEffect(() => {
    fetchAndSetUnResolvedReprots()
  }, [])

  return (
    <div className="p-2 w-full sm:p-3 space-y-2 min-h-[500px]">
      <div className="font-medium leading-3">UnResolved Reported Posts</div>
      <div className="text-xs text-s-text leading-4">
        Hit ignore to remove the post from the reported list, hit ban user to
        ban the post author from the community or hit hide post to hide the post
        from the community.
      </div>
      {isLoading && (
        <div className="flex flex-row items-center justify-center space-x-2">
          <div className="w-4 h-4 border-t-2 border-p-btn rounded-full animate-spin" />
          <div className="text-sm text-s-text">Loading...</div>
        </div>
      )}
      <div className="sm:rounded-2xl bg-s-bg sm:border-[1px] border-s-border overflow-hidden">
        {publications?.length > 0 &&
          publications.map((publication) => (
            <LensReportPost
              key={publication.id}
              publication={publication}
              report={rawReports.find(
                (report) => report.publicationId === publication.id
              )}
              fetchAndSetUnResolvedReprots={fetchAndSetUnResolvedReprots}
              community={community}
              isLensCommunity={isLensCommunity}
            />
          ))}
      </div>
    </div>
  )
}

export default ReportSection
