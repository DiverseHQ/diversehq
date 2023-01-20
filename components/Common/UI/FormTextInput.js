import React, { memo } from 'react'

const FormTextInput = ({ label, className, value, maxLength, ...props }) => {
  return (
    <label>
      <div className="border rounded-xl border-p-border mx-4 py-2 px-4 my-4">
        <div className="pb-2">{label}</div>
        <div className="flex flex-row items-center justify-between">
          <input
            type="text"
            value={value}
            maxLength={maxLength}
            className={`w-full text-p-text bg-p-bg outline-none ${className}`}
            {...props}
          />
          {maxLength && (
            <div>
              {value ? value?.length : 0}/{maxLength}
            </div>
          )}
        </div>
      </div>
    </label>
  )
}

export default memo(FormTextInput)
