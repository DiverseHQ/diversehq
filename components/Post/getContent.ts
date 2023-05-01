import { postWithCommunityInfoType } from '../../types/post'
import { showNameForThisAppIds } from '../../utils/config'

export const getContent = (post: postWithCommunityInfoType): string => {
  let content = post?.metadata?.content || ''

  if (content) {
    if (post?.isLensCommunityPost) {
      content = content.split('\n').slice(2).join('\n')
    }
    if (content.startsWith('Posted on')) {
      content = content.split('\n').slice(1).join('\n')
    }
    const regex = /Posted on c\/\w+/

    if (regex.test(content)) {
      content = content.replace(regex, '')
    }
    // if the content ends with #<communityName>, remove it
    // communityName = post?.communityInfo?.name

    if (content?.endsWith(`#${post?.communityInfo?.name}`)) {
      content = content.slice(0, -(post?.communityInfo?.name.length + 1))
    }
    if (
      content?.startsWith(post?.metadata?.name) &&
      showNameForThisAppIds.includes(post?.appId)
    ) {
      content = content.slice(post?.metadata?.name.length)
    }
  }

  return content
}
