import Link from 'next/link'
import React from 'react'
import Markup from '../Lexical/Markup'
import { stringToLength } from '../../utils/utils'
import CommonNotificationCardLayoutUI from './CommonNotificationCardLayoutUI'
import { GoMention } from 'react-icons/go'
import formatHandle from '../User/lib/formatHandle'
import { NewMentionNotification } from '../../graphql/generated'

interface Props {
  notification: NewMentionNotification
  isRead: boolean
}

const LensNotificationMentionCard = ({ notification, isRead }: Props) => {
  return (
    <CommonNotificationCardLayoutUI
      MainRow={() => (
        <div>
          <span onClick={(e) => e.stopPropagation()}>
            <Link
              href={`/u/${formatHandle(
                notification?.mentionPublication?.profile?.handle
              )}`}
            >
              <div className="font-bold hover:underline">
                {`u/${formatHandle(
                  notification?.mentionPublication?.profile?.handle
                )}`}
              </div>
            </Link>{' '}
          </span>
          <span>mentioned you in a </span>
          <span className="hover:underline font-bold">
            <Link href={`/p/${notification?.mentionPublication?.id}`}>
              <>
                {notification?.notificationId?.startsWith('mention-post-') &&
                  'Post'}
                {notification?.notificationId?.startsWith('mention-comment-') &&
                  'Comment'}
              </>
            </Link>
          </span>
        </div>
      )}
      createdAt={notification?.createdAt}
      Body={() => (
        <div className={`overflow-hidden break-words`}>
          <Markup
            className={`linkify whitespace-pre-wrap break-words text-sm sm:text-base`}
          >
            {stringToLength(
              notification?.mentionPublication?.metadata?.content,
              70
            )}
          </Markup>
        </div>
      )}
      Icon={() => <GoMention />}
      isRead={isRead}
      cardLink={
        notification?.notificationId?.startsWith('mention-comment-')
          ? // @ts-ignore
            `/p/${notification?.mentionPublication?.mainPost?.id}`
          : `/p/${notification?.mentionPublication?.id}`
      }
    />
  )
}

export default LensNotificationMentionCard
