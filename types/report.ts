export type PostReportType = {
  _id?: string
  publicationId?: string
  communityId?: string
  reason?: string
  reportedBy?: string
  subReason?: string
  additionalComments?: string
  createdAt?: string
  updatedAt?: string
  isResolved?: boolean
  resolvedBy?: string
  [key: string]: any
}
