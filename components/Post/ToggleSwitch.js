import React from 'react'

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <label className="relative inline-flex items-center p-4 border border-gray-300 rounded-md cursor-pointer text-center select-none font-medium leading-5 bg-white hover:border-gray-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-800 active:text-white transition duration-150 ease-in-out">
      <input
        type="checkbox"
        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
        checked={checked}
        onChange={onChange}
      />
      <span className="ml-2">Toggle</span>
    </label>
  )
}

export default ToggleSwitch
