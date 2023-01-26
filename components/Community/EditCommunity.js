import React, { useState, useCallback } from 'react'
import PopUpWrapper from '../Common/PopUpWrapper'
import { AiOutlineCamera } from 'react-icons/ai'
import FormTextArea from '../Common/UI/FormTextArea'
import FormTextInput from '../Common/UI/FormTextInput'
import {
  uploadFileToFirebaseAndGetUrl
  // uploadFileToIpfs
} from '../../utils/utils'
import { useNotify } from '../Common/NotifyContext'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import { putEditCommunity } from '../../api/community'
import { useProfile } from '../Common/WalletContext'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

const EditCommunity = ({ community, getCommunityInformation }) => {
  console.log('communityTo be edited', community)
  const [loading, setLoading] = useState(false)
  const [communityBanner, setCommunityBanner] = useState(
    community?.bannerImageUrl
  )
  const [logoImage, setLogoImage] = useState(community?.logoImageUrl)
  const [communityBannerFile, setCommunityBannerFile] = useState(null)
  const [logoImageFile, setLogoImageFile] = useState(null)
  const [name, setName] = useState(community?.name)
  const [description, setDescription] = useState(community?.description)

  const { notifyError, notifySuccess } = useNotify()
  const { hideModal } = usePopUpModal()
  const { refreshUserInfo } = useProfile()
  const router = useRouter()
  const { address } = useAccount()

  //   useEffect(() => {
  //     setLogoImage(
  //       'https://www.sunrise-divers.com/wp-content/uploads/2017/02/diver-fish-clear-water.jpg'
  //     )
  //     setCommunityBanner(
  //       'https://www.sunrise-divers.com/wp-content/uploads/2017/02/diver-fish-clear-water.jpg'
  //     )

  //     setName('Test community name')
  //     setDescription('Test description')
  //   }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (!name || !description) {
      setLoading(false)
      notifyError('Please fill all fields')
      return
    }
    try {
      const communityData = {
        name,
        description,
        communityId: community._id
      }
      if (logoImageFile) {
        // const logo = await uploadFileToIpfs(logoImageFile)
        const logo = await uploadFileToFirebaseAndGetUrl(logoImageFile, address)
        communityData.logoImageUrl = logo.uploadedToUrl
        communityData.logoFilePath = logo.path
      }
      if (communityBannerFile) {
        // const banner = await uploadFileToIpfs(communityBannerFile)
        const banner = await uploadFileToFirebaseAndGetUrl(
          communityBannerFile,
          address
        )
        communityData.bannerImageUrl = banner.uploadedToUrl
        communityData.bannerFilePath = banner.path
      }
      const res = await putEditCommunity(communityData)
      console.log(res)
      const resData = await res.json()
      if (res.status !== 200) {
        setLoading(false)
        notifyError(resData.msg)
        return
      }
      await getCommunityInformation()
      await refreshUserInfo()
      router.push(`/c/${communityData?.name}`)
      setLoading(false)
      notifySuccess('Community updated successfully')
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

  const onChangeDescription = useCallback((e) => {
    setDescription(e.target.value)
  }, [])

  const handleLogoImageChange = (e) => {
    const filePicked = e.target.files[0]
    if (!filePicked) return
    setLogoImageFile(filePicked)
    setLogoImage(URL.createObjectURL(filePicked))
  }

  const handleCommunityBannerChange = (e) => {
    const filePicked = e.target.files[0]
    if (!filePicked) return
    setCommunityBannerFile(filePicked)
    setCommunityBanner(URL.createObjectURL(filePicked))
  }

  return (
    <>
      <PopUpWrapper
        title="Edit Community"
        label="SAVE"
        onClick={handleSubmit}
        loading={loading}
      >
        <div className="text-p-text">
          <label htmlFor="communityBanner">
            <div className="flex h-44 border-y border-p-border items-center justify-center cursor-pointer">
              {/* eslint-disable-next-line */}
              {communityBanner && (
                <img
                  className="inset-0 object-cover h-full w-full "
                  src={communityBanner}
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
              logoImage ? '' : 'border'
            } h-24 w-24 border-p-border rounded-full bottom-10 ml-3 items-center justify-center bg-p-bg z-10 cursor-pointer`}
          >
            {logoImage && (
              <label htmlFor="logoImage">
                {' '}
                <img
                  className="rounded-full w-24 h-24"
                  src={logoImage}
                  alt="PFP"
                />
              </label>
            )}
            <div className="absolute">
              <label htmlFor="logoImage">
                <div className="bg-p-bg rounded-full p-2 cursor-pointer">
                  <AiOutlineCamera className="h-8 w-8 " />
                </div>
              </label>
            </div>
          </div>

          <FormTextInput
            label="Community Name"
            placeholder="Your Community Name"
            value={name}
            onChange={onChangeName}
            required
          />
          <FormTextArea
            label="Description"
            placeholder="Show the world what your community is..."
            value={description}
            onChange={onChangeDescription}
            required
          />
          <input
            type="file"
            id="logoImage"
            placeholder="Commmunity Name"
            onChange={handleLogoImageChange}
            required
            hidden
          />
          <input
            type="file"
            id="communityBanner"
            onChange={handleCommunityBannerChange}
            hidden
          />
        </div>
      </PopUpWrapper>
    </>
  )
}

export default EditCommunity
