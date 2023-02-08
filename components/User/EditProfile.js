import React, { useCallback, useState } from 'react'
import { AiOutlineCamera } from 'react-icons/ai'
import { putUpdateUser } from '../../api/user'
import { useCreateSetProfileImageUriViaDispatcherMutation } from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import {
  hasWhiteSpace,
  uploadFileToFirebaseAndGetUrl,
  uploadFileToIpfsInfuraAndGetPath
  // uploadFileToIpfs
} from '../../utils/utils'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import { useNotify } from '../Common/NotifyContext'
import PopUpWrapper from '../Common/PopUpWrapper'
import FormTextInput from '../Common/UI/FormTextInput'
import { useProfile } from '../Common/WalletContext'

const EditProfile = ({ user, showUserInfo }) => {
  const [loading, setLoading] = useState(false)
  const [profileBanner, setProfileBanner] = useState(user?.bannerImageUrl)
  const [profileImage, setProfileImage] = useState(user?.profileImageUrl)
  const [profileBannerFile, setProfileBannerFile] = useState(null)
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [name, setName] = useState(user?.name)
  const [bio, setBio] = useState(user?.bio)
  const { isSignedIn, hasProfile, data: lensProfile } = useLensUserContext()

  const { mutateAsync: createSetProfileImageUriViaDispatcher } =
    useCreateSetProfileImageUriViaDispatcherMutation()

  const { refreshUserInfo, address } = useProfile()
  const { notifyError, notifySuccess } = useNotify()
  const { hideModal } = usePopUpModal()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (!name || !bio) {
      setLoading(false)
      notifyError('Please fill all fields')
      return
    }
    if (name.length > 26) {
      setLoading(false)
      notifyError('Name must be less than 26 characters')
      return
    }
    if (hasWhiteSpace(name)) {
      setLoading(false)
      notifyError('Name cannot contain spaces')
      return
    }

    if (name.endsWith('.lens') || name.endsWith('.test')) {
      setLoading(false)
      notifyError(
        'Name cannot end with .lens or .test. It is reserved for Lens'
      )
      return
    }
    try {
      const profileData = {
        name,
        bio
      }
      if (profileImageFile) {
        // const profile = await uploadFileToIpfs(profileImageFile)
        const profile = await uploadFileToFirebaseAndGetUrl(
          profileImageFile,
          address
        )
        profileData.profileImageUrl = profile.uploadedToUrl
        profileData.profileFilePath = profile.path

        // todo later make this separate with ui/ux for user to choose
        try {
          // update lens profile image
          if (
            isSignedIn &&
            hasProfile &&
            lensProfile?.defaultProfile?.dispatcher?.canUseRelay
          ) {
            const hash = await uploadFileToIpfsInfuraAndGetPath(
              profileImageFile
            )

            await createSetProfileImageUriViaDispatcher({
              request: {
                profileId: lensProfile.defaultProfile.id,
                url: `ipfs://${hash}`
              }
            })
          }
        } catch (error) {
          console.log(error)
        }
      }
      if (profileBannerFile) {
        // const banner = await uploadFileToIpfs(profileBannerFile)
        const banner = await uploadFileToFirebaseAndGetUrl(
          profileBannerFile,
          address
        )
        profileData.bannerImageUrl = banner.uploadedToUrl
        profileData.bannerFilePath = banner.path
      }
      const resp = await putUpdateUser(profileData)
      const resData = await resp.json()
      if (resp.status !== 200) {
        setLoading(false)
        notifyError(resData.msg)
        return
      }
      await refreshUserInfo()
      await showUserInfo()
      setLoading(false)
      notifySuccess('Profile updated successfully')
      hideModal()
    } catch (error) {
      setLoading(false)
      console.log(error)
      notifyError(error.message)
    }
  }

  const onChangeName = useCallback((e) => {
    setName(e.target.value)
  }, [])

  const onChangeBio = useCallback((e) => {
    setBio(e.target.value)
  }, [])

  const handleProfileImageChange = (e) => {
    const filePicked = e.target.files[0]
    if (!filePicked) return
    setProfileImageFile(filePicked)
    setProfileImage(URL.createObjectURL(filePicked))
  }

  const handleProfileBannerChange = (e) => {
    const filePicked = e.target.files[0]
    if (!filePicked) return
    setProfileBannerFile(filePicked)
    setProfileBanner(URL.createObjectURL(filePicked))
  }
  return (
    <>
      <PopUpWrapper
        title="Edit Profile"
        label="SAVE"
        onClick={handleSubmit}
        loading={loading}
      >
        <div className="text-p-text">
          <label htmlFor="profileBanner">
            <div className="flex h-40 border-y border-p-border items-center justify-center cursor-pointer">
              {/* eslint-disable-next-line */}
              {profileBanner && (
                <img
                  className="inset-0 object-cover h-40 w-full "
                  src={profileBanner}
                  alt="Header"
                />
              )}
              <div className="absolute flex flex-row">
                <div className="bg-p-bg rounded-full p-2">
                  <AiOutlineCamera className="h-8 w-8" />
                </div>
              </div>
            </div>
          </label>

          <div
            className={`flex relative ${
              profileImage ? '' : 'border'
            } h-24 w-24 border-p-border rounded-full bottom-10 ml-3 items-center justify-center bg-p-bg z-10 cursor-pointer`}
          >
            {profileImage && (
              <label htmlFor="profileImage">
                {' '}
                <img
                  className="rounded-full w-24 h-24 cursor-pointer"
                  src={profileImage}
                  alt="PFP"
                />
              </label>
            )}
            <div className="absolute">
              <label htmlFor="profileImage">
                <div className="bg-p-bg rounded-full p-2 cursor-pointer">
                  <AiOutlineCamera className="h-8 w-8 " />
                </div>
              </label>
            </div>
          </div>

          <div className="mt-[-40px]">
            <FormTextInput
              label="Name"
              placeholder="Your Pseudo Name"
              value={name}
              onChange={onChangeName}
              maxLength={20}
              required
            />
            <FormTextInput
              label="Bio"
              placeholder="Say a bit more about you..."
              value={bio}
              onChange={onChangeBio}
              required
              maxLength={200}
            />
          </div>
          <input
            type="file"
            id="profileImage"
            placeholder="Commmunity Name"
            onChange={handleProfileImageChange}
            required
            hidden
          />
          <input
            type="file"
            id="profileBanner"
            onChange={handleProfileBannerChange}
            hidden
          />
        </div>
      </PopUpWrapper>
    </>
  )
}

export default EditProfile
