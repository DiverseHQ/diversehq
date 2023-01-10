import React, { memo } from 'react'

const FormTextInput = ({
  label,
  placeholder,
  value,
  onChange,
  className,
  props
}) => {
  return (
    <label>
      <div className="border rounded-xl border-p-border mx-4 py-2 px-4 my-4">
        <div className="pb-2">{label}</div>
        <input
          type="text"
          {...props}
          className={`w-full text-p-text bg-p-bg outline-none ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </label>
  )
}

export default memo(FormTextInput)
