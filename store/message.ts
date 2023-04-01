import type { Client, Conversation, DecodedMessage } from '@xmtp/xmtp-js'
// import { toNanoString } from '@xmtp/xmtp-js'
import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
import getUniqueMessages from '../components/Messages/lib/getUniqueMessages'
import { Profile } from '../graphql/generated'
/* eslint-disable */

type TabValues = 'Following' | 'Requested'

interface MessageState {
  client: Client | undefined
  setClient: (client: Client | undefined) => void
  conversations: Map<string, Conversation>
  setConversations: (conversations: Map<string, Conversation>) => void
  addConversation: (key: string, newConversation: Conversation) => void
  messages: Map<string, DecodedMessage[]>
  setMessages: (messages: Map<string, DecodedMessage[]>) => void
  addMessages: (key: string, newMessages: DecodedMessage[]) => number
  messageProfiles: Map<string, Profile>
  setMessageProfiles: (messageProfiles: Map<string, Profile>) => void
  addProfile: (key: string, profile: Profile) => void
  previewMessages: Map<string, DecodedMessage>
  setPreviewMessage: (key: string, message: DecodedMessage) => void
  setPreviewMessages: (previewMessages: Map<string, DecodedMessage>) => void
  reset: () => void
  selectedProfileId: string
  setSelectedProfileId: (selectedProfileId: string) => void
  conversationKey: string
  setConversationKey: (conversationKey: string) => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  selectedTab: TabValues
  setSelectedTab: (selectedTab: TabValues) => void
}

export const useMessageStore = create<MessageState>((set) => ({
  client: undefined,
  setClient: (client) => set(() => ({ client })),
  conversations: new Map(),
  setConversations: (conversations) => set(() => ({ conversations })),
  addConversation: (key: string, newConversation: Conversation) => {
    set((state) => {
      const conversations = new Map(state.conversations)
      conversations.set(key, newConversation)
      return { conversations }
    })
  },
  messages: new Map(),
  setMessages: (messages) => set(() => ({ messages })),
  addMessages: (key: string, newMessages: DecodedMessage[]) => {
    let numAdded = 0
    set((state) => {
      const messages = new Map(state.messages)
      const existing = state.messages.get(key) || []
      const updated = getUniqueMessages([...existing, ...newMessages])
      numAdded = updated.length - existing.length
      // If nothing has been added, return the old item to avoid unnecessary refresh
      if (!numAdded) {
        return { messages: state.messages }
      }
      messages.set(key, updated)
      return { messages }
    })
    return numAdded
  },
  messageProfiles: new Map(),
  setMessageProfiles: (messageProfiles) => set(() => ({ messageProfiles })),
  addProfile: (key, profile) =>
    set((state) => {
      let profiles: Map<string, Profile>
      if (!state.messageProfiles.get(key)) {
        profiles = new Map(state.messageProfiles)
        profiles.set(key, profile)
      } else {
        profiles = state.messageProfiles
      }
      const selectedTab: TabValues = profile.isFollowedByMe
        ? 'Following'
        : 'Requested'
      return { messageProfiles: profiles, selectedTab: selectedTab }
    }),
  previewMessages: new Map(),
  setPreviewMessage: (key: string, message: DecodedMessage) =>
    set((state) => {
      const newPreviewMessages = new Map(state.previewMessages)
      newPreviewMessages.set(key, message)
      return { previewMessages: newPreviewMessages }
    }),
  setPreviewMessages: (previewMessages) => set(() => ({ previewMessages })),
  selectedProfileId: '',
  setSelectedProfileId: (selectedProfileId) =>
    set(() => ({ selectedProfileId })),
  conversationKey: '',
  setConversationKey: (conversationKey) => set(() => ({ conversationKey })),
  isOpen: false,
  setIsOpen: (isOpen) => set(() => ({ isOpen })),
  selectedTab: 'Following',
  setSelectedTab: (selectedTab) => set(() => ({ selectedTab })),
  reset: () =>
    set((state) => {
      return {
        ...state,
        conversations: new Map(),
        messages: new Map(),
        messageProfiles: new Map(),
        previewMessages: new Map(),
        selectedTab: 'Following'
      }
    })
}))
