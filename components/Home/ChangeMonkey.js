import {WalletContext} from "../../utils/WalletContext";
import {useState, useContext} from "react";
import {Web3Storage} from "web3.storage"
const ChangeMonkey = () => {
  const [showModal, setShowModal] = useState(false);
  const [pfp, setPfp] = useState();
  const [name, setName] = useState(null);
  const [bio, setBio] = useState(null);
  const {wallet, token} = useContext(WalletContext);

  const handleSubmit = async(event) => {
    event.preventDefault();
    console.log(name,pfp,bio);
    //change space to _ for all file in files
    if(pfp.length != 1  ){
      alert("Select only one file");
      return;
    }
    // files[0].name = files[0].name.replace(/\s/g, "_");
    const newFiles = [
      new File([pfp[0]],pfp[0].name.replace(/\s/g, "_"),{type: pfp[0].type})
    ]
    // const newfiles = files.map(file => file.name.replace(/\s/g, "_"));
    // console.log(communityPfp, communityBanner);
      const token = process.env.NEXT_PUBLIC_WEB_STORAGE
      const storage = new Web3Storage({ token })
      const cid = await storage.put(newFiles)
      console.log(cid);
      const PFP =`https://dweb.link/ipfs/${cid}/${newFiles[0].name}`
      console.log(PFP)
      await handleProfile(PFP)
      setShowModal(false);
    }

    const handleProfile = async (pfpURL) => {
      const profileData = {
        name: name,
        profileImageUrl: pfpURL,
        bio: bio 
      }
      try{
        await fetch("https://diversehq.herokuapp.com/apiv1/user",{
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization":  token,
          },
          body: JSON.stringify(profileData)
        }).then(res => res.json()).then(res => {
          console.log(res);
        })
      }catch(error){
        console.log(error);
      }
  }

  return (
    <div>
        <div className="pr-4">
        <button className="border border-black bg-purple-800 rounded-full p-3 text-white shadow-md shadow-purple-200"onClick={() => setShowModal(true)} type="button">
        Change Monkey
        </button>
        </div>

      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-3xl font=semibold">Change Monkey</h3>
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
                      Name
                    </label>
                    <input type="text" className="shadow appearance-none border rounded w-full py-2 px-1 text-black" onChange={(e) => setName(e.target.value)} required />
                    <label className="block text-black text-sm font-bold mb-1">
                      Bio
                    </label>
                    <input type="text" className="shadow appearance-none border rounded w-full py-2 px-1 text-black" onChange={(e) => setBio(e.target.value)} required />
                    <label className="block text-black text-sm font-bold mb-1">
                       PFP
                    </label>
                    <input type="file" className="shadow appearance-none border rounded w-full py-2 px-1 text-black" onChange={(e) =>{setPfp(e.target.files)}} required />
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
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default ChangeMonkey