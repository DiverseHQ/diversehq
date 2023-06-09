import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BsStars } from 'react-icons/bs'
import { useLensUserContext } from '../../lib/LensUserContext'
import getPostWithCommunityInfo from '../../lib/post/getPostWithCommunityInfo'
import { NotificationSchema } from '../../types/notification'
import formatHandle from '../User/lib/formatHandle'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'

const NotificationJoinedCommunityPost = ({
  notification
}: {
  notification: NotificationSchema
}) => {
  console.log('notification', notification)
  const [post, setPost] = useState(null)
  const { data } = useLensUserContext()

  const fetchAndSetPost = async () => {
    const postId = notification?.extraInfo
    const response = await getPostWithCommunityInfo({
      request: {
        publicationId: postId
      },
      profileId: data?.defaultProfile?.id ?? null,
      reactionRequest: {
        profileId: data?.defaultProfile?.id ?? null
      }
    })

    setPost(response)
  }
  useEffect(() => {
    fetchAndSetPost()
  }, [notification?.refId])
  if (!post) return null
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div className="flex flex-row flex-wrap space-x-1">
          <span>New Post from</span>
          <span
            className="hover:underline font-bold"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={`/u/${formatHandle(post?.profile?.handle)}`}>
              <span>{`u/${formatHandle(post?.profile?.handle)}`}</span>
            </Link>
          </span>
          <span>in</span>
          <span
            className="hover:underline font-bold"
            onClick={(e) => e.stopPropagation()}
          >
            {post?.isLensCommunityPost ? (
              <Link href={`/l/${formatHandle(post?.communityInfo?.handle)}`}>
                <span>{`l/${formatHandle(post?.communityInfo?.handle)}`}</span>
              </Link>
            ) : (
              <Link href={`/c/${post?.communityInfo?.name}`}>
                <span>{`c/${post?.communityInfo?.name}`}</span>
              </Link>
            )}
          </span>
        </div>
      )}
      createdAt={notification?.createdAt}
      Body={() => <div>{post?.metadata?.name}</div>}
      Icon={() => <BsStars />}
      isRead={notification?.isRead}
      cardLink={`/p/${post?.id}`}
    />
  )
}

export default NotificationJoinedCommunityPost
