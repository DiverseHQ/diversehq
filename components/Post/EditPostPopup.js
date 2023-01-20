import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import React, { useCallback, useEffect, useState } from 'react'
import { AiOutlineCamera, AiOutlineClose } from 'react-icons/ai'
import { putEditPost } from '../../api/post'
import { supportedMimeTypes } from '../../lib/interfaces/publication'
import { uploadFileToFirebaseAndGetUrl } from '../../utils/utils'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import { useNotify } from '../Common/NotifyContext'
import PopUpWrapper from '../Common/PopUpWrapper'
import FormTextInput from '../Common/UI/FormTextInput'
import { useProfile } from '../Common/WalletContext'
import ImagesPlugin from '../Lexical/ImagesPlugin'
import LexicalAutoLinkPlugin from '../Lexical/LexicalAutoLinkPlugin'
import {
  $convertToMarkdownString,
  $convertFromMarkdownString,
  TEXT_FORMAT_TRANSFORMERS
} from '@lexical/markdown'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot } from 'lexical'

const TRANSFORMERS = [...TEXT_FORMAT_TRANSFORMERS]

const EditPostPopup = ({ post, setPost }) => {
  console.log('post', post)
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState(post?.title)
  const [content, setContent] = useState(post?.content)
  const [loading, setLoading] = useState(false)
  const { hideModal } = usePopUpModal()
  const [imageUrl, setImageUrl] = useState(post?.postImageUrl)
  const [videoUrl, setVideoUrl] = useState(post?.postVideoUrl)
  const { address } = useProfile()
  const { notifyError, notifySuccess } = useNotify()
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    editor?.update(() => {
      $convertFromMarkdownString(content, TRANSFORMERS)
    })
    return () => {
      editor?.update(() => {
        $getRoot().clear()
      })
    }
  }, [])

  const closeModal = () => {
    hideModal()
  }

  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value)
  }, [])

  const onFileChange = (filePicked) => {
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
      title: title,
      content: content
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
          maxLength={100}
          value={title}
          onChange={onChangeTitle}
          disabled={loading}
        />
        <div className="relative">
          {/* todo toolbar for rich text editor */}
          {/* <ToolbarPlugin /> */}
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="block min-h-[70px] overflow-auto px-4 py-2 border border-p-border rounded-xl m-4 max-h-[300px] sm:max-h-[350px]" />
            }
            placeholder={
              <div className="px-4 text-gray-400 absolute top-2 left-4 pointer-events-none whitespace-nowrap">
                <div>{"What's this about...? (optional)"}</div>
                <div>{'Here, You can write in markdown too!'} </div>
              </div>
            }
          />
          <OnChangePlugin
            onChange={(editorState) => {
              editorState.read(() => {
                const markdown = $convertToMarkdownString(TRANSFORMERS)
                setContent(markdown)
              })
            }}
          />
          <HistoryPlugin />
          <HashtagPlugin />
          <LexicalAutoLinkPlugin />
          <ImagesPlugin
            onPaste={async (files) => {
              const file = files[0]
              if (!file) return
              onFileChange(file)
            }}
          />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
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
          onChange={(e) => {
            const file = e.target.files[0]
            if (!file) return
            onFileChange(file)
          }}
        />
      </div>
    </PopUpWrapper>
  )
}

export default EditPostPopup
