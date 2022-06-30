import {useState, useContext} from "react";
import {Web3Storage} from "web3.storage"
import {useProfile} from "../../utils/WalletContext";
import apiEndpoint from "./ApiEndpoint";


const CreateCommunity = () => {
  const [showModal, setShowModal] = useState(false);
  const [communityName, setCommunityName] = useState('')
  const [communityPfp,setCommunityPfp] = useState();
  const [communityBanner,setCommunityBanner] = useState();
  const [communityDescription,setCommunityDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const {wallet, token} = useProfile();

  function hasWhiteSpace(s) {
    return /\s/g.test(s);
  }

  const handleSubmit = async(event) => {
    event.preventDefault();
    setLoading(true);
    console.log(communityName,communityPfp,communityBanner,communityDescription);
    //change space to _ for all file in files
    if(communityPfp.length != 1 && communityBanner != 1 ){
      alert("Select only one file");
      return;
    }
    // files[0].name = files[0].name.replace(/\s/g, "_");
    const newFiles = [
      new File([communityPfp[0]],communityPfp[0].name.replace(/\s/g, "_"),{type: communityPfp[0].type}),
      new File([communityBanner[0]],communityBanner[0].name.replace(/\s/g, "_"),{type: communityBanner[0].type}),  
    ]
    // const newfiles = files.map(file => file.name.replace(/\s/g, "_"));
    // console.log(communityPfp, communityBanner);
      const token = process.env.NEXT_PUBLIC_WEB_STORAGE
      const storage = new Web3Storage({ token })
      const cid = await storage.put(newFiles)
      console.log(cid);
      let PFP =`https://dweb.link/ipfs/${cid}/${newFiles[0].name}`
      console.log(PFP)
      let Banner =`https://dweb.link/ipfs/${cid}/${newFiles[1].name}`
      console.log(Banner)
      await handleCreateCommunity(PFP,Banner)
      setLoading(false);
      setShowModal(false);
    }


    const handleCreateCommunity = async (pfpURL,bannerURL) => {
        const postData = {
          name: communityName,
          description: communityDescription,
          bannerImageUrl: bannerURL,
          logoImageUrl: pfpURL,
          creator: wallet
        }
        try{
          await fetch(`${apiEndpoint}/community`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization":  token,
            },
            body: JSON.stringify(postData)
          }).then(res => res.json()).then(res => {
            console.log(res);
          })
        }catch(error){
          console.log(error);
        }
    }

  return (
    <>
      <div className="pr-4">
        <button className="border border-black bg-purple-800 rounded-full p-3 text-white shadow-md shadow-purple-200"onClick={() => setShowModal(true)} type="button">
        Create Community
        </button>
        </div>

      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font=semibold">What's up Creative human?</h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                      x
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <form className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 w-full">
                  <label className="block text-black text-sm font-bold mb-1">
                      Community Name
                    </label>
                    <input type="text" className="shadow appearance-none border rounded w-full py-2 px-1 text-black" onChange={(e) => setCommunityName(e.target.value)} required />
                    <label className="block text-black text-sm font-bold mb-1">
                      Community Banner
                    </label>
                    <input type="file" className="shadow appearance-none border rounded w-full py-2 px-1 text-black" onChange={(e) =>{setCommunityBanner(e.target.files)}} />
                    <label className="block text-black text-sm font-bold mb-1">
                      Community PFP
                    </label>
                    <input type="file" className="shadow appearance-none border rounded w-full py-2 px-1 text-black" onChange={(e) =>{setCommunityPfp(e.target.files)}} required />
                    <label className="block text-black text-sm font-bold mb-1">
                      Description
                    </label>
                    <input type="text" className="shadow appearance-none border rounded w-full py-2 px-1 text-black" onChange={(e) => setCommunityDescription(e.target.value)} required />
      
                  </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading? 'Hold MotheFuckka...': 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default CreateCommunity