import React, { useState, useEffect, useCallback } from 'react'
import { Web3Storage } from 'web3.storage'
import { useProfile } from '../Common/WalletContext'
import apiEndpoint from '../../api/ApiEndpoint'
import { useNotify } from '../Common/NotifyContext'
import { useRouter } from 'next/router'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import Image from 'next/image'
import { postCreatePost } from '../../api/post'
import PopUpWrapper from '../Common/PopUpWrapper'
import { AiOutlineCamera, AiOutlineClose, AiOutlineDown } from 'react-icons/ai'
import FormTextInput from '../Common/UI/FormTextInput'
import { uploadFileToIpfs } from '../../utils/utils'
import { getJoinedCommunitiesApi } from '../../api/community'

const CreatePostPopup = ({ props }) => {
  const [files, setFiles] = useState(null)
  const [title, setTitle] = useState('')
  const [communityId, setCommunityId] = useState(null)
  const { user, token } = useProfile()
  const [loading, setLoading] = useState(false)
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const [imageValue, setImageValue] = useState(null)
  const [showCommunityOptions, setShowCommunityOptions] = useState(false)
  const [communityOptionsCoord, setCommunityOptionsCoord] = useState({
    left: '0px',
    top: '0px'
  })

  const { notifyError, notifySuccess } = useNotify()
  const router = useRouter()
  const { hideModal } = usePopUpModal()
  const [showCommunity, setShowCommunity] = useState({ name: '', image: '' })

  const closeModal = () => {
    setShowCommunity({ name: '', image: '' })
    hideModal()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    if (!communityId) {
      notifyError('Please select a community')
      setLoading(false)
      return
    }
    if (!title) {
      notifyError('Please enter a title')
      setLoading(false)
      return
    }
    // change space to _ for all file in files
    if (!files) {
      notifyError('Please select a file')
      setLoading(false)
      return
    } else if (files.length > 1) {
      notifyError('Please select only one file')
      setLoading(false)
      return
    }
    // files[0].name = files[0].name.replace(/\s/g, "_");
    if (files) {
      const newFiles = [
        new File([files], files.name.replace(/\s/g, '_'), { type: files.type })
      ]

      if (files.type.split('/')[0] === 'image') {
        const Post = await uploadFileToIpfs(newFiles)
        handleCreatePost('image', Post)
      }
      if (files.type.split('/')[0] === 'video') {
        const Post = await uploadFileToIpfs(newFiles)
        handleCreatePost('video', Post)
      }
    }
  }
  const handleCreatePost = async (type, url) => {
    const postData = {
      communityId,
      title
    }
    postData[type === 'image' ? 'postImageUrl' : 'postVideoUrl'] = url

    try {
      const resp = await postCreatePost(token, postData)
      const respData = await resp.json()
      if (resp.status !== 200) {
        notifyError(respData.msg)
        return
      }
      closeModal()
      router.push(`/p/${respData._id}`)
      console.log(respData)
      notifySuccess('Post created successfully')
    } catch (error) {
      console.log(error)
    }
  }

  const handleDropDown = (id, name, logoImageUrl) => {
    setShowCommunityOptions(false)
    setCommunityId(id)
    setShowCommunity({ name, image: logoImageUrl })
  }

  const getJoinedCommunities = async () => {
    if (!user?.walletAddress) {
      notifyError('I think you are not logged in')
      return
    }
    const response = await getJoinedCommunitiesApi(user.walletAddress)
    setJoinedCommunities(response)
  }
  const customOptions = () => {
    return (
      <div className="fixed flex flex-row justify-center items-center z-50 top-0 left-0 no-scrollbar w-full h-full">
        <div className="flex justify-center items-center relative w-full h-full">
          <div
            className={`w-full h-full absolute z-0`}
            onClick={() => {
              setShowCommunityOptions(false)
            }}
          ></div>

          <div
            className={`flex flex-col h-fit absolute z-10 ${
              showCommunityOptions
                ? 'enter-fade-animation'
                : 'exit-fade-animation '
            }`}
            style={communityOptionsCoord}
          >
            <div className="bg-s-bg rounded-2xl">
              {joinedCommunities.map((community) => {
                console.log(community)
                return (
                  <div
                    key={community._id}
                    onClick={() => {
                      handleDropDown(
                        community._id,
                        community.name,
                        community.logoImageUrl
                      )
                    }}
                    className="flex flex-row items-center cursor-pointer p-2 m-2 rounded-2xl hover:bg-p-btn"
                    id={community._id}
                    logoImageUrl={community.logoImageUrl}
                  >
                    <Image
                      src={
                        community.logoImageUrl
                          ? community.logoImageUrl
                          : '/gradient.jpg'
                      }
                      className="rounded-full"
                      width={30}
                      height={30}
                    />

                    <div
                      className="text-p-text ml-4 text-base "
                      id={community._id}
                      logoImageUrl={community.logoImageUrl}
                    >
                      {community.name}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
  const onImageChange = (event) => {
    const filePicked = event.target.files[0]
    setFiles(filePicked)
    setImageValue(URL.createObjectURL(filePicked))
  }
  const removeImage = () => {
    setFiles(null)
    setImageValue(null)
  }

  const showAddedFile = () => {
    // check if the file is image or video and show it
    if (!files) return null
    const type = files.type.split('/')[0]
    return (
      <div className="flex items-center justify-center">
        <div className="relative w-fit">
          {type === 'image' && (
            <img
              src={imageValue}
              className="max-h-80 rounded-2xl"
              alt="Your amazing post"
            />
          )}

          {type === 'video' && (
            <video
              src={imageValue}
              className="max-h-80 rounded-2xl"
              controls
            ></video>
          )}
          <AiOutlineClose
            onClick={removeImage}
            className="text-s-text w-7 h-7 bg-p-bg rounded-full p-1 absolute z-10 top-2 right-2"
          />
        </div>
      </div>
    )
  }

  useEffect(() => {
    console.log(communityOptionsCoord)
  }, [communityOptionsCoord])

  const showJoinedCommunities = (e) => {
    setShowCommunityOptions(true)
    setCommunityOptionsCoord({
      top: e.currentTarget.getBoundingClientRect().bottom + 10 + 'px',
      left: e.currentTarget.getBoundingClientRect().left + 'px'
    })
  }

  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value)
  }, [])

  const PopUpModal = () => {
    return (
      // simple modal
      <PopUpWrapper
        title="Create Post"
        onClick={handleSubmit}
        label="POST"
        loading={loading}
      >
        <div className="border border-s-text rounded-full text-p-text ml-3 w-fit px-1">
          <button className="text-blue-500 p-1" onClick={showJoinedCommunities}>
            {showCommunity.name ? (
              <div className="flex justify-center items-center">
                <Image
                  src={showCommunity.image}
                  className="rounded-full"
                  width={30}
                  height={30}
                />
                <h1 className="ml-2">{showCommunity.name}</h1>
              </div>
            ) : (
              <div className="flex flex-row items-center justify-center">
                <div>Choose Community</div>
                <AiOutlineDown className="w-4 h-4 mx-1" />
              </div>
            )}
          </button>
        </div>

        {showCommunityOptions && customOptions()}
        {/* <!-- Modal body --> */}
        <div>
          <FormTextInput
            label="Title"
            placeholder="Here you go"
            value={title}
            onChange={onChangeTitle}
          />
          <div className="text-base leading-relaxed  m-4">
            {files ? (
              showAddedFile()
            ) : (
              <label htmlFor="upload-file">
                <div className="h-32 text-s-text flex flex-col justify-center items-center border border-s-text  rounded-xl">
                  <AiOutlineCamera className="h-8 w-8" />
                  <div>Add Image or Video</div>
                </div>
              </label>
            )}
          </div>
          <input
            type="file"
            id="upload-file"
            accept="image/*,video/*"
            hidden
            onChange={onImageChange}
          />
        </div>
      </PopUpWrapper>
    )
  }

  useEffect(() => {
    if (user) {
      getJoinedCommunities()
    }
  }, [user])

  return <div className="">{PopUpModal()}</div>
}

export default CreatePostPopup
