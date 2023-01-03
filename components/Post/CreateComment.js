import React, { useRef } from 'react'
import { useProfile } from '../Common/WalletContext'
import { postComment } from '../../api/comment'
import { FiSend } from 'react-icons/fi'
// import { FaHandSparkles } from 'react-icons/fa'
// import { useSigner } from 'wagmi'
// import ABI from '../../utils/DiveToken.json'
// import { ethers, utils } from 'ethers'
// import { useNotify } from '../Common/NotifyContext'
// import { DIVE_CONTRACT_ADDRESS_MUMBAI } from '../../utils/config.ts'

const CreateComment = ({ postId, setComments, authorAddress }) => {
  const { user } = useProfile()
  const commentRef = useRef()
  console.log('authorAddress', authorAddress)
  // const appreciateAmountRef = useRef()
  // const { data: signer } = useSigner()
  // const [diveContract, setDiveContract] = useState(null)
  // const { notifyError, notifySuccess } = useNotify()

  // useEffect(() => {
  //   if (signer) {
  //     const contract = new ethers.Contract(
  //       DIVE_CONTRACT_ADDRESS_MUMBAI,
  //       ABI,
  //       signer
  //     )
  //     setDiveContract(contract)
  //   }
  // }, [signer])

  // const transferGiveAppreciateAmount = async (appreciateAmount) => {
  //   try {
  //     console.log('authroAddress', authorAddress)
  //     console.log('appreciateAddress', appreciateAmount)
  //     if (!diveContract) return
  //     const res = await diveContract.transfer(authorAddress, appreciateAmount, {
  //       gasLimit: 3000000,
  //       gasPrice: 30000000000
  //     })
  //     const receipt = await res.wait()
  //     if (receipt.status === 1) {
  //       console.log(
  //         'Tokens transferred: https://rinkeby.etherscan.io/tx/' + res.hash
  //       )
  //       notifySuccess('Tokens Transferred Successfully')
  //     } else {
  //       console.log('Tokens transfer failed')
  //       notifyError('Tokens Transfer Failed')
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const createComment = async () => {
  //   const comment = commentRef.current.value
  //   const appreciateAmount = appreciateAmountRef.current.value
  //   if (!comment) return
  //   const content = comment
  //   console.log('postId', postId)
  //   console.log('comment', comment)
  //   try {
  //     const comment = await postComment(content, postId, appreciateAmount)
  //     console.log(comment)
  //     addCommentIdToComments(comment._id)

  //     // clear the comment input field after submit
  //     commentRef.current.value = ''
  //     if (appreciateAmount > 0) {
  //       const wei = utils.parseEther(appreciateAmount.toString())
  //       console.log('wei', wei)
  //       transferGiveAppreciateAmount(wei)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const createComment = async () => {
    const comment = commentRef.current.value
    if (!comment || comment === '') return
    const content = comment
    console.log('postId', postId)
    console.log('comment', comment)
    try {
      const comment = await postComment(content, postId, 0)
      setComments((comments) => [comment, ...comments])

      // clear the comment input field after submit
      commentRef.current.value = ''
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      {user && (
        <div className="px-3 sm:px-5 items-center w-full bg-s-bg py-3 sm:rounded-2xl ">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row items-center">
              <img
                src={
                  user.profileImageUrl ? user.profileImageUrl : '/gradient.jpg'
                }
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
              />
              <div className="ml-2 font-bold text-base">
                {user.name
                  ? user.name
                  : user.walletAddress.substring(0, 6) + '...'}
              </div>
            </div>
            <div className="flex flex-row items-center justify-center">
              <FiSend
                onClick={createComment}
                className="w-4 h-4 sm:w-6 sm:h-6 text-p-text"
              />
            </div>
          </div>
          <div className="pl-8 sm:pl-10">
            <input
              type="text"
              ref={commentRef}
              className="border-none outline-none w-full mt-1 text-xs sm:text-base bg-s-bg"
              placeholder="Write a comment..."
              onKeyUp={(e) => {
                if (e.key === 'Enter') createComment()
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default CreateComment
