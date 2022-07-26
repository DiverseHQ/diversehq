import React from 'react'
import AddToken from './AddToken'
import ChangeMonkey from './ChangeMonkey'
import CreateCommunity from './CreateCommunity'

const ClickOption = () => {
  return (
    <div>
        <ChangeMonkey />
      <CreateCommunity />
      <AddToken />
    </div>
  )
}

export default ClickOption