import React, { memo } from 'react'

interface Props {
  label?: string
  className?: string
  value: string
  maxLength?: number
  disabled?: boolean
  placeholder?: string
  onChange?: any
  errorMsg?: string
  startingLetters?: string
}

const FormTextInput = ({
  label,
  className = '',
  value,
  maxLength = null,
  disabled = false,
  placeholder,
  startingLetters = '',
  onChange,
  // onBlur,
  errorMsg = null,
  ...props
}: Props) => {
  return (
    <label className={`${disabled ? 'cursor-not-allowed' : ''}`}>
      <div
        className={`border rounded-xl border-s-border mx-4 py-2 px-4 my-4 text-p-text bg-s-bg ${
          disabled ? 'cursor-not-allowed' : ''
        } ${errorMsg ? 'border-red-500' : 'border-s-border'} `}
      >
        {label && <div className="pb-2">{label}</div>}
        <div className="flex flex-row items-center justify-between">
          {startingLetters && (
            <div className="text-s-text">{startingLetters}</div>
          )}
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
            // onBlur={onBlur}
            {...props}
          />
          {maxLength && (
            <div className="pl-1">
              {value ? value?.length : 0}/{maxLength}
            </div>
          )}
          {errorMsg && (
            <div className="text-red-500 text-xs absolute top-[8px] right-[8px]">
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </label>
  )
}

export default memo(FormTextInput)
