import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { FaRegCopy } from 'react-icons/fa'
import { getUserInfo } from '../../api/user'
import { useNotify } from '../../components/Common/NotifyContext'
import PostsColumn from '../../components/Post/PostsColumn'
import { useProfile } from '../../components/Common/WalletContext'
import {
  modalType,
  usePopUpModal
} from '../../components/Common/CustomPopUpProvider'
import EditProfile from '../../components/User/EditProfile'
import { isValidEthereumAddress, sleep } from '../../utils/helper.ts'
import {
  useDefaultProfileQuery,
  useProfileQuery
} from '../../graphql/generated'
import LensPostsProfilePublicationsColumn from '../../components/Post/LensPostsProfilePublicationsColumn'
import { useLensUserContext } from '../../lib/LensUserContext'
import { getNumberOfPostsUsingUserAddress } from '../../api/post'
import Link from 'next/link'
import LensFollowButton from '../../components/User/LensFollowButton'

const Profile = () => {
  const { id } = useRouter().query
  const [useraddress, setUserAddress] = useState(null)
  const [handle, setHandle] = useState(null)
  const [isFollowedByMe, setIsFollowedByMe] = useState(false)
  const [lensProfile, setLensProfile] = useState(null)
  const [profile, setProfile] = useState(null)
  const [showLensPosts, setShowLensPosts] = useState(false)
  const { notifyInfo } = useNotify()
  const { user } = useProfile()
  const { showModal } = usePopUpModal()
  const { isSignedIn, hasProfile, data: myLensProfile } = useLensUserContext()

  const [numberOfPosts, setNumberOfPosts] = useState(0)

  const lensProfileQueryFromAddress = useDefaultProfileQuery(
    {
      request: {
        ethereumAddress: useraddress
      }
    },
    {
      // Only fire the query if the address is available.
      enabled: !!useraddress
    }
  )

  const lensProfileFromHandle = useProfileQuery(
    {
      request: {
        handle: handle
      }
    },
    {
      enabled: !!handle
    }
  )

  useEffect(() => {
    if (lensProfile) return

    if (lensProfileQueryFromAddress?.data?.defaultProfile) {
      setLensProfile(lensProfileQueryFromAddress.data.defaultProfile)
    } else if (lensProfileFromHandle?.data?.profile?.ownedBy) {
      setUserAddress(lensProfileFromHandle.data.profile.ownedBy)
      setLensProfile(lensProfileFromHandle.data.profile)
    }
  }, [lensProfileQueryFromAddress, lensProfileFromHandle])

  useEffect(() => {
    if (!id || id === '') return
    handleIdAndGetProfile()
  }, [id])

  const handleIdAndGetProfile = async () => {
    if (id.endsWith('.test')) {
      console.log('handle', id)
      //todo get address from lens handle and lens profile
      setHandle(id)
    }
    if (isValidEthereumAddress(id)) {
      setUserAddress(id)
    }
  }

  const getNumberOfPosts = async (address) => {
    const result = await getNumberOfPostsUsingUserAddress(address)
    setNumberOfPosts(result.numberOfPosts)
  }

  useEffect(() => {
    if (useraddress) {
      showUserInfo()
      getNumberOfPosts(useraddress)
    }
  }, [useraddress])

  const showUserInfo = async () => {
    try {
      const userInfo = await getUserInfo(useraddress)
      console.log(userInfo)
      setProfile(userInfo)
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
                user?.walletAddress.toLowerCase() ===
                  useraddress.toLowerCase() && (
                  <div
                    className="text-base text-p-text bg-p-btn px-2 mx-2 rounded-full cursor-pointer"
                    onClick={handleEditProfile}
                  >
                    Edit
                  </div>
                )}
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
            <Link href={`/u/${handle}`} className="hover:underline">
              <div className="font-bold text-base sm:text-base tracking-wider">
                {`${profile.name ? profile.name : ''} ${
                  lensProfile?.handle ? 'u/' + lensProfile?.handle : ''
                }`}
              </div>
            </Link>
            <div>{profile.bio}</div>
            {/* offchain data */}
            <div>
              <span className="text-s-text">Joined </span>
              <span className="font-bold">{profile?.communities?.length}</span>
              <span className="text-s-text"> Communities</span>
            </div>
            <div>
              <span>Post : {numberOfPosts}</span>
            </div>
            <div>
              <span>Community Spells : {profile?.communityCreationSpells}</span>
            </div>

            {/* onchain lens data */}
            {lensProfile && (
              <>
                <div>
                  <span>Followers: {lensProfile?.stats?.totalFollowers}</span>
                </div>
                <div>
                  <span>LensPosts : {lensProfile?.stats?.totalPosts}</span>
                </div>
              </>
            )}
            {hasProfile && isSignedIn && myLensProfile && (
              <>
                <LensFollowButton lensProfile={lensProfile} />
              </>
            )}
          </div>

          {/* lens filter */}
          <div className="w-full flex justify-center">
            <div className="w-full md:w-[650px]">
              {lensProfile?.id && (
                <div className="font-bold text-sm sm:text-base flex flex-row  border px-3 sm:px-6 bg-white mt-4 sm:mt-10 py-1 sm:py-3 w-full sm:rounded-xl justify-between sm:justify-start sm:space-x-9 items-center">
                  <button
                    className={`flex p-1 sm:py-1 sm:px-2 items-center hover:cursor-pointer gap-2 rounded-md sm:rounded-xl ${
                      showLensPosts && 'bg-p-bg'
                    }  hover:bg-p-btn-hover`}
                    disabled={!lensProfile?.id}
                    onClick={() => {
                      setShowLensPosts(true)
                    }}
                  >
                    <img
                      src="/lensLogo.svg"
                      alt="lens logo"
                      className="w-5 h-5"
                    />
                    <div>Lens</div>
                  </button>
                </div>
              )}

              {useraddress && !showLensPosts && (
                <PostsColumn source="user" data={useraddress} sortBy="new" />
              )}
              {showLensPosts && lensProfile?.id && (
                <LensPostsProfilePublicationsColumn
                  profileId={lensProfile?.id}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
