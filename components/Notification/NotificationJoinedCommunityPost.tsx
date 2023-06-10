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
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div className="flex flex-row items-center flex-wrap space-x-1">
          <span>New Post from</span>
          <span
            className="hover:underline font-bold"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={`/u/${formatHandle(
                notification?.senderLensProfile?.handle
              )}`}
            >
              <span>{`u/${formatHandle(
                notification?.senderLensProfile?.handle
              )}`}</span>
            </Link>
          </span>
          <span>in</span>

          {post?.communityInfo ? (
            <span
              className="hover:underline font-bold"
              onClick={(e) => e.stopPropagation()}
            >
              {post?.isLensCommunityPost ? (
                <Link href={`/l/${formatHandle(post?.communityInfo?.handle)}`}>
                  <span>{`l/${formatHandle(
                    post?.communityInfo?.handle
                  )}`}</span>
                </Link>
              ) : (
                <Link href={`/c/${post?.communityInfo?.name}`}>
                  <span>{`c/${post?.communityInfo?.name}`}</span>
                </Link>
              )}
            </span>
          ) : (
            <span className="h-3 w-10 bg-s-text rounded-xl animate-pulse" />
          )}
        </div>
      )}
      createdAt={notification?.createdAt}
      Body={() => (
        <>
          {post?.metadata?.name ? (
            <div>{post?.metadata?.name}</div>
          ) : (
            <div className="h-3 w-30 bg-s-text rounded-xl animate-pulse" />
          )}
        </>
      )}
      Icon={() => <BsStars />}
      isRead={notification?.isRead}
      cardLink={post?.id ? `/p/${post?.id}` : null}
    />
  )
}

export default NotificationJoinedCommunityPost
