import apiEndpoint from './ApiEndpoint'

export type HastagGroupType = {
  _id: string
  groupName: string
  createdAt: string
  updatedAt: string
  hashtags: {
    _id: string
    hashtag: string
    total_count: number
  }[]
}

export const getTrendingTodayHasTags = async (): Promise<HastagGroupType> => {
  return await fetch(`${apiEndpoint}/hastagGroups/trendingToday`).then((res) =>
    res.json()
  )
}

export const getTrendingWeekHasTags = async (): Promise<HastagGroupType> => {
  return await fetch(`${apiEndpoint}/hastagGroups/trendingWeek`).then((res) =>
    res.json()
  )
}
