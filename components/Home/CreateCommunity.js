import { useCallback, useState } from 'react'
import { useProfile } from '../Common/WalletContext'
import { AiOutlineCamera, AiOutlineClose } from 'react-icons/ai'
import { useNotify } from '../Common/NotifyContext'
import { postCreateCommunity } from '../../api/community'
import PopUpWrapper from '../Common/PopUpWrapper'
import Image from 'next/image'
import FormTextInput from '../Common/UI/FormTextInput'
import FormTextArea from '../Common/UI/FormTextArea'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import { useRouter } from 'next/router'
import {
  uploadFileToFirebaseAndGetUrl
  // uploadFileToIpfs
} from '../../utils/utils'

const CreateCommunity = () => {
  const [communityName, setCommunityName] = useState('')
  const [communityPfp, setCommunityPfp] = useState()
  const [communityBanner, setCommunityBanner] = useState()
  const [communityDescription, setCommunityDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const { wallet, token } = useProfile()
  const [headerValue, setHeaderValue] = useState(null)
  const [pfpValue, setPfpValue] = useState(null)
  const { notifyError, notifySuccess } = useNotify()
  const { hideModal } = usePopUpModal()
  const router = useRouter()

  // function hasWhiteSpace (s) {
  //   return /\s/g.test(s)
  // }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    if (
      !communityName ||
      !communityPfp ||
      !communityBanner ||
      !communityDescription
    ) {
      notifyError('Please fill in all fields')
      setLoading(false)
      return
    }
    if (communityName.length > 16) {
      notifyError('Community name must be less than 16 characters')
      setLoading(false)
      return
    }
    // change space to _ for all file in files
    // const PFP = await uploadFileToIpfs(communityPfp)
    // const Banner = await uploadFileToIpfs(communityBanner)
    const PFP = await uploadFileToFirebaseAndGetUrl(communityPfp)
    const Banner = await uploadFileToFirebaseAndGetUrl(communityBanner)
    await handleCreateCommunity(PFP, Banner)
  }

  const handleCreateCommunity = async (pfpURL, bannerURL) => {
    const communityData = {
      name: communityName,
      description: communityDescription,
      bannerImageUrl: bannerURL,
      logoImageUrl: pfpURL,
      creator: wallet
    }
    try {
      await postCreateCommunity(token, communityData).then(async (res) => {
        console.log(res)
        const resData = await res.json()
        console.log(resData)
        if (res.status !== 200) {
          const msg = resData.msg
          notifyError(msg)
          setLoading(false)
          return
        }
        notifySuccess('Community created successfully')
        router.push(`/c/${resData.name}`)
        hideModal()
      })
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const handleHeaderChange = (event) => {
    const filePicked = event.target.files[0]
    console.log('filePicked', filePicked)
    if (!filePicked) return
    setCommunityBanner(filePicked)
    console.log('filePicked', filePicked)
    setHeaderValue(URL.createObjectURL(filePicked))
  }

  const handlePfpChange = (event) => {
    const filePicked = event.target.files[0]
    if (!filePicked) return
    setCommunityPfp(filePicked)
    setPfpValue(URL.createObjectURL(filePicked))
  }

  const removeHeader = (e) => {
    e.preventDefault()
    setHeaderValue(null)
    setCommunityBanner(null)
  }

  const onChangeCommunityName = useCallback((e) => {
    setCommunityName(e.target.value)
  }, [])

  const onChangeCommunityDescription = useCallback((e) => {
    setCommunityDescription(e.target.value)
  }, [])

  return (
    <>
      <PopUpWrapper
        title="Create Community"
        onClick={handleSubmit}
        label="CREATE"
        loading={loading}
      >
        <div>
          <label htmlFor="communityHeader">
            <div className="flex h-44 border-y border-s-text items-center justify-center">
              {/* eslint-disable-next-line */}
            {headerValue && <img className="inset-0 object-cover h-full w-full " src={headerValue} alt="Header"/> }
              <div className="absolute flex flex-row">
                <div className="bg-p-bg rounded-full p-2">
                  <AiOutlineCamera className="h-8 w-8" />
                </div>
                {headerValue && (
                  <div className="bg-p-bg rounded-full p-2  ml-4">
                    <AiOutlineClose
                      className="h-8 w-8"
                      onClick={removeHeader}
                    />
                  </div>
                )}
              </div>
            </div>
          </label>

          <div
            className={`flex relative ${
              communityPfp ? '' : 'border'
            } h-24 w-24 border-s-text rounded-full bottom-10 ml-3 items-center justify-center bg-p-bg z-10`}
          >
            {communityPfp && (
              <label htmlFor="communityPfp">
                {' '}
                <Image
                  className="rounded-full"
                  width={100}
                  height={100}
                  src={pfpValue}
                  alt="PFP"
                />
              </label>
            )}
            <div className="absolute">
              <label htmlFor="communityPfp">
                <div className="bg-p-bg rounded-full p-2">
                  <AiOutlineCamera className="h-8 w-8 " />
                </div>
              </label>
            </div>
          </div>

          <FormTextInput
            label="Name"
            placeholder="Community Name"
            value={communityName}
            onChange={onChangeCommunityName}
            required
          />
          <FormTextArea
            label="Description"
            placeholder="Community Description"
            value={communityDescription}
            onChange={onChangeCommunityDescription}
            required
          />
          <input
            type="file"
            id="communityPfp"
            placeholder="Commmunity Name"
            onChange={handlePfpChange}
            required
            hidden
          />
          <input
            type="file"
            id="communityHeader"
            onChange={handleHeaderChange}
            hidden
          />
        </div>
      </PopUpWrapper>
    </>
  )
}

export default CreateCommunity
