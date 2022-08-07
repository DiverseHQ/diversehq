
import { useProfile } from '../Common/WalletContext'
import  { useRouter } from 'next/router'
import CreatePostButton from './CreatePostButton'
import Image from 'next/image'
import { MdOutlineExplore } from 'react-icons/md'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import ClickOption from './ClickOption'

const Nav = () => {
  const { user } = useProfile()
  const router = useRouter()
  const { showModal} = usePopUpModal();
  
  const routeToExplore = () => {
    router.push('/explore')
  }

  const routeToHome = () => {
    router.push('/')
  }

  const showMoreOptions = (e) => {
    // setShowOptions(!showOptions)
    showModal( 
      {
        component: <ClickOption />,
        type: modalType.customposition,
        onAction: () => {},
        extraaInfo: {
          bottom: window.innerHeight - e.currentTarget.getBoundingClientRect().top+ 10 + 'px',
          left: e.currentTarget.getBoundingClientRect().left + 'px'
        }
      }
    )
  }


  return (
    <>
    <div className="fixed top-0 left-24 pt-6 pb-14 flex flex-col justify-between items-center h-full">
        <div className="flex flex-col items-center">
          <div className='mb-7 hover:cursor-pointer' onClick={routeToHome}>
          <Image src="/logo.png" width="45" height="45" className='rounded-full'/>
          </div>
        <MdOutlineExplore className="w-12 h-12 mb-7 hover:cursor-pointer" onClick={routeToExplore}/>
        <CreatePostButton />

        </div>
        <div className='flex-end hover:cursor-pointer' onClick={showMoreOptions}>
          {user?.profileImageUrl && <img src={user.profileImageUrl} className='w-12 h-12 rounded-full' />}
          {user && !user.profileImageUrl && <Image src="/gradient.jpg" width="48" height="48" className='rounded-full' />}
          
        
        </div>
    </div>
    </>
  )
}

export default Nav
