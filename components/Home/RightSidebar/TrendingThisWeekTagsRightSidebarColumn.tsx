import React from 'react'
import {
  HastagGroupType,
  getTrendingWeekHasTags
} from '../../../apiHelper/hastags'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

const TrendingThisWeekTagsRightSidebarColumn = () => {
  const [showMore, setShowMore] = React.useState(false)
  const { data } = useQuery<HastagGroupType>(['trendingWeekTags'], async () => {
    const data = await getTrendingWeekHasTags()
    return data
  })

  const hashtags = showMore ? data?.hashtags : data?.hashtags.slice(0, 5)

  if (!data) return null
  return (
    <div className="text-p-text bg-s-bg rounded-xl mb-4 py-2">
      <div className="text-2xl px-4">Trending This Week </div>

      {hashtags.map((hashtag, index) => (
        <Link
          href={`/search?q=${hashtag.hashtag}&type=publication`}
          key={index}
          className="block text-xl text-p-text w-full px-4 py-2 hover:bg-s-hover"
        >
          <div>#{hashtag.hashtag}</div>
          <div className="text-xs text-s-text">{hashtag.total_count} posts</div>
        </Link>
      ))}

      {data && (
        <div
          className="px-4 py-1 w-full hover:bg-s-hover cursor-pointer"
          onClick={() => {
            setShowMore(!showMore)
          }}
        >
          {showMore ? 'Show Less' : 'Show More'}
        </div>
      )}
    </div>
  )
}

export default TrendingThisWeekTagsRightSidebarColumn