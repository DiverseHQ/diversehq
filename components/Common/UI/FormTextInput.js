import React, { memo } from 'react'

const FormTextInput = ({
  label,
  className = '',
  value,
  maxLength = null,
  disabled = false,
  // onBlur,
  errorMsg = null,
  ...props
}) => {
  return (
    <label className={`${disabled ? 'cursor-not-allowed' : ''}`}>
      <div
        className={`relative border rounded-xl mx-4 py-2 px-4 my-4 text-p-text bg-s-bg ${
          disabled ? 'cursor-not-allowed' : ''
        } ${
          errorMsg ? 'border-red-500' : 'border-s-border'
        } `}
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
            // onBlur={onBlur}
            {...props}
          />
          {maxLength && (
            <div className="pl-1">
              {value ? value?.length : 0}/{maxLength}
            </div>
          )}
          {
            errorMsg && (
              <div className="text-red-500 text-xs absolute top-[8px] right-[8px]">
                {errorMsg}
              </div>
            )
          }
        </div>
      </div>
    </label>
  )
}

export default memo(FormTextInput)
