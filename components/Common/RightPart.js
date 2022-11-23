import React, { useEffect, useState } from 'react'
import { getJoinedCommunitiesApi } from '../../api/community'
import CreatePostPopup from '../Home/CreatePostPopup'
import SearchModal from '../Search/SearchModal'
import { modalType, usePopUpModal } from './CustomPopUpProvider'
import { useNotify } from './NotifyContext'
import { useProfile } from './WalletContext'

const RightPart = () => {
  const { user } = useProfile()
  const { notifyInfo } = useNotify()
  const { showModal } = usePopUpModal()

  const [joinedCommunities, setJoinedCommunities] = useState([])

  const creatPost = () => {
    // setShowOptions(!showOptions)
    if (!user) {
      notifyInfo('You might want to connect your wallet first')
      return
    }
    showModal({
      component: <CreatePostPopup />,
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
    })
  }
  const getJoinedCommunities = async () => {
    if (!user?.walletAddress) {
      notifyInfo('I think you are not logged in')
      return
    }
    const response = await getJoinedCommunitiesApi(user.walletAddress)

    // todo get only top joined communities
    setJoinedCommunities(response.slice(0, 5))
  }

  useEffect(() => {
    if (user?.walletAddress) {
      getJoinedCommunities()
    }
  }, [user])
  return (
    <div className="fixed top-[50px] h-[calc(100vh-100px)] rounded-l-[25px] shadow-xl flex flex-col items-end justify-between right-0 bg-s-h-bg min-w-[350px] pt-6 pb-14 px-10">
      {/* <div className="py-4 h-full overflow-y-auto no-scrollbar">
        <ConnectButton chainStatus="icon" />
      </div> */}
      <div>
        <div className="justify-center">
          <SearchModal />
        </div>
        {/* joined communities */}
        <div>
          <div className="text-2xl py-3 mb-3 border-b border-black">
            Joined Communities
          </div>
          <div className="text-xl">
            {joinedCommunities.map((community, index) => (
              <a
                className="hover:underline underline-offset-4 flex flex-row items-center p-1 px-2 cursor-pointer hover:bg-p-h-bg rounded-full"
                key={index}
                href={`/c/${community.name}`}
              >
                <img
                  src={community.logoImageUrl}
                  className="w-12 h-12 rounded-full mr-2 my-1"
                />
                <div>{community.name}</div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* create post button */}
      <div
        className="text-2xl py-3 px-12 primary-gradient rounded-full button-dropshadow cursor-pointer"
        onClick={creatPost}
      >
        Create Post
      </div>
    </div>
  )
}

export default RightPart
