import { useState } from 'react'
import { Web3Storage } from 'web3.storage'
import { useProfile } from '../Common/WalletContext'
import apiEndpoint from '../../api/ApiEndpoint'
import { AiOutlineCamera, AiOutlineClose } from 'react-icons/ai'
import { useNotify } from '../Common/NotifyContext'
import { modalType, usePopUpModal } from '../Common/CustomPopUpProvider'
import { postCreateCommunity } from '../../api/community'
import PopUpWrapper from '../Common/PopUpWrapper'

const CreateCommunity = () => {
  const [communityName, setCommunityName] = useState('')
  const [communityPfp, setCommunityPfp] = useState()
  const [communityBanner, setCommunityBanner] = useState()
  const [communityDescription, setCommunityDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const { wallet, token } = useProfile()
  const [headerValue, setHeaderValue] = useState(null)
  const [pfpValue, setPfpValue] = useState(null)
  const { notifyInfo, notifyError, notifySuccess } = useNotify()
  const { showModal, hideModal } = usePopUpModal()

  function hasWhiteSpace (s) {
    return /\s/g.test(s)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    console.log(communityName, communityPfp, communityBanner, communityDescription)
    if (!communityName || !communityPfp || !communityBanner || !communityDescription) {
      notifyError('Please fill in all fields')
      setLoading(false)
      return
    }
    // change space to _ for all file in files
    console.log(communityPfp, communityBanner)
    // files[0].name = files[0].name.replace(/\s/g, "_");
    const newFiles = [
      new File([communityPfp], communityPfp.name.replace(/\s/g, '_'), { type: communityPfp.type }),
      new File([communityBanner], communityBanner.name.replace(/\s/g, '_'), { type: communityBanner.type })
    ]
    // const newfiles = files.map(file => file.name.replace(/\s/g, "_"));
    // console.log(communityPfp, communityBanner);
    const token = process.env.NEXT_PUBLIC_WEB_STORAGE
    const storage = new Web3Storage({ token })
    const cid = await storage.put(newFiles)
    console.log(cid)
    const PFP = `https://dweb.link/ipfs/${cid}/${newFiles[0].name}`
    console.log(PFP)
    const Banner = `https://dweb.link/ipfs/${cid}/${newFiles[1].name}`
    console.log(Banner)
    await handleCreateCommunity(PFP, Banner)
    setLoading(false)
  }

  const handleCreateCommunity = async (pfpURL, bannerURL) => {
    const communityData = {
      name: communityName,
      description: communityDescription,
      bannerImageUrl: bannerURL,
      logoImageUrl: pfpURL,
      creator: wallet
    }
    try {
      await postCreateCommunity(token, communityData).then(res => {
        console.log(res)
        notifySuccess('Community created successfully')
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleHeaderChange = (event) => {
    const filePicked = event.target.files[0]
    console.log("filePicked",filePicked)
    if(!filePicked) return
    setCommunityBanner(filePicked)
    console.log("filePicked",filePicked);
    setHeaderValue(URL.createObjectURL(filePicked))
  }

  const handlePfpChange = (event) => {
    const filePicked = event.target.files[0]
    setCommunityPfp(filePicked)
    setPfpValue(URL.createObjectURL(filePicked))
  }

  const removeHeader =(e) => {
    e.preventDefault()
    setHeaderValue(null)
    setCommunityBanner(null)
  }

  return (
    <>
    <PopUpWrapper title="Create Community" onClick={handleSubmit} label="CREATE" loading={loading} >
      <div>
        <label htmlFor='communityHeader'><div className="flex h-44 border-y border-s-text items-center justify-center">
          {headerValue && <img className="inset-0 object-cover h-full w-full " src={headerValue} alt="Header"/> }
          <div className='absolute flex flex-row'>
            <label htmlFor="communityHeader"><AiOutlineCamera className="h-8 w-8" /></label>
            {headerValue && <AiOutlineClose className="h-8 w-8 ml-4" onClick={removeHeader}/>}
          </div>
        </div></label>

<div className="flex relative border h-24 w-24 border-bg-p rounded-full bottom-10 ml-3 items-center justify-center">

 {

 communityPfp && (

 <img className="inset-0 h-full w-full rounded-full" src={pfpValue} alt="PFP"/>

)

}

<button className="absolute p-1"><label htmlFor="communityPfp"><AiOutlineCamera className="h-4 w-4" /></label></button>

</div>
 <input type="text" className="w-full py-2 px-1 text-p-text mb-2 bg-p-bg border-none" placeholder="Commmunity Name" onChange={(e) => setCommunityName(e.target.value)} required />
 <textarea type="text" className="w-full py-2 px-1 text-p-text mb-2 bg-p-bg border-none" placeholder="Commmunity Description" onChange={(e) => setCommunityDescription(e.target.value)} />
<input type="file" id="communityPfp" placeholder="Commmunity Name" onChange={handlePfpChange} required hidden/>
<input type="file" id="communityHeader" onChange={handleHeaderChange} hidden />
</div>
            </PopUpWrapper>
    </>
  )
}

export default CreateCommunity
