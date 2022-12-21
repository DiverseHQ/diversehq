import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { FaRegCopy } from 'react-icons/fa'
import { getUserInfo, getUserPosts } from '../../api/user'
import { useNotify } from '../../components/Common/NotifyContext'
import PostsColumn from '../../components/Post/PostsColumn'
import { useSigner } from 'wagmi'
import { ethers } from 'ethers'
import ABI from '../../utils/DiveToken.json'
import { DIVE_CONTRACT_ADDRESS_MUMBAI, POST_LIMIT } from '../../utils/config.ts'
import { useProfile } from '../../components/Common/WalletContext'
import {
  modalType,
  usePopUpModal
} from '../../components/Common/CustomPopUpProvider'
import EditProfile from '../../components/User/EditProfile'

const Profile = () => {
  const { useraddress } = useRouter().query
  const [profile, setProfile] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [posts, setPosts] = useState([])
  const { notifyInfo } = useNotify()
  const { data: signer } = useSigner()
  const [dive, setDive] = useState('')
  const { user } = useProfile()
  const { showModal } = usePopUpModal()

  useEffect(() => {
    if (useraddress) {
      showUserInfo()
      showPosts()
    }
  }, [useraddress])

  useEffect(() => {
    if (signer) {
      const contract = new ethers.Contract(
        DIVE_CONTRACT_ADDRESS_MUMBAI,
        ABI,
        signer
      )
      showUserDive(contract)
    }
  }, [signer])

  const showUserDive = async (contract) => {
    try {
      const userDive = await contract.balanceOf(useraddress)
      console.log('userDive', ethers.utils.formatEther(userDive))
      setDive(ethers.utils.formatEther(userDive.toString()))
    } catch (error) {
      console.log(error)
    }
  }

  const showUserInfo = async () => {
    try {
      const userInfo = await getUserInfo(useraddress)
      console.log(userInfo)
      setProfile(userInfo)
    } catch (error) {
      console.log(error)
    }
  }

  const showPosts = async () => {
    try {
      if (!hasMore) return
      const fetchedPosts = await getUserPosts(
        useraddress.toLowerCase(),
        POST_LIMIT,
        posts.length,
        'new'
      )
      console.log('fetchedPosts', fetchedPosts)
      if (fetchedPosts.posts.length < POST_LIMIT) {
        setHasMore(false)
      }
      setPosts([...posts, ...fetchedPosts.posts])
    } catch (error) {
      console.log(error)
    }
  }
  const handleWalletAddressCopy = () => {
    navigator.clipboard.writeText(useraddress)
    notifyInfo('Copied to clipboard')
  }
  const handleEditProfile = () => {
    showModal({
      component: <EditProfile user={user} showUserInfo={showUserInfo} />,
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
    })
  }
  return (
    <div className="pt-6">
      {profile && (
        <div className="relative">
          <img
            className="h-28 w-full object-cover sm:rounded-t-3xl"
            src={
              profile.bannerImageUrl ? profile.bannerImageUrl : '/gradient.jpg'
            }
          />

          <img
            className="absolute top-20 left-3 sm:left-5 border-s-bg border-4 rounded-full bg-s-bg w-20 h-20"
            src={
              profile?.profileImageUrl
                ? profile?.profileImageUrl
                : '/gradient.jpg'
            }
          />

          <div className="flex flex-col px-3 sm:px-5 mb-5 pb-6 bg-s-bg sm:rounded-b-3xl">
            <div className="flex flex-row items-center self-end">
              {user &&
                user.walletAddress.toLowerCase() ===
                  useraddress.toLowerCase() && (
                  <div
                    className="text-base text-p-text bg-p-btn px-2 mx-2 rounded-full cursor-pointer"
                    onClick={handleEditProfile}
                  >
                    Edit
                  </div>
                )}
              <div className="mx-1">
                <span className="text-s-text">$DIVE: </span>
                <span className="font-bold">{dive}</span>
              </div>
              <div
                className="self-end flex flex-row items-center my-3 px-2 py-1  cursor-pointer"
                onClick={handleWalletAddressCopy}
              >
                <div className="text-base sm:text-xl">
                  {profile?.walletAddress?.substring(0, 6) + '...'}
                </div>
                <FaRegCopy className="w-8 h-8 px-2" />
              </div>
            </div>
            <div className="font-bold text-xl sm:text-2xl tracking-wider">
              {profile.name}
            </div>
            <div>{profile.bio}</div>
            <div>
              <span className="text-s-text">Joined </span>
              <span className="font-bold">{profile?.communities?.length}</span>
              <span className="text-s-text"> Communities</span>
            </div>
          </div>
          {posts && (
            <PostsColumn
              getMorePost={() => {
                showPosts()
              }}
              hasMore={hasMore}
              posts={posts}
              setPosts={setPosts}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default Profile
