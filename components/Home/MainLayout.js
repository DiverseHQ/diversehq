import React from 'react'
import useDevice from '../Common/useDevice'
import MobileBottomNav from './MobileBottomNav'
import Navbar from './Navbar'
import NewMobileTopNav from './NewMobileTopNav'
import RightSidebar from './RightSidebar'
import ScrollToTopButton from '../Common/UI/ScrollToTopButton'
import NewLeftSidebar from './NewLeftSidebar'
import { Box, LinearProgress } from '@mui/material'
// import BottomDrawerWrapper from '../Common/BottomDrawerWrapper'
import CreatePostButton from '../Common/UI/CreatePostButton'
// import { Client } from '@xmtp/xmtp-js'
// import { Wallet } from 'ethers'
// import { useSigner } from 'wagmi'
// import { useProfile } from '../Common/WalletContext'

const MainLayout = ({ children, isLoading }) => {
  const { isMobile } = useDevice()

  // const [showMessages, setShowMessages] = useState(false)

  // const { address } = useProfile()
  // const { data: signer } = useSigner()

  // const messagesXMTP = async () => {
  //   // You'll want to replace this with a wallet from your application
  //   // const wallet = Wallet.createRandom()
  //   // console.log(wallet)
  //   // Create the client with your wallet. This will connect to the XMTP development network by default
  //   const xmtp = await Client.create(signer)
  //   console.log(xmtp)

  //   const conversations = xmtp.conversations
  //   console.log(conversations)

  //   const allConversations = await xmtp.conversations.list()
  //   console.log(allConversations)
  //   // // Start a conversation with XMTP
  //   // const conversation = await xmtp.conversations.newConversation(
  //   //   '0x26E98B26Be8c82AD29a969D7761Db20C06cdb4cb'
  //   // )
  //   // // // Load all messages in the conversation
  //   // const messages = await conversation.messages()
  //   // // // Send a message
  //   // await conversation.send('gm')
  //   // // Listen for new messages in the conversation
  //   // for await (const message of await conversation.streamMessages()) {
  //   //   console.log(`[${message.senderAddress}]: ${message.content}`)
  //   // }
  //   // console.log(messages)

  //   // for await (const message of await conversation.streamMessages()) {
  //   //   if (message.senderAddress === xmtp.address) {
  //   //     // This message was sent from me
  //   //     continue
  //   //   }
  //   //   console.log(
  //   //     `New message from ${message.senderAddress}: ${message.content}`
  //   //   )
  //   // }
  // }

  // const PREFIX = 'lens.dev/dm'
  // const buildConversationId = (profileIdA, profileIdB) => {
  //   const profileIdAParsed = parseInt(profileIdA, 16)
  //   const profileIdBParsed = parseInt(profileIdB, 16)
  //   return profileIdAParsed < profileIdBParsed
  //     ? `${PREFIX}/${profileIdA}-${profileIdB}`
  //     : `${PREFIX}/${profileIdB}-${profileIdA}`
  // }

  //   const func = async () => {
  //     // Filter for Lens conversations
  //     const allConversations = await client.conversations.list()
  //     const lensConversations = allConversations.filter((conversation) =>
  //       conversation.context?.conversationId.startsWith('lens.dev/dm/')
  //     )
  //     // Optionally filter for only conversations including your currently selected profile
  //     const myProfileConversations = lensConversations.filter((conversation) =>
  //       conversation.context?.conversationId.includes(myProfile.id)
  //     )

  //     /** Get the Lens profileIds from each conversationId and map them to the
  // conversation peerAddress. This allows us to ensure the profile still belongs
  // to the person in the conversation since profiles can be transferred. */
  //     const conversationKeys = myProfileConversations.map((convo) =>
  //       buildConversationKey(convo.peerAddress, convo.context?.conversationId)
  //     )
  //     const profileIds = conversationKeys.map((key) => getProfileFromKey(key))

  //     /** Query the Lens API for profile information on all profileIds and once again
  // map each profile to a conversationKey to track the current ownedBy address. */
  //     const [messageProfiles, setMessageProfiles] = useState()
  //     const getProfiles = gql`
  //       query GetProfiles($profileIds: [String]) {
  //         profiles(request: { profileIds: $profileIds }) {
  //           items {
  //             id
  //             ownedBy
  //             # Optionally add more profile information here
  //           }
  //         }
  //       }
  //     `
  //     const fetchProfiles = async () => {
  //       const response = await apolloClient.query({
  //         query: getProfiles,
  //         variables: { profileIds }
  //       })
  //       const profiles = response.data.profiles.items
  //       const newMessageProfiles = new Map(messageProfiles)
  //       for (const profile of profiles) {
  //         const peerAddress = profile.ownedBy
  //         const key = buildConversationKey(
  //           peerAddress,
  //           buildConversationId(myProfile.id, profile.id)
  //         )
  //         newMessageProfiles.set(key, profile)
  //       }
  //       setMessageProfiles(newMessageProfiles)
  //     }
  //     fetchProfiles()
  //   }

  // useEffect(() => {
  //   messagesXMTP()
  // }, [])

  // only show if mounted
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  if (!mounted && process.env.NEXT_PUBLIC_NODE_MODE === 'development')
    return null
  return (
    <>
      {isMobile && (
        <div className="text-p-text bg-p-bg min-h-screen transition-all duration-500">
          <NewMobileTopNav />
          <Box sx={{ width: '100%', position: 'absolute' }}>
            {isLoading && <LinearProgress />}
          </Box>
          {/* <MobileTopNav /> */}
          <div className={'pb-16'}>
            <CreatePostButton />
            <ScrollToTopButton />
            {children}
          </div>
          <MobileBottomNav />
        </div>
      )}
      {!isMobile && (
        <div className="relative min-h-screen bg-p-bg transition-all duration-500">
          <Navbar />

          <Box sx={{ width: '100%', position: 'absolute' }}>
            {isLoading && <LinearProgress />}
          </Box>

          <div className="flex flex-row">
            <NewLeftSidebar />
            <div className="relative flex-1 min-h-screen text-p-text">
              <ScrollToTopButton />
              {children}
            </div>
            <RightSidebar />
          </div>

          {/* <div
            className="hidden lg:flex flex-col fixed z-50 bottom-0 right-0 drop-shadow-2xl flex flex-row justify-between bg-s-bg text-p-text py-2 px-6 rounded-t-[15px] w-[160px] md:w-[220px] lg:w-[320px] xl:w-[380px] cursor-pointer"
            onClick={() => setShowMessages(true)}
          >
            <span className="font-semibold text-[22px]">Messages</span>
          </div>
          <BottomDrawerWrapper
            isDrawerOpen={showMessages}
            setIsDrawerOpen={setShowMessages}
            showClose={false}
          >
            <div className="w-full" onClick={() => setShowMessages(false)}>
              <span className="font-semibold text-[22px]">Hello</span>
            </div>
          </BottomDrawerWrapper> */}
        </div>
      )}
    </>
  )
}

export default MainLayout
