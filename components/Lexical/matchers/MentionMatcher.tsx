import { Matcher } from 'interweave'
import Link from 'next/link'
import { createElement } from 'react'
import formatHandle from '../../User/lib/formatHandle'

import { UrlMatcher } from './UrlMatcher'

export const Mention = ({ ...props }: any) => {
  const profile = {
    __typename: 'Profile',
    handle: props?.display.slice(1),
    name: null,
    id: null
  }

  return (
    <span
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <Link href={`/u/${formatHandle(props.display.slice(1))}`}>
        <span className="hover:underline text-p-btn cursor-pointer">
          {profile?.handle && `u/${formatHandle(props.display.slice(1))}`}
        </span>
      </Link>
    </span>
  )
}

export class MentionMatcher extends Matcher {
  replaceWith(match: string, props: any) {
    return createElement(Mention, props, match)
  }

  asTag(): string {
    return 'a'
  }

  match(value: string) {
    const urlMatcher = new UrlMatcher('url')
    const urlResponse = urlMatcher.match(value)
    if (urlResponse) {
      const { host } = urlResponse
      const tld = host.slice(host.lastIndexOf('.') + 1).toLowerCase()
      const ALLOWED_MENTIONS = ['lens', 'test']
      if (!ALLOWED_MENTIONS.includes(tld)) {
        return null
      }
    }

    return this.doMatch(value, /@[\w.-]+/, (matches) => {
      return { display: matches[0] }
    })
  }
}
