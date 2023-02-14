import React from 'react'
import type { FC } from 'react'
import { CircularProgress } from '@mui/material'
import { RiSendPlane2Line } from 'react-icons/ri'
import { IoMdSend } from 'react-icons/io'

interface Props {
  sendMessage: (message: string) => Promise<boolean>
  conversationKey: string
  disabledInput: boolean
}

const Composer: FC<Props> = ({
  sendMessage,
  conversationKey,
  disabledInput
}) => {
  const [message, setMessage] = React.useState<string>('')
  const [sending, setSending] = React.useState<boolean>(false)
  const inputRef = React.useRef(null)
  const canSendMessage = !disabledInput && !sending && message.length > 0

  const handleSend = async () => {
    if (!canSendMessage) {
      return
    }
    setSending(true)
    const sent = await sendMessage(message)
    if (sent) {
      setMessage('')
    } else {
      alert('Failed to send message')
    }
    setSending(false)
  }

  React.useEffect(() => {
    setMessage('')
  }, [conversationKey])

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      handleSend()
    }
  }

  React.useEffect(() => {
    // @ts-ignore
    inputRef.current.style.height = 'auto'
    // @ts-ignore
    inputRef.current.style.height = inputRef.current.scrollHeight + 'px'
  }, [message])
  return (
    <div className="w-full px-2 py-2 bg-s-bg absolute bottom-0">
      <div className="flex flex-row bg-[#EDE7FF] justify-between px-4 dark:bg-s-bg h-fit w-full rounded-xl">
        <textarea
          ref={inputRef}
          placeholder="Type a message..."
          value={message}
          disabled={disabledInput || sending}
          onKeyDown={handleKeyDown}
          onChange={(event) => setMessage(event.target.value)}
          className="p-2 bg-[#EDE7FF] dark:bg-s-bg rounded-l-xl w-full focus:outline-none"
          style={{ resize: 'none' }}
          rows={1}
        />
        <button disabled={!canSendMessage} onClick={handleSend} className="">
          {sending ? (
            <CircularProgress size="18px" color="primary" />
          ) : (
            <IoMdSend className="text-p-btn w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  )
}

export default Composer
