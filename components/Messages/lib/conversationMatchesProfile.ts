import { XMTP_PREFIX } from '../../../utils/config'

const conversationMatchesProfile = (profileId: string) =>
  new RegExp(`${XMTP_PREFIX}/.*${profileId}`)

export default conversationMatchesProfile
