import { isCreatorOrModeratorOfCommunity } from '../../../apiHelper/community'

export const isCreatorOfCommunity = async (name: string): Promise<boolean> => {
  try {
    const res = await isCreatorOrModeratorOfCommunity(name)
    if (res.status === 200) {
      const resJson = await res.json()
      if (resJson.role === 'creator') {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  } catch (err) {
    console.log(err)
    return false
  }
}

export const isModeratorOfCommunity = async (
  name: string
): Promise<boolean> => {
  try {
    const res = await isCreatorOrModeratorOfCommunity(name)
    if (res.status === 200) {
      const resJson = await res.json()
      if (resJson.role === 'moderator') {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  } catch (err) {
    console.log(err)
    return false
  }
}
