import { CircularProgress, Tooltip } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineCamera } from 'react-icons/ai'
import { IoPencilSharp } from 'react-icons/io5'
import { MdOutlineClear } from 'react-icons/md'
import { uuid } from 'uuidv4'
import {
  useCreateSetProfileImageUriTypedDataMutation,
  useCreateSetProfileImageUriViaDispatcherMutation,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation
} from '../../graphql/generated'
import { useLensUserContext } from '../../lib/LensUserContext'
import useSignTypedDataAndBroadcast from '../../lib/useSignTypedDataAndBroadcast'
import {
  uploadFileToIpfsInfuraAndGetPath,
  uploadToIpfsInfuraAndGetPath
} from '../../utils/utils'
import LensLoginButton from '../Common/LensLoginButton'
import { useNotify } from '../Common/NotifyContext'
import FormRichTextInput from '../Common/UI/FormRichTextInput'
import FormTextInput from '../Common/UI/FormTextInput'
import getAvatar from '../User/lib/getAvatar'
import getIPFSLink from '../User/lib/getIPFSLink'
import {
  AttributeData,
  MetadataVersions,
  ProfileMetadata
} from './types/profieMetadata'

const ProfileForm = () => {
  const {
    data: lensProfile,
    hasProfile,
    isSignedIn,
    refetch
  } = useLensUserContext()
  const [name, setName] = useState(lensProfile?.defaultProfile?.name)
  const [bio, setBio] = useState(lensProfile?.defaultProfile?.bio)
  const [website, setWebsite] = useState('')
  const [location, setLocation] = useState('')
  const [twitter, setTwitter] = useState('')
  const [instagram, setInstagram] = useState('')
  const [saving, setSaving] = useState(false)
  const [profileBanner, setProfileBanner] = useState(null)
  const [profileImage, setProfileImage] = useState(
    getAvatar(lensProfile?.defaultProfile)
  )
  const [profileBannerFile, setProfileBannerFile] = useState(null)
  const [profileImageFile, setProfileImageFile] = useState(null)

  const { mutateAsync: createSetProfileImageUriViaDispatcher } =
    useCreateSetProfileImageUriViaDispatcherMutation()
  const { mutateAsync: createSetProfileImageUriTypedData } =
    useCreateSetProfileImageUriTypedDataMutation()
  const { mutateAsync: setProfileMetadatViaDispatcher } =
    useCreateSetProfileMetadataViaDispatcherMutation()
  const { mutateAsync: setProfileMetadataTypedData } =
    useCreateSetProfileMetadataTypedDataMutation()
  const { signTypedDataAndBroadcast, result, type } =
    useSignTypedDataAndBroadcast(false)
  const profileImageInputRef = useRef(null)
  const profileBannerInputRef = useRef(null)

  const { notifyError }: any = useNotify()

  const queryClient = useQueryClient()

  useEffect(() => {
    handleSetProfileBannerFromLensProfile()
    setProfileImage(getAvatar(lensProfile?.defaultProfile))
    setName(lensProfile?.defaultProfile?.name)
    setBio(lensProfile?.defaultProfile?.bio)

    const attributes = lensProfile?.defaultProfile?.attributes
    // get website from attributes list of object with key as website
    const websiteAttribute = attributes?.find(
      (attribute) => attribute.key === 'website'
    )
    setWebsite(websiteAttribute?.value)

    // get location from attributes list of object with key as location
    const locationAttribute = attributes?.find(
      (attribute) => attribute.key === 'location'
    )
    setLocation(locationAttribute?.value)

    // get twitter from attributes list of object with key as twitter
    const twitterAttribute = attributes?.find(
      (attribute) => attribute.key === 'twitter'
    )
    setTwitter(twitterAttribute?.value)

    // get instagram from attributes list of object with key as instagram
    const instagramAttribute = attributes?.find(
      (attribute) => attribute.key === 'instagram'
    )

    setInstagram(instagramAttribute?.value)
  }, [lensProfile?.defaultProfile])

  const handleSetProfileBannerFromLensProfile = () => {
    let _profileBanner =
      lensProfile?.defaultProfile?.coverPicture?.__typename === 'NftImage'
        ? getIPFSLink(lensProfile?.defaultProfile?.coverPicture?.uri)
        : getIPFSLink(lensProfile?.defaultProfile?.coverPicture?.original?.url)
    setProfileBanner(_profileBanner)
  }

  const handleProfileImageChange = (e) => {
    console.log(e.target.files[0])
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

  const setProfileImageIfChanged = async () => {
    try {
      if (!profileImageFile) return
      const hash = await uploadFileToIpfsInfuraAndGetPath(profileImageFile)
      const profileImage = `ipfs://${hash}`

      if (lensProfile?.defaultProfile?.dispatcher?.canUseRelay) {
        await createSetProfileImageUriViaDispatcher({
          request: {
            profileId: lensProfile?.defaultProfile?.id,
            url: profileImage
          }
        })
      } else {
        const setProfileImageUri = (
          await createSetProfileImageUriTypedData({
            request: {
              profileId: lensProfile?.defaultProfile?.id,
              url: profileImage
            }
          })
        ).createSetProfileImageURITypedData
        signTypedDataAndBroadcast(setProfileImageUri.typedData, {
          id: setProfileImageUri.id,
          type: 'create_set_profile_image_uri_typed_data'
        })
      }
    } catch (error) {
      console.log(error)
      notifyError('Error setting profile image')
      return
    }
  }

  const setProfileMetadata = async () => {
    try {
      const attributes: AttributeData[] = [
        { key: 'website', value: website },
        { key: 'location', value: location },
        { key: 'twitter', value: twitter },
        { key: 'instagram', value: instagram },
        { key: 'app', value: 'diversehq' }
      ]
      let bannerUrl = null
      if (profileBannerFile) {
        const hash = await uploadFileToIpfsInfuraAndGetPath(profileBannerFile)
        bannerUrl = `ipfs://${hash}`

        console.log('bannerUrl', bannerUrl)
      }

      const isValuesChanged =
        name !== lensProfile?.defaultProfile?.name ||
        bio !== lensProfile?.defaultProfile?.bio ||
        profileBannerFile ||
        website !==
          lensProfile?.defaultProfile?.attributes?.find(
            (attribute) => attribute.key === 'website'
          )?.value ||
        location !==
          lensProfile?.defaultProfile?.attributes?.find(
            (attribute) => attribute.key === 'location'
          )?.value ||
        twitter !==
          lensProfile?.defaultProfile?.attributes?.find(
            (attribute) => attribute.key === 'twitter'
          )?.value ||
        instagram !==
          lensProfile?.defaultProfile?.attributes?.find(
            (attribute) => attribute.key === 'instagram'
          )?.value ||
        lensProfile?.defaultProfile?.attributes?.find(
          (attribute) => attribute.key === 'app'
        )?.value !== 'diversehq'

      if (!isValuesChanged) {
        await queryClient.invalidateQueries({
          queryKey: ['lensUser', 'defaultProfile']
        })
        await refetch()
        setSaving(false)
        return
      }

      const metadata: ProfileMetadata = {
        version: MetadataVersions.one,
        name,
        bio,
        attributes,
        cover_picture: bannerUrl,
        metadata_id: uuid()
      }

      const hash = await uploadToIpfsInfuraAndGetPath(metadata)
      if (lensProfile?.defaultProfile?.dispatcher?.canUseRelay) {
        await setProfileMetadatViaDispatcher({
          request: {
            profileId: lensProfile?.defaultProfile?.id,
            metadata: `ipfs://${hash}`
          }
        })
        await queryClient.invalidateQueries({
          queryKey: ['lensUser', 'defaultProfile']
        })
        await refetch()
        setSaving(false)
      } else {
        const setProfileMetadata = (
          await setProfileMetadataTypedData({
            request: {
              profileId: lensProfile?.defaultProfile?.id,
              metadata: `ipfs://${hash}`
            }
          })
        ).createSetProfileMetadataTypedData
        signTypedDataAndBroadcast(setProfileMetadata.typedData, {
          id: setProfileMetadata.id,
          type: 'set_profle_metadata'
        })
      }
    } catch (error) {
      setSaving(false)
      console.log(error)
      notifyError('Error setting profile metadata')
      return
    }
  }

  useEffect(() => {
    const foo = async () => {
      if (result && type === 'set_profle_metadata') {
        await queryClient.invalidateQueries({
          queryKey: ['lensUser', 'defaultProfile']
        })
        await refetch()
        setSaving(false)
      }
    }
    foo()
  }, [result, type])

  const handleOnSaveClick = async () => {
    setSaving(true)
    // Saving profile image
    await setProfileImageIfChanged()
    await setProfileMetadata()
  }

  if (!isSignedIn || !hasProfile) {
    return <LensLoginButton />
  }
  return (
    <div className="p-2 w-full relative sm:p-3 space-y-2">
      <div className="h-60">
        <label htmlFor="profileBanner">
          <div
            className={`flex h-48 ${
              profileBanner ? 'border border-s-border' : ''
            }  rounded-xl items-center justify-center cursor-pointer`}
          >
            {/* eslint-disable-next-line */}

            <img
              className="inset-0 object-cover h-[200px] w-full rounded-xl"
              src={profileBanner ? profileBanner : '/gradient.jpg'}
              alt="Header"
            />

            <div className="absolute flex flex-row space-x-8">
              <Tooltip title="Upload" TransitionProps={{ timeout: 600 }} arrow>
                <div className="bg-s-bg rounded-full p-2">
                  <AiOutlineCamera className="h-8 w-8" />
                </div>
              </Tooltip>
              {profileBannerFile && (
                <Tooltip title="Clear" TransitionProps={{ timeout: 600 }} arrow>
                  <span
                    onClick={(e) => {
                      console.log('clicked')
                      e.preventDefault()
                      e.stopPropagation()
                      profileBannerInputRef.current.value = ''

                      setProfileBanner(null)
                      setProfileBannerFile(null)
                      handleSetProfileBannerFromLensProfile()
                    }}
                  >
                    <div className="bg-s-bg rounded-full p-2">
                      <MdOutlineClear className="h-8 w-8" />
                    </div>
                  </span>
                </Tooltip>
              )}
            </div>
          </div>
        </label>

        <div
          className={`flex relative ${
            profileImage ? '' : 'border-2 border-p-border'
          } h-24 w-24 sm:h-36 sm:w-36 rounded-full bottom-12 sm:bottom-20 ml-4 sm:ml-8 items-center justify-center bg-s-bg z-10 cursor-pointer`}
        >
          {profileImage && (
            <label htmlFor="profileImage">
              {' '}
              <img
                className="rounded-full object-cover w-24 h-24 sm:w-32 sm:h-32 cursor-pointer"
                src={profileImage}
                alt="PFP"
              />
            </label>
          )}
          <div className="absolute flex flex-row items-center space-x-3">
            <Tooltip TransitionProps={{ timeout: 600 }} title="Change" arrow>
              <label htmlFor="profileImage">
                <div className="bg-s-bg rounded-full p-1 cursor-pointer">
                  <AiOutlineCamera className="h-6 w-6 " />
                </div>
              </label>
            </Tooltip>

            {profileImageFile && (
              <Tooltip TransitionProps={{ timeout: 600 }} title="Clear" arrow>
                <div
                  className="bg-s-bg rounded-full p-1 cursor-pointer"
                  onClick={() => {
                    profileImageInputRef.current.value = ''
                    setProfileImageFile(null)
                    setProfileImage(getAvatar(lensProfile?.defaultProfile))
                  }}
                >
                  <MdOutlineClear className="h-6 w-6" />
                </div>
              </Tooltip>
            )}
          </div>
        </div>

        <input
          type="file"
          id="profileImage"
          placeholder="Commmunity Name"
          onChange={handleProfileImageChange}
          ref={profileImageInputRef}
          hidden
        />
        <input
          type="file"
          id="profileBanner"
          onChange={handleProfileBannerChange}
          ref={profileBannerInputRef}
          hidden
        />
      </div>

      <div className="">
        <FormTextInput
          label="Name"
          placeholder="Your Pseudo Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={32}
          required
          disabled={saving}
        />
        {/* <FormTextInput
          label="Bio"
          placeholder="Say a bit more about you..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
          maxLength={200}
          disabled={saving}
        /> */}
        <FormRichTextInput
          label="Bio"
          placeholder="Say a bit more about you..."
          startingValue={lensProfile?.defaultProfile?.bio}
          setContent={setBio}
        />

        <FormTextInput
          label="Website"
          placeholder="Your website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          disabled={saving}
        />

        <FormTextInput
          label="Location"
          placeholder="Your location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={saving}
        />

        <FormTextInput
          label="Twitter Handle"
          placeholder="Just your twitter handle without the @"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          disabled={saving}
        />

        <FormTextInput
          label="Instagram Handle"
          placeholder="Your instagram handle"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          disabled={saving}
        />
      </div>

      <button
        onClick={handleOnSaveClick}
        disabled={saving}
        className="self-start text-xl font-bold tracking-wide  m-5 px-4 py-2 bg-p-btn text-p-btn-text rounded-lg flex flex-row items-center space-x-2"
      >
        {saving && <CircularProgress className="h-5 w-5" size="18px" />}
        {!saving && <IoPencilSharp className="h-5 w-5" />}
        <div>Save</div>
      </button>
    </div>
  )
}

export default ProfileForm
