import { CircularProgress, Tooltip } from '@mui/material'
import React from 'react'
import { HiOutlineDocumentAdd } from 'react-icons/hi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { setRulesOfLensCommunity } from '../../../../api/community'
import { LensCommunity, Rule } from '../../../../types/community'
import { useNotify } from '../../../Common/NotifyContext'
import FormTextArea from '../../../Common/UI/FormTextArea'
import FormTextInput from '../../../Common/UI/FormTextInput'
import { useProfile } from '../../../Common/WalletContext'

const RulesSection = ({ community }: { community: LensCommunity }) => {
  const [rules, setRules] = React.useState<Rule[]>(community.rules ?? [])
  const [title, setTitle] = React.useState<string>('')
  const [description, setDescription] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(false)
  const isDisabled = loading || title.trim() === '' || description.trim() === ''
  const { notifyInfo } = useNotify()
  const { LensCommunity } = useProfile()

  const removeRule = async (index: number) => {
    const newRules = [...rules]
    newRules.splice(index, 1)
    setRules(newRules)
    try {
      const res = await setRulesOfLensCommunity(LensCommunity._id, newRules)
      if (res.status === 200) {
        setRules(newRules)
      } else {
        const resData = await res.json()
        notifyInfo(resData.msg)
        console.log(resData.msg)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addNewRule = async () => {
    setLoading(true)
    try {
      const newRule: Rule = {
        title,
        description
      }
      const newRules = [...rules, newRule]
      const res = await setRulesOfLensCommunity(LensCommunity._id, newRules)

      if (res.status === 200) {
        setRules(newRules)
        setTitle('')
        setDescription('')
      } else {
        const resData = await res.json()
        notifyInfo(resData.msg)
        console.log(resData.msg)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="p-2 w-full sm:p-3 space-y-2">
      <div className="font-medium ">Set Rules</div>
      <div className="px-4">
        {rules.map((rule, index) => (
          <div key={index} className="border-b border-s-border py-3">
            <div className="flex flex-row justify-between">
              <div className="text-p-text text font-medium">
                {index + 1}. {rule.title}
              </div>
              <Tooltip title={`Remove`} arrow placement="top">
                <div
                  className="text-s-text cursor-pointer p-1.5 flex items-center justify-center hover:bg-s-hover rounded-full"
                  onClick={() => {
                    removeRule(index)
                  }}
                >
                  <RiDeleteBinLine className="w-4 h-4 text-red-400" />
                </div>
              </Tooltip>
            </div>
            <div className="text-md text-s-text px-4">{rule.description}</div>
          </div>
        ))}
      </div>
      {/* input for title */}
      <div className="px-5 font-medium text-sm">Add a Rule</div>
      <FormTextInput
        label="Title"
        value={title}
        maxLength={100}
        placeholder="Rule Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <FormTextArea
        label="Description"
        value={description}
        maxLength={1000}
        placeholder="Rule Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        onClick={addNewRule}
        disabled={isDisabled}
        className={`self-start font-bold tracking-wide px-2 mx-4 py-0.5 ${
          isDisabled ? 'bg-p-btn-disabled' : 'bg-p-btn'
        } text-p-btn-text rounded-lg flex flex-row items-center space-x-1.5`}
      >
        {loading && <CircularProgress className="h-4 w-4" size="16px" />}
        {!loading && <HiOutlineDocumentAdd className="h-4 w-4" />}
        <div>Add</div>
      </button>
    </div>
  )
}

export default RulesSection
