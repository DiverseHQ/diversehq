import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import apiEndpoint from '../../api/ApiEndpoint'
import Image from 'next/image'
import { WalletContext } from '../../utils/WalletContext'
import PostsColumn from '../../components/Post/PostsColumn'
import { useNotify } from '../../utils/NotifyContext'
const CommunityPage = () => {
  const { name } = useRouter().query
  const { user, token, getUserInfo } = React.useContext(WalletContext)
  const { notifyInfo } = useNotify()
  const [community, setCommunity] = useState(null)
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (name) fetchCommunitInformation()
  }, [name])

  useEffect(() => {
    if (community) fetchPostsOfCommunity()
  }, [community])

  const fetchPostsOfCommunity = async () => {
    console.log('triggered fetchPostOfCommunity')
    try {
      if (page !== 0 && page > totalPages) {
        return
      }
      const res = await fetch(`${apiEndpoint}/post/getPostsOfCommunity/${community._id}?` + new URLSearchParams({
        page,
        sortBy: 'date'
      }))
      if (res.ok) {
        const jsonResp = await res.json()
        setPosts([...posts, ...jsonResp.posts])
        setTotalPages(jsonResp.pages)
        setPage(page + 1)
      }
      if (res.status === 400) {
        console.log(res.msg)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const fetchCommunitInformation = async () => {
    try {
      const response = await fetch(`${apiEndpoint}/community/communityInfoUsingName/${name}`)
      if (!response.ok) return
      const community = await response.json()
      console.log(community)
      setCommunity(community)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const joinCommunity = async () => {
    try {
      const resp = await fetch(`${apiEndpoint}/community/join/${community._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      }).then(r => r.json())
      console.log(resp)
      notifyInfo('Joined 😍')
      await getUserInfo()
      await fetchCommunitInformation()
    } catch (error) {
      console.log(error)
    }
  }

  const leaveCommunity = async () => {
    try {
      const resp = await fetch(`${apiEndpoint}/community/leave/${community._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      }).then(r => r.json())
      console.log(resp)
      notifyInfo('Left 😢')

      await getUserInfo()
      await fetchCommunitInformation()
    } catch (error) {
      console.log(error)
    }
  }

  const handleScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target

    if (offsetHeight + scrollTop >= scrollHeight) {
      if (page < totalPages) {
        setPage(page + 1)
      }
    }
  }
  return (
      <>
        {(!community || !user || loading) && <div>Loading...</div>}
        {!loading && community && user &&
            <div onScroll={handleScroll}>
                <Image width="1363px" height="320px" className="rounded-xl object-contain" src={community.bannerImageUrl} />
                <Image width="250px" height="250px" className="rounded-full" src={community.logoImageUrl} />
                <h1>{community.name}</h1>
                <p>{community.description}</p>
                {user.communities.includes(community._id) ? <button onClick={leaveCommunity}>Leave</button> : <button onClick={joinCommunity}>JOIN</button>}
                <div>{community.members.length} members</div>
                {posts && <PostsColumn handleScroll={handleScroll} posts={posts} />}
            </div>
        }

      </>
  )
}

export default CommunityPage
