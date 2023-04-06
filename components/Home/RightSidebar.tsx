import React, { useEffect, useState } from 'react'
import {
  getAllCommunities,
  getCreatedCommunitiesApi
  // getNotJoinedCommunities
} from '../../api/community'
// import { useNotify } from '../Common/NotifyContext'
import { useProfile } from '../Common/WalletContext'
import { HiOutlineSparkles } from 'react-icons/hi'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'
import useHideSidebar from './hook/useHideSidebar'
import CopyrightAndLinks from '../Common/UI/CopyrightAndLinks'
import CommunitiesDiv from '../Common/UI/CommunitiesDiv'
import { useLensUserContext } from '../../lib/LensUserContext'
import getAvatar from '../User/lib/getAvatar'
import formatHandle from '../User/lib/formatHandle'

const RightSidebar = () => {
  const hide = useHideSidebar()
  const { user, LensCommunity, allLensCommunities } = useProfile()
  const { data: lensProfile } = useLensUserContext()
  // const { notifyError } = useNotify()

  const [createdCommunities, setCreatedCommunities] = useState([])
  const [topCommunities, setTopCommunities] = useState([])

  const fetchAndSetCreatedCommunities = async () => {
    try {
      const communities = await getCreatedCommunitiesApi()
      if (communities.length > 0) {
        setCreatedCommunities(communities)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTopCommunities = async () => {
    try {
      const communities = await getAllCommunities(6, 0, 'top', true)
      console.log('topcommunities', communities)

      if (communities?.communities?.length > 0) {
        setTopCommunities(communities.communities)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // const fetchTopNotJoinedCommunities = async () => {
  //   try {
  //     const communities = await getNotJoinedCommunities(6, 0, 'top')
  //     if (communities?.communities?.length > 0) {
  //       setTopCommunities(communities.communities)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     notifyError("Couldn't fetch top communities")
  //   }
  // }

  useEffect(() => {
    console.log('user', user)
    // if (!user) {
    fetchTopCommunities()
    //   return
    // }
    fetchAndSetCreatedCommunities()
    // fetchTopNotJoinedCommunities()
  }, [user])

  useEffect(() => {
    if (topCommunities.length > 0) return
    if (!user) {
      fetchTopCommunities()
    }
  }, [])

  // sort alllenscommunities by followers
  const sortedLensCommunities = allLensCommunities
    ?.sort((a, b) => b.stats.totalFollowers - a.stats.totalFollowers)
    .slice(0, 6)

  return (
    <div
      className={`relative ${
        hide ? 'hidden' : 'lg:flex flex-col'
      } w-[150px] md:w-[200px] lg:w-[300px] xl:w-[350px] py-4 pr-4 md:pr-6 lg:pr-10 xl:pr-12 pl-2 md:pl-2 lg:pl-4 xl:pl-6 overflow-scroll no-scrollbar`}
    >
      {user && (createdCommunities?.length > 0 || LensCommunity) && (
        <CommunitiesDiv
          showFirstCommunities={
            LensCommunity
              ? [
                  {
                    name: formatHandle(lensProfile?.defaultProfile?.handle),
                    // @ts-ignore
                    logoImageUrl: getAvatar(lensProfile?.defaultProfile),
                    isLensCommunity: true
                  }
                ]
              : []
          }
          text={`Created ${
            createdCommunities.length > 1 ? 'Communities' : 'Community'
          }`}
          communitiesList={createdCommunities}
          Icon={() => <AiOutlineUsergroupAdd className="w-[20px] h-[20px]" />}
        />
      )}
      {topCommunities?.length > 0 && (
        <CommunitiesDiv
          showFirstCommunities={
            sortedLensCommunities.length > 0
              ? sortedLensCommunities.map((c) => ({
                  name: formatHandle(c.handle),
                  // @ts-ignore
                  logoImageUrl: getAvatar(c),
                  isLensCommunity: true,
                  verified: c?.verified
                }))
              : []
          }
          text="Recommended Communities"
          communitiesList={topCommunities}
          Icon={() => <HiOutlineSparkles className="w-[20px] h-[20px]" />}
        />
      )}
      {/* <CommunitiesDiv
        text="Recommended Communities"
        showFirstCommunities={
          sortedLensCommunities.length > 0
            ? sortedLensCommunities.map((c) => ({
                name: formatHandle(c.handle),
                // @ts-ignore
                logoImageUrl: getAvatar(c),
                verified: c?.verified,
                isLensCommunity: true
              }))
            : []
        }
        communitiesList={[
          {
            name: 'DiverseHQ',
            logoImageUrl:
              'https://firebasestorage.googleapis.com/v0/b/diversehq-21330.appspot.com/o/image%2F0xb522133dbd9c8b424429d89d821aeb2a115db678%2Fpwa_icon.png?alt=media&token=299048f9-9722-4427-8ccf-21b9bb713953'
          },
          {
            name: 'photography',
            logoImageUrl:
              'https://firebasestorage.googleapis.com/v0/b/diversehq-21330.appspot.com/o/image%2F0xf2c42d45511d33ac0940c5a3160aad847f3010c0%2FInShot_%DB%B2%DB%B0%DB%B2%DB%B1%DB%B0%DB%B7%DB%B0%DB%B3_%DB%B1%DB%B6%DB%B2%DB%B3%DB%B0%DB%B0%DB%B6%DB%B2%DB%B5.jpg?alt=media&token=8fb4ad3f-5186-4f10-855b-4475acd6a832'
          },
          {
            name: 'crypto',
            logoImageUrl:
              'https://firebasestorage.googleapis.com/v0/b/diversehq-21330.appspot.com/o/image%2F0xB522133dBd9C8B424429D89d821aeb2a115dB678%2F1024px-Bitcoin.svg.png?alt=media&token=0c1a96bf-5f22-4500-8d2c-a974f12aceaf'
          },
          {
            name: 'DankMeems',
            logoImageUrl:
              'https://firebasestorage.googleapis.com/v0/b/diversehq-21330.appspot.com/o/image%2F0x9054E37Eac6D11791caF5b3a4fd9ec4Bc1B4dfD8%2Fpepe_emoji.jpg?alt=media&token=3b046b12-41df-4463-bda8-53232aa68544'
          },
          {
            name: 'gaming',
            logoImageUrl:
              'https://firebasestorage.googleapis.com/v0/b/diversehq-21330.appspot.com/o/image%2F0xB522133dBd9C8B424429D89d821aeb2a115dB678%2Fgod-of-war-walkthrough-guide-5004-1642178551828.jpg?alt=media&token=80ca3af2-0573-4e1a-9b23-2541b17eaa93'
          },
          {
            name: 'anime',
            logoImageUrl:
              'https://firebasestorage.googleapis.com/v0/b/diversehq-21330.appspot.com/o/image%2F0xB522133dBd9C8B424429D89d821aeb2a115dB678%2FEren_Jaeger_(Anime)_character_image_(850).png?alt=media&token=72a4402b-c439-4b4f-9cc8-d4ee42b202c1'
          }
        ]}
        Icon={() => <HiOutlineSparkles className="w-[20px] h-[20px]" />}
      /> */}
      <CopyrightAndLinks />
    </div>
  )
}

export default RightSidebar
