import { notificationTypes } from '../../utils/config'
// import NotificationCommentedPostCard from './NotificationCommentedPostCard'
// import NotificationCommentUpvote from './NotificationCommentUpvote'
// import NotificationPostCreated from './NotificationPostCreated'
// import NotificationPostUpvote from './NotificationPostUpvote'
import { NotificationSchema } from '../../types/notification'
import NotificationBannedUserCard from './NotificationBannedUserCard'
import NotificationBannedUserLensCommunityCard from './NotificationBannedUserLensCommunityCard'
import NotificationJoinedCommunityPost from './NotificationJoinedCommunityPost'
import NotificationModeratorAssignedCard from './NotificationModeratorAssignedCard'
import NotificationModeratorRemoveCard from './NotificationModeratorRemoveCard'
import NotificationReviewPostCard from './NotificationReviewPostCard'
import NotificationReviewPostResolve from './NotificationReviewPostResolve'
import NotificationUnbannedUserCard from './NotificationUnbannedUserCard'
import NotificationUnbannedUserLensCommunityCard from './NotificationUnbannedUserLensCommunityCard'

const NotificationCard = ({
  notification
}: {
  notification: NotificationSchema
}) => {
  if (notification.type === notificationTypes.COMMENT) return <></>
  if (notification.type === notificationTypes.POST) return <></>
  if (notification.type === notificationTypes.UPVOTE_COMMENT) return <></>
  if (notification.type === notificationTypes.UPVOTE_POST) return <></>

  return (
    <div className="px-3 py-2 sm:px-2 sm:py-4 border-b border-s-border w-full hover:bg-s-hover cursor-pointer">
      {/* {notification.type === notificationTypes.COMMENT && (
        <NotificationCommentedPostCard notification={notification} />
      )}
      {notification.type === notificationTypes.POST && (
        <NotificationPostCreated notification={notification} />
      )}
      {notification.type === notificationTypes.UPVOTE_COMMENT && (
        <NotificationCommentUpvote notification={notification} />
      )}
      {notification.type === notificationTypes.UPVOTE_POST && (
        <NotificationPostUpvote notification={notification} />
      )} */}
      {notification.type === notificationTypes.MODERATOR_ASSIGNED && (
        <NotificationModeratorAssignedCard notification={notification} />
      )}
      {notification.type === notificationTypes.MODERATOR_REMOVED && (
        <NotificationModeratorRemoveCard notification={notification} />
      )}
      {notification.type === notificationTypes.BAN_USER &&
        notification?.community && (
          <NotificationBannedUserCard notification={notification} />
        )}
      {notification.type === notificationTypes.UNBAN_USER &&
        notification?.community && (
          <NotificationUnbannedUserCard notification={notification} />
        )}

      {notification.type === notificationTypes.BAN_USER &&
        notification?.lensCommunity && (
          <NotificationBannedUserLensCommunityCard
            notification={notification}
          />
        )}

      {notification.type === notificationTypes.UNBAN_USER &&
        notification?.lensCommunity && (
          <NotificationUnbannedUserLensCommunityCard
            notification={notification}
          />
        )}

      {notification.type ===
        notificationTypes.REVIEW_POST_FOR_LENS_COMMUNITY && (
        <NotificationReviewPostCard notification={notification} />
      )}

      {notification.type ===
        notificationTypes.RESOLVED_POST_FOR_LENS_COMMUNITY && (
        <NotificationReviewPostResolve notification={notification} />
      )}

      {notification.type === notificationTypes.NEW_JOINED_COMMUNITY_POST && (
        <NotificationJoinedCommunityPost notification={notification} />
      )}
    </div>
  )
}

export default NotificationCard
