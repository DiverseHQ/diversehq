import React from 'react'
import { useRouter } from 'next/router'
import { useProfile } from '../Common/WalletContext'
import { useDisconnect } from 'wagmi'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import MoreOptionsModal from '../Common/UI/MoreOptionsModal'

import { CgProfile } from 'react-icons/cg'
import { AiOutlineDisconnect } from 'react-icons/ai'

const ClickOption = () => {
  const router = useRouter()
  const { user } = useProfile()
  const { disconnect } = useDisconnect()
  const { hideModal } = usePopUpModal()

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

  const routeToUserProfile = () => {
    if (user) {
      router.push(`/u/${user.walletAddress}`)
    }
    hideModal()
  }

  const disconnectAndClear = () => {
    disconnect()
    hideModal()
  }

  // const toggleTheme = () => {
  //   setTheme(theme === 'dark' ? 'light' : 'dark')
  // }

  // const claimTokens = async () => {
  //   const res = await diveContract.claimTokens(
  //     DIVE_CONTRACT_ADDRESS_MUMBAI,
  //     ethers.utils.parseEther(claimAmount.toString()),
  //     { gasLimit: 3000000, gasPrice: 30000000000 }
  //   )
  //   const receipt = await res.wait()
  //   if (receipt.status === 1) {
  //     console.log('Tokens claimed: https://rinkeby.etherscan.io/tx/' + res.hash)
  //     notifySuccess('Tokens Claimed Successfully')
  //   } else {
  //     notifyError('Tokens Claim Failed')
  //   }
  // }

  return (
    <MoreOptionsModal
      list={[
        {
          label: 'View Profile',
          onClick: routeToUserProfile,
          icon: () => <CgProfile className="mr-1.5 w-4 h-4 sm:w-5 sm:h-5" />
        },
        {
          label: 'Disconnect',
          onClick: disconnectAndClear,
          icon: () => (
            <AiOutlineDisconnect className="mr-1.5 w-4 h-4 sm:w-5 sm:h-5" />
          )
        }
      ]}
    />
  )
}

export default ClickOption
