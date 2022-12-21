import React from 'react'
import { HiOutlineTrash } from 'react-icons/hi'
import { BiEdit } from 'react-icons/bi'
import { usePopUpModal } from '../Common/CustomPopUpProvider'

const CommentDropdown = ({ handleEditComment, handleDeleteComment }) => {
  const { hideModal } = usePopUpModal()

  const editAndHideModal = async () => {
    await handleEditComment()
    hideModal()
  }

  const deleteAndHideModal = async () => {
    await handleDeleteComment()
    hideModal()
  }

  return (
    <div className="cursor-pointer">
      <div
        className="flex items-center px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow hover:bg-[#eee] hover:cursor-pointer hover:text-red-600"
        onClick={deleteAndHideModal}
      >
        <HiOutlineTrash
          className="mr-1.5 w-4 h-4 sm:w-6 sm:h-6"
          title="Delete"
        />
        <span>Delete</span>
      </div>
      <div
        className="flex items-center px-3 py-2 bg-s-bg rounded-full my-2 button-dropshadow hover:bg-[#eee] hover:cursor-pointer "
        onClick={editAndHideModal}
      >
        <BiEdit className="mr-1.5 w-4 h-4 sm:w-6 sm:h-6" title="Edit" />
        <span>Edit</span>
      </div>
    </div>
  )
}

export default CommentDropdown
