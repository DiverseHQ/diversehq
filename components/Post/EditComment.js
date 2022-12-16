import React, { useState, useCallback } from 'react'
import PopUpWrapper from '../Common/PopUpWrapper'
import FormTextInput from '../Common/UI/FormTextInput'
import { useNotify } from '../Common/NotifyContext'
import { putEditComment } from '../../api/comment'
import { useProfile } from '../Common/WalletContext'
import { usePopUpModal } from '../Common/CustomPopUpProvider'

const EditComment = ({ comment }) => {
  const [loading, setLoading] = useState(false)
  const [content, setNewContent] = useState(comment?.content)
  const { notifyError, notifySuccess } = useNotify()
  const { token } = useProfile()
  const { hideModal } = usePopUpModal()

  console.log(comment)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    console.log('Submitted')
    if (!content) {
      setLoading(false)
      notifyError('Please fill the field.')
      return
    }
    try {
      const commentData = { ...comment, content }
      console.log(commentData)
      // it contains the authorDetails key which is not in the comments schema
      delete commentData.authorDetails
      console.log(commentData)
      const res = await putEditComment(token, commentData)
      const resData = await res.json()
      if (res.status !== 200) {
        setLoading(false)
        notifyError(resData.msg)
        return
      }
      setLoading(false)
      notifySuccess('Comment Updated')
      hideModal()
    } catch (error) {
      setLoading(false)
      console.log(error)
      notifyError(error.message)
    }
  }

  const onCommentChange = useCallback((e) => {
    setNewContent(e.target.value)
  })

  return (
    <>
      <PopUpWrapper
        title="Edit Comment"
        label="SAVE"
        onClick={handleSubmit}
        loading={loading}
      >
        <div>
          <FormTextInput
            label="Comment"
            placeholder="Your updated comment"
            value={content}
            onChange={onCommentChange}
            required
          />
        </div>
      </PopUpWrapper>
    </>
  )
}

export default EditComment
