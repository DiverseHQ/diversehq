import { useCallback, useState } from 'react'
import { useProfile } from '../Common/WalletContext'
import { AiOutlineCamera, AiOutlineClose } from 'react-icons/ai'
import { useNotify } from '../Common/NotifyContext'
import {
  postCreateCommunity,
  postGetCommunityExistStatus
} from '../../apiHelper/community'
import PopUpWrapper from '../Common/PopUpWrapper'
import FormTextInput from '../Common/UI/FormTextInput'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import { useRouter } from 'next/router'
import uploadToIPFS from '../../utils/uploadToIPFS'

const CreateCommunity = () => {
  const [communityName, setCommunityName] = useState('')
  const [communityLabel, setCommunityLabel] = useState('')
  const [communityPfp, setCommunityPfp] = useState()
  const [communityBanner, setCommunityBanner] = useState()
  const [communityDescription, setCommunityDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [headerValue, setHeaderValue] = useState(null)
  const [pfpValue, setPfpValue] = useState(null)
  const { notifyError, notifySuccess } = useNotify()
  const { hideModal } = usePopUpModal()
  const { user, refreshUserInfo } = useProfile()
  const router = useRouter()

  function hasWhiteSpace(s) {
    return /\s/g.test(s)
  }

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
    if (communityName.length > 26) {
      notifyError('Community name must be less than 26 characters')
      setLoading(false)
      return
    }
    if (hasWhiteSpace(communityName.trim())) {
      notifyError('Community tag cannot contain spaces')
      setLoading(false)
      return
    }
    // change space to _ for all file in files
    // const PFP = await uploadFileToIpfs(communityPfp)
    // const Banner = await uploadFileToIpfs(communityBanner)
    const { url: pfpUrl } = await uploadToIPFS(communityPfp)
    const { url: bannerUrl } = await uploadToIPFS(communityBanner)
    await handleCreateCommunity(pfpUrl, bannerUrl)
  }

  const handleCreateCommunity = async (pfp: string, banner: string) => {
    const communityData = {
      name: communityName.trim(),
      label: communityLabel.trim(),
      description: communityDescription,
      bannerImageUrl: banner,
      logoImageUrl: pfp
    }
    try {
      await postCreateCommunity(communityData).then(async (res) => {
        const resData = await res.json()
        if (res.status !== 200) {
          const msg = resData.msg
          notifyError(msg)
          setLoading(false)
          return
        }
        notifySuccess('Community created successfully')
        refreshUserInfo()
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
    if (!filePicked) return
    if (filePicked.size > 5000000) {
      notifyError('File size must be less than 5mb')
      return
    }
    setCommunityBanner(filePicked)
    setHeaderValue(URL.createObjectURL(filePicked))
  }

  const handlePfpChange = (event) => {
    const filePicked = event.target.files[0]
    if (!filePicked) return
    if (filePicked.size > 5000000) {
      notifyError('File size must be less than 5mb')
      return
    }
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

  const [communityNameError, setCommunityNameError] = useState(null)

  const checkCommunityName = async () => {
    const isExist = await postGetCommunityExistStatus(communityName)
    if (isExist) {
      setCommunityNameError('Community name already exists')
      return
    }
    setCommunityNameError(null)
  }

  return (
    <>
      <PopUpWrapper
        title="Create Community"
        onClick={handleSubmit}
        label="CREATE"
        loading={loading}
      >
        <div className="text-p-text">
          <label htmlFor="communityHeader">
            <div className="flex h-44 border-y border-p-border items-center justify-center cursor-pointer">
              {/* eslint-disable-next-line */}
              {headerValue && (
                <img
                  className="inset-0 object-cover h-full w-full "
                  src={headerValue}
                  alt="Header"
                />
              )}
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
            } h-24 w-24 border-s-border rounded-full bottom-10 ml-3 items-center justify-center bg-p-bg z-10 cursor-pointer`}
          >
            {communityPfp && (
              <label htmlFor="communityPfp">
                {' '}
                <img
                  className="rounded-full object-cover w-[100px] h-[100px]"
                  src={pfpValue}
                  alt="PFP"
                />
              </label>
            )}
            <div className="absolute">
              <label htmlFor="communityPfp">
                <div className="bg-p-bg rounded-full p-2 cursor-pointer">
                  <AiOutlineCamera className="h-8 w-8 " />
                </div>
              </label>
            </div>
          </div>

          <div className="text-s-text text-sm mx-4">
            <span className="font-bold">{user.communityCreationSpells}</span>{' '}
            Creation Spells remaining use wisely
          </div>

          <FormTextInput
            value={communityName}
            onChange={onChangeCommunityName}
            // @ts-ignore
            required
            maxLength={26}
            onBlur={() => checkCommunityName()}
            errorMsg={communityNameError}
            startingLetters="c/"
          />
          <FormTextInput
            label="Name"
            placeholder="Got a cool name ?"
            value={communityLabel}
            onChange={(e) => {
              setCommunityLabel(e.target.value)
            }}
            maxLength={60}
          />
          <FormTextInput
            label="Short Description"
            placeholder="What your community is about ?"
            value={communityDescription}
            onChange={onChangeCommunityDescription}
            // @ts-ignore
            required
            maxLength={200}
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
