import React, { useCallback, useState } from 'react'
import { AiOutlineCamera } from 'react-icons/ai'
import { putUpdateUser } from '../../api/user'
import { uploadFileToIpfs } from '../../utils/utils'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import { useNotify } from '../Common/NotifyContext'
import PopUpWrapper from '../Common/PopUpWrapper'
import FormTextArea from '../Common/UI/FormTextArea'
import FormTextInput from '../Common/UI/FormTextInput'
import { useProfile } from '../Common/WalletContext'

const EditProfile = ({user, showUserInfo}) => {
    console.log("user",user)
    const [loading,setLoading] = useState(false)
    const [profileBanner,setProfileBanner] = useState(user?.bannerImageUrl)
    const [profileImage,setProfileImage] = useState(user?.profileImageUrl)
    const [profileBannerFile,setProfileBannerFile] = useState(null)
    const [profileImageFile,setProfileImageFile] = useState(null)
    const [name,setName] = useState(user?.name)
    const [bio,setBio] = useState(user?.bio)

    const {token, refreshUserInfo} = useProfile()
    const { notifyError, notifySuccess } = useNotify()
    const {hideModal} = usePopUpModal()


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if(!name || !bio){
            setLoading(false)
            notifyError('Please fill all fields')
            return
        }
        try{
            const profileData = {
                name,
                bio
            }
            if(profileImageFile){
                const profile = await uploadFileToIpfs(profileImageFile)
                profileData.profileImageUrl = profile
            }
            if(profileBannerFile){
                const banner = await uploadFileToIpfs(profileBannerFile)
                profileData.bannerImageUrl = banner
            }
            const resp = await putUpdateUser(token,profileData)
            const resData = await resp.json()
            if(resp.status !== 200){
                setLoading(false)
                notifyError(resData.msg)
                return
            }
            await refreshUserInfo()
            await showUserInfo()
            setLoading(false)
            notifySuccess('Profile updated successfully')
            hideModal()

        } catch(error){
            setLoading(false)
            console.log(error)
            notifyError(error.message)
            
        }

    }

    const onChangeName = useCallback((e) => {
        setName(e.target.value)
    },[])

    const onChangeBio = useCallback((e) => {
        setBio(e.target.value)
    },[])

    const handleProfileImageChange = (e) => {
        const filePicked = e.target.files[0]
        if(!filePicked) return;
        setProfileImageFile(filePicked)
        setProfileImage(URL.createObjectURL(filePicked))
    }

    const handleProfileBannerChange = (e) => {
        const filePicked = e.target.files[0]
        if(!filePicked) return;
        setProfileBannerFile(filePicked)
        setProfileBanner(URL.createObjectURL(filePicked))
    }
  return (
    <>
    <PopUpWrapper title="Edit Profile" label="SAVE" onClick={handleSubmit} loading={loading} isDisabled={!token}>
    <div>
        <label htmlFor='profileBanner'><div className="flex h-44 border-y border-s-text items-center justify-center">
          {/* eslint-disable-next-line */}
            {profileBanner && <img className="inset-0 object-cover h-full w-full " src={profileBanner} alt="Header"/> }
            <div className='absolute flex flex-row'>
              <div className='bg-p-bg rounded-full p-2'><AiOutlineCamera className="h-8 w-8" /></div>
              
            </div>
          </div>
        </label>

        <div className={`flex relative ${profileImage ? "" : "border"} h-24 w-24 border-s-text rounded-full bottom-10 ml-3 items-center justify-center bg-p-bg z-10`}>
          {profileImage && <label htmlFor="profileImage"> <img className="rounded-full w-24 h-24" src={profileImage} alt="PFP"/></label>}
          <div className="absolute"><label htmlFor='profileImage'><div className='bg-p-bg rounded-full p-2'><AiOutlineCamera className="h-8 w-8 " /></div></label></div>
        </div>

        <FormTextInput label="Name" placeholder="Your Sudo Name" value={name} onChange={onChangeName} required/>
        <FormTextArea label="Bio" placeholder="Show the world what you are..." value={bio} onChange={onChangeBio} required/>
        <input type="file" id="profileImage" placeholder="Commmunity Name" onChange={handleProfileImageChange} required hidden/>
        <input type="file" id="profileBanner" onChange={handleProfileBannerChange} hidden />
      </div>
    </PopUpWrapper>
    </>
  )
}

export default EditProfile