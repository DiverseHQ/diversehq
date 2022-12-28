import React from 'react'
import { HiOutlineTrash } from 'react-icons/hi'
import { usePopUpModal } from '../Common/CustomPopUpProvider'

const PostDeleteDropdown = ({ handleDeletePost }) => {
  const { hideModal } = usePopUpModal()

  const deletePostAndCloseModal = async () => {
    await handleDeletePost()
    hideModal()
  }

  return (
    <div className="cursor-pointer">
      <div
        className="flex items-center px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow hover:bg-[#eee] hover:cursor-pointer hover:text-red-600"
        onClick={deletePostAndCloseModal}
      >
        <HiOutlineTrash
          className="mr-1.5 w-4 h-4 sm:w-6 sm:h-6"
          title="Delete"
        />
        <span>Delete</span>
      </div>
    </div>
  )
}

export default PostDeleteDropdown
