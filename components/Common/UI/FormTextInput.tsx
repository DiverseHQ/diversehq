import React, { memo } from 'react'

interface Props {
  label: string
  className?: string
  value: string
  maxLength?: number
  disabled?: boolean
  placeholder?: string
  onChange?: any
}

const FormTextInput = ({
  label,
  className = '',
  value,
  maxLength = null,
  disabled = false,
  placeholder,
  onChange,
  ...props
}: Props) => {
  return (
    <label className={`${disabled ? 'cursor-not-allowed' : ''}`}>
      <div
        className={`border rounded-xl border-s-border mx-4 py-2 px-4 my-4 text-p-text bg-s-bg ${
          disabled ? 'cursor-not-allowed' : ''
        }`}
      >
        <div className="pb-2">{label}</div>
        <div className="flex flex-row items-center justify-between">
          <input
            type="text"
            value={value}
            maxLength={maxLength}
            disabled={disabled}
            className={`w-full ${
              disabled ? 'text-s-text cursor-not-allowed' : 'text-p-text'
            } bg-s-bg outline-none ${className}`}
            placeholder={placeholder}
            onChange={onChange}
            {...props}
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

export default memo(FormTextInput)
