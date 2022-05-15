import React, {useEffect,useState} from 'react'
import { useRouter } from 'next/router'
import apiEndpoint from '../../components/Home/ApiEndpoint';
import Image from 'next/image';
import { WalletContext } from '../../utils/WalletContext';
const CommunityPage = () => {
    const {id} = useRouter().query;
    const [community,setCommunity] = useState(null);
    const [loading,setLoading] = useState(true);
    const{user, token,getUserInfo} = React.useContext(WalletContext);

    useEffect(() => {
        if(id) fetchCommunitInformation();
    },[id])
    const fetchCommunitInformation = async () => {
        try{
            const response = await fetch(`${apiEndpoint}/community/communityinfo/${id}`);
            if(!response.ok) return;
            const community = await response.json();
            console.log(community);
            setCommunity(community);
        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    const joinCommunity = async() => {
        try{
            const resp = await fetch(`${apiEndpoint}/community/join/${id}`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            }).then(r => r.json());
            console.log(resp);
            await getUserInfo();
            await fetchCommunitInformation();
        }catch(error){
            console.log(error);
        }
    }
    const leaveCommunity = async() => {
        try{
            const resp = await fetch(`${apiEndpoint}/community/leave/${id}`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            }).then(r => r.json());
            console.log(resp);
            await getUserInfo();
            await fetchCommunitInformation();
        }catch(error){
            console.log(error);
        }
    }
  return (
      <>
        {(!community || !user || loading) && <div>Loading...</div>}
        {!loading && community && user && 
            <div>
                <Image width="1363px" height="320px" className="rounded-xl object-contain" src={community.bannerImageUrl} />
                <Image width="250px" height="250px" className="rounded-full" src={community.logoImageUrl} />
                <h1>{community.name}</h1>
                <p>{community.description}</p>
                {user.communities.includes(community._id) ? <button onClick={leaveCommunity}>Leave</button>  : <button onClick={joinCommunity}>JOIN</button>}
                <div>{community.members.length} members</div>
            </div>}
      </>
  )
}

export default CommunityPage