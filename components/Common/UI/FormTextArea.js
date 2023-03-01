import React, { memo } from 'react'

const FormTextArea = ({
  label,
  placeholder,
  value,
  onChange,
  className,
  props
}) => {
  return (
    <label>
      <div className="border rounded-xl border-s-border mx-4 w-ful py-2 px-4">
        <div className="pb-2">{label}</div>
        <textarea
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

export default memo(FormTextArea)
