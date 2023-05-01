import React from 'react'
import { useProfile } from '../../Common/WalletContext'
import {
  toggleAppendHastagPreference,
  toggleAppendLinkPreference
} from '../../../api/user'
import { Switch } from '@mui/material'

const PostPreferenceDrawerModal = () => {
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
    <div>
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
        <div>Auto add community link at the end</div>
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
        <div>Auto add community hashtag at the end</div>
      </div>
    </div>
  )
}

export default PostPreferenceDrawerModal
