import {
  Client,
  Conversation,
  DecodedMessage,
  SortDirection,
  Stream
} from '@xmtp/xmtp-js'
import React, { useState } from 'react'
import { useLensUserContext } from '../../lib/LensUserContext'
import { useMessageStore } from '../../store/message'
import { useXmtp } from '../Common/XmtpProvider'
import { parseConversationKey } from './conversationKey'
import conversationMatchesProfile from './conversationMatchesProfile'
import useXmtpClient from './useXmtpClient'

const PREFIX = 'lens.dev/dm'
const buildConversationKey = (profileIdA: string, profileIdB: string) => {
  const profileIdAParsed = parseInt(profileIdA, 16)
  const profileIdBParsed = parseInt(profileIdB, 16)

  return profileIdAParsed < profileIdBParsed
    ? `${PREFIX}/${profileIdA}-${profileIdB}`
    : `${PREFIX}/${profileIdB}-${profileIdA}`
}

const AllConversations = () => {
  const { data: lensProfile } = useLensUserContext()

  const conversations = useMessageStore((state) => state.conversations)
  const [profileIds, setProfileIds] = useState<Set<string>>(new Set<string>())
  const setConversations = useMessageStore((state) => state.setConversations)
  const previewMessages = useMessageStore((state) => state.previewMessages)
  const setPreviewMessages = useMessageStore(
    (state) => state.setPreviewMessages
  )

  const reset = useMessageStore((state) => state.reset)
  const { client, loading: creatingXmtpClient } = useXmtpClient()

  const [loading, setLoading] = React.useState(false)

  const getProfileFromKey = (key: string): string | null => {
    const parsed = parseConversationKey(key)
    const userProfileId = lensProfile?.defaultProfile?.id
    if (!parsed || !userProfileId) {
      return null
    }

    return parsed.members.find((member) => member !== userProfileId) ?? null
  }

  React.useEffect(() => {
    if (!client) return

    let conversationStream: Stream<Conversation>

    const closeConversationStream = async () => {
      if (!conversationStream) {
        return
      }
      await conversationStream.return()
    }

    const matcherRegex = conversationMatchesProfile(
      lensProfile?.defaultProfile?.id
    )

    const fetchMostRecentMessage = async (
      convo: Conversation
    ): Promise<{ key: string; message?: DecodedMessage }> => {
      const key = buildConversationKey(
        convo.peerAddress,
        convo.context?.conversationId as string
      )

      const newMessages = await convo.messages({
        limit: 1,
        direction: SortDirection.SORT_DIRECTION_DESCENDING
      })
      if (newMessages.length <= 0) {
        return { key }
      }
      return { key, message: newMessages[0] }
    }

    const listConversations = async () => {
      setLoading(true)
      const newPreviewMessages = new Map(previewMessages)
      const newConversations = new Map(conversations)
      const newProfileIds = new Set(profileIds)
      const convos = await client.conversations.list()
      const matchingConvos = convos.filter(
        (convo) =>
          convo.context?.conversationId &&
          matcherRegex.test(convo.context.conversationId)
      )

      for (const convo of matchingConvos) {
        const key = buildConversationKey(
          convo.peerAddress,
          convo.context?.conversationId as string
        )
        newConversations.set(key, convo)
      }

      const previews = await Promise.all(
        matchingConvos.map(fetchMostRecentMessage)
      )

      for (const preview of previews) {
        const profileId = getProfileFromKey(preview.key)
        if (profileId) {
          newProfileIds.add(profileId)
        }
        if (preview.message) {
          newPreviewMessages.set(preview.key, preview.message)
        }
      }
      console.log('newConversations', newConversations)
      console.log('newPreviewMessages', newPreviewMessages)
      setPreviewMessages(newPreviewMessages)
      setConversations(newConversations)
      setLoading(false)
      if (newProfileIds.size > profileIds.size) {
        setProfileIds(newProfileIds)
      }

      //       for (const convo of matchingConvos) {
      //         const key = buildConversationKey(
      //           convo.peerAddress,
      //           convo.context?.conversationId as string
      //         )
      //         newConversations.set(key, convo)
      //       }

      //       const allConversations = await client.conversations.list()
      //       const lensConversations = allConversations.filter(
      //         (conversation: Conversation) =>
      //           conversation.context?.conversationId.startsWith('lens.dev/dm/')
      //       )
      //       // Optionally filter for only conversations including your currently selected profile
      //       const myProfileConversations = lensConversations.filter((conversation) =>
      //         conversation.context?.conversationId.includes(
      //           lensProfile?.defaultProfile?.id
      //         )
      //       )

      //       /** Get the Lens profileIds from each conversationId and map them to the
      // conversation peerAddress. This allows us to ensure the profile still belongs
      // to the person in the conversation since profiles can be transferred. */
      //       const conversationKeys = myProfileConversations.map((convo) =>
      //         buildConversationKey(
      //           convo.peerAddress,
      //           convo.context?.conversationId as string
      //         )
      //       )
      //       const profileIds = conversationKeys.map((key: string) =>
      //         getProfileFromKey(key)
      //       )
    }
    listConversations()

    return () => {
      closeConversationStream()
    }
  }, [client])
  return <div>AllConversations</div>
}

export default AllConversations
