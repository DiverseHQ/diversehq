import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { FaRegCopy } from 'react-icons/fa'
import { getUserFromAddressOrName, getUserInfo } from '../../api/user'
import { useNotify } from '../../components/Common/NotifyContext'
import PostsColumn from '../../components/Post/PostsColumn'
import { useProfile } from '../../components/Common/WalletContext'
import {
  modalType,
  usePopUpModal
} from '../../components/Common/CustomPopUpProvider'
import EditProfile from '../../components/User/EditProfile'
import { isValidEthereumAddress } from '../../utils/helper.ts'
import {
  useDefaultProfileQuery,
  useProfileQuery
} from '../../graphql/generated'
import LensPostsProfilePublicationsColumn from '../../components/Post/LensPostsProfilePublicationsColumn'
import { useLensUserContext } from '../../lib/LensUserContext'
import { getNumberOfPostsUsingUserAddress } from '../../api/post'
import Link from 'next/link'
import LensFollowButton from '../../components/User/LensFollowButton'
import ImageWithPulsingLoader from '../../components/Common/UI/ImageWithPulsingLoader'

const Profile = () => {
  const { id } = useRouter().query
  const [useraddress, setUserAddress] = useState(null)
  const [handle, setHandle] = useState(null)
  const [lensProfile, setLensProfile] = useState(null)
  const [profile, setProfile] = useState(null)
  const [showLensPosts, setShowLensPosts] = useState(false)
  const { notifyInfo } = useNotify()
  const { user } = useProfile()
  const { showModal } = usePopUpModal()
  const { isSignedIn, hasProfile, data: myLensProfile } = useLensUserContext()
  const [notFound, setNotFound] = useState(false)
  const [numberOfPosts, setNumberOfPosts] = useState(0)

  useEffect(() => {
    if (!id || id === '') return
    handleIdAndGetProfile()
  }, [id])

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
    }
    if (lensProfileFromHandle.data && !lensProfileFromHandle.data.profile) {
      setNotFound(true)
    }
    if (lensProfileFromHandle?.data?.profile?.ownedBy) {
      console.log('lensProfileFromHandle', lensProfileFromHandle)
      setUserAddress(lensProfileFromHandle.data.profile.ownedBy)
      setLensProfile(lensProfileFromHandle.data.profile)
    }
  }, [lensProfileQueryFromAddress, lensProfileFromHandle])

  const handleIdAndGetProfile = async () => {
    if (id.endsWith('.test')) {
      console.log('handle', id)
      //todo get address from lens handle and lens profile
      setHandle(id)
    } else {
      showUserInfoFromAddressOrName(id)
    }
  }

  const getNumberOfPosts = async (address) => {
    try {
      console.log('getNumberOfPosts', address)
      const result = await getNumberOfPostsUsingUserAddress(address)
      console.log('result', result)
      setNumberOfPosts(result.numberOfPosts)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (useraddress) {
      console.log('useraddress', useraddress)
      showUserInfoFromAddress()
      getNumberOfPosts(useraddress)
    }
  }, [useraddress])

  const showUserInfoFromAddressOrName = async (id) => {
    try {
      if (profile) return
      console.log('showUserINfoFromAddressOrName', id)
      const res = await getUserFromAddressOrName(id)
      console.log(res)
      if (res.status === 200) {
        const userInfo = await res.json()
        console.log(userInfo)
        setProfile(userInfo)
        setUserAddress(userInfo.walletAddress)
      } else {
        console.log('not found')
        setNotFound(true)
      }
    } catch (error) {
      setNotFound(true)
      console.log(error)
    }
  }

  const showUserInfoFromAddress = async () => {
    try {
      if (profile) return
      if (!isValidEthereumAddress(useraddress)) return
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
      component: (
        <EditProfile user={user} showUserInfo={showUserInfoFromAddress} />
      ),
      type: modalType.normal,
      onAction: () => {},
      extraaInfo: {}
    })
  }

  return (
    <div>
      {profile && (
        <div className="relative">
          <ImageWithPulsingLoader
            className="h-28 w-full object-cover"
            src={
              profile.bannerImageUrl ? profile.bannerImageUrl : '/gradient.jpg'
            }
          />

          <ImageWithPulsingLoader
            className="absolute top-20 left-3 sm:left-5 border-s-bg border-4 rounded-full bg-s-bg w-20 h-20"
            src={
              profile?.profileImageUrl
                ? profile?.profileImageUrl
                : '/gradient.jpg'
            }
          />

          <div className="flex flex-col px-3 sm:px-5 pb-6 bg-s-bg ">
            <div className="flex flex-row items-center self-end">
              {user &&
                user?.walletAddress.toLowerCase() ===
                  useraddress.toLowerCase() && (
                  <div
                    className="text-base text-p-btn-text bg-p-btn px-2 mx-2 rounded-full cursor-pointer"
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
            <div className="flex flex-row items-center justify-between sm:justify-start sm:space-x-10">
              <div className="flex flex-col items-start font-bold text-base sm:text-base tracking-wider">
                {profile.name && <div>{profile.name}</div>}
                {!profile.name && profile.walletAddress && (
                  <div>{profile.walletAddress.substring(0, 6) + '...'}</div>
                )}
                {lensProfile?.handle && (
                  <Link
                    href={`/u/${lensProfile?.handle}`}
                    className="hover:underline cursor-pointer"
                  >
                    u/{lensProfile?.handle}
                  </Link>
                )}
              </div>
              {hasProfile && isSignedIn && myLensProfile && (
                <>
                  <LensFollowButton lensProfile={lensProfile} />
                </>
              )}
            </div>
            <div>{profile.bio}</div>
            {/* offchain data */}
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 mt-4 items-center">
              <div className="bg-s-h-bg p-1 px-2 sm:px-4 rounded-full">
                <span className="">Joined </span>
                <span className="font-bold">
                  {profile?.communities?.length}
                </span>
                <span className=""> Communities</span>
              </div>
              <div className="bg-s-h-bg p-1 px-2 sm:px-4 rounded-full">
                <span>Post : {numberOfPosts}</span>
              </div>
              <div className="bg-s-h-bg p-1 px-2 sm:px-4 rounded-full">
                <span>
                  Community Spells : {profile?.communityCreationSpells}
                </span>
              </div>

              {/* onchain lens data */}
              {lensProfile && (
                <>
                  <div className="bg-s-h-bg p-1 px-2 sm:px-4 rounded-full">
                    <span>Followers: {lensProfile?.stats?.totalFollowers}</span>
                  </div>
                  <div className="bg-s-h-bg p-1 px-2 sm:px-4 rounded-full">
                    <span>LensPosts : {lensProfile?.stats?.totalPosts}</span>
                  </div>
                </>
              )}
            </div>
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
                      setShowLensPosts(!showLensPosts)
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
      {!profile && !notFound && (
        <>
          <div className="w-full bg-gray-100 animate-pulse my-4 sm:my-6">
            <div className="w-full h-[100px] bg-gray-300" />
            <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
              <div className="w-32 h-4 bg-gray-300 rounded-full" />
              <div className="w-32 h-4 bg-gray-300 rounded-full" />
              <div className="w-20 h-4 bg-gray-300 rounded-full" />
            </div>
            <div className="w-full flex flex-row items-center space-x-4 p-2 px-4">
              <div className="w-20 h-4 bg-gray-300 rounded-full" />
              <div className="w-28 h-4 bg-gray-300 rounded-full" />
            </div>
          </div>
          <div className="w-full flex justify-center">
            <div className="w-full md:w-[650px]">
              <div className="w-full sm:rounded-2xl h-[300px] sm:h-[450px] bg-gray-100 animate-pulse my-3 sm:my-6">
                <div className="w-full flex flex-row items-center space-x-4 p-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-300 rounded-full animate-pulse" />
                  <div className="h-2 sm:h-4 w-[100px] sm:w-[200px] rounded-full bg-gray-300" />
                  <div className="h-2 sm:h-4 w-[50px] rounded-full bg-gray-300" />
                </div>
                <div className="w-full flex flex-row items-center space-x-4 sm:p-4 pr-4">
                  <div className="w-6 sm:w-[50px] h-4 " />
                  <div className="w-full mr-4 rounded-2xl bg-gray-300 h-[200px] sm:h-[300px]" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {notFound && (
        <div className="flex flex-col items-center justify-center h-full mt-10">
          <div className="text-2xl font-bold">No Profile Found</div>
          <div className="text-sm text-gray-500">
            This user has not created a profile yet.
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
