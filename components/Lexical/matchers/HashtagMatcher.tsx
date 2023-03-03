import { Matcher } from 'interweave'
// import Link from 'next/link'
import { createElement } from 'react'
import { isMainnet } from '../../../utils/config'

export const Hashtag = ({ ...props }: any) => {
  // todo make own hastag page
  return (
    <span className="inline-flex text-blue-400 items-center space-x-1">
      <a
        href={`${
          isMainnet ? 'https://lenster.xyz' : 'https://testnet.lenster.xyz'
        }/search?q=${props.display.slice(1)}&type=pubs&src=a_click`}
        target="_blank"
        rel="noreferrer"
      >
        {props.display}
      </a>
    </span>
  )
}

export class HashtagMatcher extends Matcher {
  replaceWith(match: string, props: any) {
    return createElement(Hashtag, props, match)
  }

  asTag(): string {
    return 'a'
  }

  match(value: string) {
    return this.doMatch(value, /\B(#\w*[A-Za-z]+\w*\b)(?!;)/, (matches) => {
      return {
        display: matches[0]
      }
    })
  }
}
