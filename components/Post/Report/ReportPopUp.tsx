import React from 'react'
import { reportPublicationToCommunityMods } from '../../../api/report'
import {
  ReportPublicationRequest,
  useReportPublicationMutation
} from '../../../graphql/generated'
import { usePopUpModal } from '../../Common/CustomPopUpProvider'
import { useNotify } from '../../Common/NotifyContext'
import PopUpWrapper from '../../Common/PopUpWrapper'
import FormTextArea from '../../Common/UI/FormTextArea'
import Reason from './Reason'

const ReportPopUp = ({
  publicationId,
  communityId,
  isLensCommunityPost
}: {
  publicationId: string
  communityId?: string
  isLensCommunityPost?: boolean
}) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [type, setType] = React.useState('')
  const [subReason, setSubReason] = React.useState('')
  const [additionalComments, setAdditionalComments] = React.useState('')
  const { hideModal } = usePopUpModal()
  const { notifyError, notifySuccess } = useNotify()
  const { mutateAsync: reportPublication } = useReportPublicationMutation()

  const handleSubmitReport = async () => {
    setIsLoading(true)
    try {
      let reportRequest: ReportPublicationRequest = {
        publicationId: publicationId,
        reason: {
          [type]: {
            reason: type.replace('Reason', '').toUpperCase(),
            subReason: subReason
          }
        },
        additionalComments: additionalComments
      }
      await reportPublication({
        request: reportRequest
      })
      if (!communityId) {
        notifySuccess('Reported to Lens.')
      }
      if (communityId) {
        await reportPublicationToCommunityMods({
          publicationId,
          [isLensCommunityPost ? 'lensCommunityId' : 'communityId']:
            communityId,
          reason: type.replace('Reason', '').toUpperCase(),
          subReason,
          additionalComments
        })
        notifySuccess('Reported to Lens and to community mods.')
      }
      hideModal()
    } catch (error) {
      console.log(error)
      notifyError('Something went wrong. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <PopUpWrapper
      title="Report Post"
      onClick={handleSubmitReport}
      label="Report"
      loading={isLoading}
      isDisabled={isLoading || subReason === ''}
    >
      <Reason
        setType={setType}
        setSubReason={setSubReason}
        type={type}
        subReason={subReason}
      />
      <div className="pt-3">
        {subReason && (
          <FormTextArea
            label="Additional Comments"
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
            placeholder="Please provide additional comments if you have any."
          />
        )}
      </div>
    </PopUpWrapper>
  )
}

export default ReportPopUp
