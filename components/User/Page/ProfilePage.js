import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaRegCopy } from 'react-icons/fa'
import { getNumberOfPostsUsingUserAddress } from '../../../api/post'
import { getUserInfo } from '../../../api/user'
import { useLensUserContext } from '../../../lib/LensUserContext'
import { modalType, usePopUpModal } from '../../Common/CustomPopUpProvider'
import { useNotify } from '../../Common/NotifyContext'
import ImageWithPulsingLoader from '../../Common/UI/ImageWithPulsingLoader'
import { useProfile } from '../../Common/WalletContext'
import LensPostsProfilePublicationsColumn from '../../Post/LensPostsProfilePublicationsColumn'
import PostsColumn from '../../Post/PostsColumn'
import EditProfile from '../EditProfile'
import LensFollowButton from '../LensFollowButton'

const ProfilePage = ({ _profile, _lensProfile }) => {
  const [profile, setProfile] = useState(_profile)
  const [lensProfile, setLensProfile] = useState(_lensProfile)
  const [showLensPosts, setShowLensPosts] = useState(false)
  const { notifyInfo } = useNotify()
  const { user } = useProfile()
  const { showModal } = usePopUpModal()
  const { isSignedIn, hasProfile, data: myLensProfile } = useLensUserContext()
  const [numberOfPosts, setNumberOfPosts] = useState(0)

  useEffect(() => {
    console.log('profile', profile)
    console.log('lensProfile', lensProfile)
    if (_profile) {
      setProfile(_profile)
    }
    if (_lensProfile) {
      setLensProfile(_lensProfile)
    }
  }, [_profile, _lensProfile])

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

  const showUserInfoFromAddress = async () => {
    try {
      if (!profile.walletAddress) return
      const userInfo = await getUserInfo(profile.walletAddress)
      console.log(userInfo)
      setProfile(userInfo)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (profile.walletAddress) {
      getNumberOfPosts(profile.walletAddress)
    }
  }, [profile.walletAddress])

  const handleWalletAddressCopy = () => {
    navigator.clipboard.writeText(profile.walletAddress)
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
                  profile.walletAddress.toLowerCase() && (
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
                    passHref
                  >
                    u/{lensProfile?.handle}
                  </Link>
                )}
              </div>
              {hasProfile &&
                isSignedIn &&
                myLensProfile &&
                lensProfile.ownedBy?.toLowerCase() !==
                  user?.walletAddress?.toLowerCase() && (
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

              {profile.walletAddress && !showLensPosts && (
                <PostsColumn
                  source="user"
                  data={profile.walletAddress}
                  sortBy="new"
                />
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

export default ProfilePage