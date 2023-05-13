import React from 'react'
import PopUpWrapper from '../../Common/PopUpWrapper'
import { useProfile } from '../../Common/WalletContext'
import { Switch } from '@mui/material'
import {
  toggleAppendHastagPreference,
  toggleAppendLinkPreference
} from '../../../apiHelper/user'

const PostPerferenceSettings = () => {
  const { user, refreshUserInfo } = useProfile()

  const toggleAppendHashtags = async () => {
    await toggleAppendHastagPreference()
    await refreshUserInfo()
  }
  const toggleAppendLink = async () => {
    await toggleAppendLinkPreference()
    await refreshUserInfo()
  }
  return (
    <PopUpWrapper title="Post Perferences">
      <div className="mx-4 text-s-text  text-sm">
        Only applicable to normal (c/..) Communities.
      </div>
      <div className="start-row mx-4 py-2 gap-x-2">
        <Switch
          checked={user?.preferences?.appendLink ?? true}
          onChange={async () => {
            await toggleAppendLink()
          }}
          size="small"
          sx={{
            '& .MuiSwitch-track': {
              backgroundColor: 'grey',
              color: 'grey'
            }
          }}
        />
        <div>Add community link at the end</div>
      </div>
      <div className="start-row mx-4 py-2 gap-x-2">
        <Switch
          checked={user?.preferences?.appendHashtags ?? true}
          onChange={async () => {
            await toggleAppendHashtags()
          }}
          size="small"
          sx={{
            '& .MuiSwitch-track': {
              backgroundColor: 'grey',
              color: 'grey'
            }
          }}
        />
        <div>Add community hashtag at the end</div>
      </div>
    </PopUpWrapper>
  )
}

export default PostPerferenceSettings
