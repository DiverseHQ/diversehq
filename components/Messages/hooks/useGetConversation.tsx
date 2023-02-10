import { Client } from '@xmtp/xmtp-js'
import { useEffect, useState } from 'react'
import { Profile } from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { useMessageStore } from '../../../store/message'
import { XMTP_ENV } from '../../../utils/config'
import { parseConversationKey } from '../lib/conversationKey'

const useGetConversation = (conversationKey: string, profile?: Profile) => {
  const { data: lensProfile } = useLensUserContext()
  const client = useMessageStore((state) => state.client)
  const selectedConversation = useMessageStore((state) =>
    state.conversations.get(conversationKey)
  )
  const addConversation = useMessageStore((state) => state.addConversation)
  const [missingXmtpAuth, setMissingXmtpAuth] = useState<boolean>()

  const reset = () => {
    setMissingXmtpAuth(false)
  }

  useEffect(() => {
    if (!profile || !client) {
      return
    }
    if (selectedConversation) {
      setMissingXmtpAuth(false)
      return
    }
    const createNewConversation = async () => {
      const conversationId =
        parseConversationKey(conversationKey)?.conversationId
      const canMessage = await Client.canMessage(profile.ownedBy, {
        env: XMTP_ENV
      })
      setMissingXmtpAuth(!canMessage)

      if (!canMessage || !conversationId) {
        return
      }
      const conversation = await client.conversations.newConversation(
        profile.ownedBy,
        {
          conversationId: conversationId,
          metadata: {}
        }
      )
      addConversation(conversationKey, conversation)
    }
    createNewConversation()
  }, [profile, selectedConversation])

  useEffect(() => {
    if (!lensProfile?.defaultProfile) {
      reset()
    }
  }, [lensProfile?.defaultProfile])

  return {
    selectedConversation,
    missingXmtpAuth
  }
}

export default useGetConversation
