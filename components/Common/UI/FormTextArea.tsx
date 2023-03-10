import React, { memo } from 'react'

interface Props {
  label: string
  className?: string
  placeholder?: string
  value: string
  onChange?: any
  maxLength?: number
}

const FormTextArea = ({
  label,
  placeholder,
  value,
  onChange,
  className,
  maxLength = null,
  ...props
}: Props) => {
  const inputRef = React.useRef(null)
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px'
    }
  }, [value])
  return (
    <label>
      <div className="border rounded-xl border-s-border mx-4 w-ful py-2 px-4">
        <div className="pb-2">{label}</div>
        <div className="flex flex-row items-center justify-between">
          <textarea
            {...props}
            className={`w-full resize-none text-p-text bg-s-bg outline-none ${className}`}
            placeholder={placeholder}
            value={value}
            maxLength={maxLength}
            onChange={onChange}
            ref={inputRef}
          />
          {maxLength && (
            <div className="pl-1">
              {value ? value?.length : 0}/{maxLength}
            </div>
          )}
        </div>
      </div>
    </label>
  )
}

export default memo(FormTextArea)
