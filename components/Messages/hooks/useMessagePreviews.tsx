import {
  Conversation,
  DecodedMessage,
  SortDirection,
  Stream
} from '@xmtp/xmtp-js'
import { useState, useEffect } from 'react'
import { Profile } from '../../../graphql/generated'
import { useLensUserContext } from '../../../lib/LensUserContext'
import getProfiles from '../../../lib/profile/get-profiles'
import { useMessageStore } from '../../../store/message'
import chunkArray from '../../../utils/chunkArray'
import { MAX_PROFILES_PER_REQUEST, XMTP_PREFIX } from '../../../utils/config'
import { parseConversationKey } from '../lib/conversationKey'
import conversationMatchesProfile from '../lib/conversationMatchesProfile'
import buildConversationId from '../lib/buildConversationId'
import useXmtpClient from './useXmtpClient'

const buildConversationKey = (profileIdA: string, profileIdB: string) => {
  const profileIdAParsed = parseInt(profileIdA, 16)
  const profileIdBParsed = parseInt(profileIdB, 16)

  return profileIdAParsed < profileIdBParsed
    ? `${XMTP_PREFIX}/${profileIdA}-${profileIdB}`
    : `${XMTP_PREFIX}/${profileIdB}-${profileIdA}`
}

const useMessagePreviews = () => {
  const { data: lensProfile } = useLensUserContext()
  const conversations = useMessageStore((state) => state.conversations)
  const [profileIds, setProfileIds] = useState<Set<string>>(new Set<string>())
  const setConversations = useMessageStore((state) => state.setConversations)
  const previewMessages = useMessageStore((state) => state.previewMessages)
  const setPreviewMessages = useMessageStore(
    (state) => state.setPreviewMessages
  )
  const setPreviewMessage = useMessageStore((state) => state.setPreviewMessage)

  const { client, loading: creatingXmtpClient } = useXmtpClient()
  const [messagesLoading, setMessagesLoading] = useState<boolean>(true)
  const [profilesLoading, setProfilesLoading] = useState<boolean>(false)
  const [profilesError, setProfilesError] = useState<Error | undefined>()
  const messageProfiles = useMessageStore((state) => state.messageProfiles)
  const setMessageProfiles = useMessageStore(
    (state) => state.setMessageProfiles
  )

  const getProfileFromKey = (key: string): string | null => {
    const parsed = parseConversationKey(key)
    console.log('parsed', parsed)
    const userProfileId = lensProfile?.defaultProfile?.id
    if (!parsed || !userProfileId) {
      return null
    }
    return parsed.members.find((member) => member !== userProfileId) ?? null
  }

  useEffect(() => {
    if (profilesLoading) {
      return
    }
    console.log('profileids setting to query', profileIds)
    const toQuery = new Set(profileIds)
    // Don't both querying for already seen profiles
    for (const profile of Array.from(messageProfiles.values())) {
      toQuery.delete(profile.id)
    }

    if (!toQuery.size) {
      return
    }

    const loadLatest = async () => {
      setProfilesLoading(true)
      const newMessageProfiles = new Map(messageProfiles)
      const chunks = chunkArray(Array.from(toQuery), MAX_PROFILES_PER_REQUEST)
      try {
        for (const chunk of chunks) {
          console.log('chunk', chunk)
          const result = await getProfiles({
            profileIds: chunk
          })
          console.log('result', result)
          if (!result?.profiles.items.length) {
            continue
          }
          const profiles = result.profiles.items as Profile[]
          for (const profile of profiles) {
            const peerAddress = profile.ownedBy as string
            const key = buildConversationKey(
              peerAddress,
              buildConversationId(lensProfile?.defaultProfile?.id, profile.id)
            )
            newMessageProfiles.set(key, profile)
          }
        }
      } catch (error: unknown) {
        setProfilesError(error as Error)
      }

      setMessageProfiles(newMessageProfiles)
      setProfilesLoading(false)
    }
    loadLatest()
  }, [profileIds])

  useEffect(() => {
    if (!client) return

    let conversationStream: Stream<Conversation> | []
    let messageStream: AsyncGenerator<DecodedMessage>

    const closeConversationStream = async () => {
      if (!conversationStream) {
        return
      }
      if (conversationStream instanceof Array) {
        return
      }
      await conversationStream.return()
    }

    const matcherRegex = conversationMatchesProfile(
      lensProfile?.defaultProfile?.id
    )
    const streamAllMessages = async () => {
      messageStream = await client.conversations.streamAllMessages()

      for await (const message of messageStream) {
        const conversationId = message.conversation.context?.conversationId
        if (conversationId && matcherRegex.test(conversationId)) {
          const key = buildConversationKey(
            message.conversation.peerAddress,
            conversationId
          )
          setPreviewMessage(key, message)
        }
      }
    }
    const streamConversations = async () => {
      closeConversationStream()
      conversationStream = (await client?.conversations?.stream()) || []
      const matcherRegex = conversationMatchesProfile(
        lensProfile?.defaultProfile?.id
      )
      for await (const convo of conversationStream) {
        // Ignore any new conversations not matching the current profile
        if (
          !convo.context?.conversationId ||
          !matcherRegex.test(convo.context.conversationId)
        ) {
          continue
        }
        const newConversations = new Map(conversations)
        const newProfileIds = new Set(profileIds)
        const key = buildConversationKey(
          convo.peerAddress,
          convo.context.conversationId
        )
        newConversations.set(key, convo)
        const profileId = getProfileFromKey(key)
        console.log('new profileid from conversation', profileId)
        if (profileId && !profileIds.has(profileId)) {
          newProfileIds.add(profileId)
          setProfileIds(newProfileIds)
        }
        setConversations(newConversations)
      }
    }

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
      setMessagesLoading(true)
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
        console.log('new profileid from message', profileId)
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
      setMessagesLoading(false)
      console.log('newProfileIds', newProfileIds)
      if (newProfileIds.size > profileIds.size) {
        setProfileIds(newProfileIds)
      }
    }
    listConversations()
    streamConversations()
    streamAllMessages()
    return () => {
      closeConversationStream()
    }
  }, [client])
  return {
    authenticating: creatingXmtpClient,
    loading: messagesLoading || profilesLoading,
    messages: previewMessages,
    profilesToShow: messageProfiles,
    profilesError: profilesError
  }
}

export default useMessagePreviews