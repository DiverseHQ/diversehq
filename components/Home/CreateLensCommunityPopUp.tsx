import { useRouter } from 'next/router'
import React from 'react'
import { postCreateLensCommunity } from '../../api/community'
import { useLensUserContext } from '../../lib/LensUserContext'
import { usePopUpModal } from '../Common/CustomPopUpProvider'
import { useNotify } from '../Common/NotifyContext'
import PopUpWrapper from '../Common/PopUpWrapper'
import FormTextInput from '../Common/UI/FormTextInput'
import { useProfile } from '../Common/WalletContext'
import formatHandle from '../User/lib/formatHandle'
import getAvatar from '../User/lib/getAvatar'
import getCoverBanner from '../User/lib/getCoverBanner'

const CreateLensCommunityPopUp = () => {
  const { data: lensProfile } = useLensUserContext()
  const [loading, setLoading] = React.useState(false)
  const { notifyError, notifySuccess } = useNotify()
  const router = useRouter()
  const { hideModal } = usePopUpModal()
  const { fetchAndSetLensCommunity } = useProfile()

  const createLensCommunity = async () => {
    setLoading(true)
    try {
      const handle = lensProfile?.defaultProfile?.handle
      const res = await postCreateLensCommunity(handle)
      if (res.status === 200) {
        notifySuccess('Lens community created successfully')
        fetchAndSetLensCommunity()
        router.push(`/l/${formatHandle(handle)}`)
        hideModal()
        return
      }

      if (res.status === 400) {
        const { msg } = await res.json()
        notifyError(msg)
        return
      }

      notifyError('Something went wrong')
    } catch (error) {
      notifyError('Something went wrong')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <PopUpWrapper
      title="Make your lens handle a community"
      label="Create"
      loading={loading}
      onClick={createLensCommunity}
    >
      <div>
        <div className="flex h-44 border-y border-p-border items-center justify-center cursor-pointer">
          <img
            className="inset-0 object-cover h-full w-full"
            // @ts-ignore
            src={getCoverBanner(lensProfile?.defaultProfile)}
            alt="Cover Banner"
          />
        </div>
        <div className="flex flex-row items-start px-4 -mb-6">
          <img
            className="rounded-xl object-cover w-[100px] -translate-y-8 h-[100px] border-4 border-s-bg"
            // @ts-ignore
            src={getAvatar(lensProfile?.defaultProfile)}
            alt="Avatar"
          />
          <div className="flex flex-col ml-4 pt-2">
            <div className="text-s-text font-bold text-lg">
              {lensProfile?.defaultProfile?.name}
            </div>
            <div className="text-s-text font-medium text-sm">
              l/{formatHandle(lensProfile?.defaultProfile?.handle)}
            </div>
          </div>
        </div>
        <FormTextInput
          label="Description"
          value={lensProfile?.defaultProfile?.bio}
          disabled
        />
      </div>
    </PopUpWrapper>
  )
}

export default CreateLensCommunityPopUp
