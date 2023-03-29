import React from 'react'

const CopyrightAndLinks = () => {
  return (
    <div className="flex flex-wrap gap-2 text-p-text text-[14px]">
      <span className="font-semibold">&copy; 2023 DiverseHQ</span>
      <span className="cursor-pointer">Terms</span>
      <span className="cursor-pointer">Privacy</span>
      <a
        className="cursor-pointer"
        href="https://discord.gg/hrxYJcXPMm"
        target="_blank"
        rel="noreferrer"
      >
        Discord
      </a>
      <a
        className="cursor-pointer"
        href="https://twitter.com/useDiverseHQ"
        target="_blank"
        rel="noreferrer"
      >
        Twitter
      </a>
      <span className="cursor-pointer">Feedback</span>
      <span className="cursor-pointer">Thanks</span>
    </div>
  )
}

export default CopyrightAndLinks
