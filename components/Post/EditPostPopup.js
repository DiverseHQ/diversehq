import React, { useCallback, useState } from 'react'
import { AiOutlineCamera, AiOutlineClose } from 'react-icons/ai'
import { putEditPost } from '../../api/post'
import { supportedMimeTypes } from '../../lib/interfaces/publication'
import { uploadFileToFirebaseAndGetUrl } from '../../utils/utils'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import { useNotify } from '../Common/NotifyContext'
import PopUpWrapper from '../Common/PopUpWrapper'
import FormTextInput from '../Common/UI/FormTextInput'
import { useProfile } from '../Common/WalletContext'

const EditPostPopup = ({ post, setPost }) => {
  console.log('post', post)
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState(post?.title)
  const [loading, setLoading] = useState(false)
  const { hideModal } = usePopUpModal()
  const [imageUrl, setImageUrl] = useState(post?.postImageUrl)
  const [videoUrl, setVideoUrl] = useState(post?.postVideoUrl)
  const { address } = useProfile()
  const { notifyError, notifySuccess } = useNotify()

  const closeModal = () => {
    hideModal()
  }

  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value)
  }, [])

  const onFileChange = (event) => {
    const filePicked = event.target.files[0]
    if (!filePicked) return
    setFile(filePicked)
    const url = URL.createObjectURL(filePicked)
    console.log('url', url)
    const type = filePicked.type.split('/')[0]
    console.log('type', type)
    if (type === 'image') {
      setImageUrl(url)
    } else if (type === 'video') {
      console.log('video', url)
      setVideoUrl(url)
    }
  }

  const removeFile = () => {
    setFile(null)
    setImageUrl(null)
    setVideoUrl(null)
  }

  const showAddedFile = () => {
    // check if the file is image or video and show it
    return (
      <div className="flex items-center justify-center">
        <div className="relative w-fit">
          {imageUrl && (
            <img
              src={imageUrl}
              className="max-h-80 rounded-2xl"
              alt="Your amazing post"
            />
          )}

          {videoUrl && (
            <video
              src={videoUrl}
              className="max-h-80 rounded-2xl"
              controls
              autoPlay
            ></video>
          )}
          <AiOutlineClose
            onClick={removeFile}
            className="text-s-text w-7 h-7 bg-p-bg rounded-full p-1 absolute z-10 top-2 right-2"
          />
        </div>
      </div>
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    if (!title) {
      notifyError('Please enter a title')
      setLoading(false)
      return
    }

    if (file) {
      if (!supportedMimeTypes.includes(file.type)) {
        notifyError('File type not supported')
        setLoading(false)
        return
      }
      // file size should be less than 8mb
      if (file.size > 8000000) {
        notifyError('File size should be less than 8mb')
        setLoading(false)
        return
      }

      const postUrl = await uploadFileToFirebaseAndGetUrl(file, address)
      handleEditPost(file.type, postUrl.uploadedToUrl, postUrl.path)
    } else {
      handleEditPost('text')
    }
  }

  const handleEditPost = async (mimeType, url, filePath) => {
    if (!post._id) return
    const postData = {
      title: title
    }

    const type = mimeType.split('/')[0]
    if (mimeType !== 'text') {
      postData[type === 'image' ? 'postImageUrl' : 'postVideoUrl'] = url
      postData.filePath = filePath
    }
    if (post.postImageUrl && !imageUrl) {
      postData.postImageUrl = null
      postData.filePath = null
    }
    if (post.postVideoUrl && !videoUrl) {
      postData.postVideoUrl = null
      postData.filePath = null
    }

    try {
      const res = await putEditPost(post._id, postData)
      const respData = await res.json()
      if (res.status !== 200) {
        notifyError(respData.msg)
        return
      }
      //todo update the post in the state
      setPost({ ...post, ...postData })
      closeModal()
      notifySuccess('Post edited successfully')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    // simple modal
    <PopUpWrapper
      title="Edit Post"
      onClick={handleSubmit}
      label="SAVE"
      loading={loading}
    >
      {/* <!-- Modal body --> */}
      <div>
        <FormTextInput
          label="Title"
          placeholder="Here you go"
          value={title}
          onChange={onChangeTitle}
        />
        <div className="text-base leading-relaxed  m-4">
          {imageUrl || videoUrl ? (
            showAddedFile()
          ) : (
            <label htmlFor="upload-file">
              <div className="h-32 text-s-text flex flex-col justify-center items-center border border-p-border  rounded-xl">
                <div>
                  <AiOutlineCamera className="h-8 w-8" />
                </div>
                <div>Add Image or Video</div>
                <div className="text-sm">(Leave Empty for only text post)</div>
              </div>
            </label>
          )}
        </div>
        <input
          type="file"
          id="upload-file"
          accept="image/*,video/*"
          hidden
          onChange={onFileChange}
        />
      </div>
    </PopUpWrapper>
  )
}

export default EditPostPopup
