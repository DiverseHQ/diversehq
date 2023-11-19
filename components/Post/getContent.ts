import { postWithCommunityInfoType } from '../../types/post'
import { appLink, showNameForThisAppIds } from '../../utils/config'

export const getContent = (post: postWithCommunityInfoType): string => {
  let content: string = post?.metadata?.content || ''

  if (content) {
    if (post?.isLensCommunityPost) {
      content = content.split('\n').slice(1).join('\n')
      if (content.startsWith(post?.metadata?.marketplace?.name)) {
        content = content.slice(post?.metadata?.marketplace.name.length)
      }
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

    content = content.trim()

    // removing community link if it is the last line
    if (content?.endsWith(`${appLink}/c/${post?.communityInfo?.name}`)) {
      content = content.slice(
        0,
        -(`${appLink}/c/${post?.communityInfo?.name}`.length + 1)
      )
    }

    // removing upper content if same as content name
    if (
      content?.startsWith(post?.metadata?.marketplace?.name?.trim()) &&
      showNameForThisAppIds.includes(post?.metadata.appId)
    ) {
      content = content.slice(post?.metadata?.marketplace?.name.length)
    }

    if (
      content?.startsWith(`**${post?.metadata?.marketplace?.name}**`) &&
      showNameForThisAppIds.includes(post?.metadata.appId)
    ) {
      content = content.slice(post?.metadata?.marketplace?.name.length + 4)
    }

    // removing ___ Quoting texts
    if (content?.includes('___\nQuoting')) {
      content = content.split('___\nQuoting')[0]
    }
  }

  return content
}
