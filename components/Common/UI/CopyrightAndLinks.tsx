import React from 'react'

const CopyrightAndLinks = () => {
  return (
    <>
      <div className="flex flex-wrap gap-2 text-p-text text-sm">
        <span className="font-semibold">&copy; 2023 DiverseHQ</span>
        {/* <span className="cursor-pointer">Terms</span>
      <span className="cursor-pointer">Privacy</span> */}
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
        {/* <span className="cursor-pointer">Feedback</span>
      <span className="cursor-pointer">Thanks</span> */}
      </div>
      <div className="text-p-text text-xs pt-2">
        App is in beta and things might break. Report bugs or request features
        on Discord.
      </div>
    </>
  )
}

export default CopyrightAndLinks
