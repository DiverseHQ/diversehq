import React from 'react'
import {
  AiOutlineInstagram,
  AiOutlineLink,
  AiOutlineTwitter
} from 'react-icons/ai'
import { Profile } from '../../graphql/generated'
import { shortFormOfLink } from '../../lib/helpers'
import { getWebsiteLinksFromProfile } from './lib/getWebsiteLinksFromProfile'

const ProfileLink = ({ link, icon }: { link: string; icon: any }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="text-s-text text-sm leading-5 flex flex-row items-center space-x-1 cursor-pointer rounded-full hover:bg-s-hover active:bg-s-hover pl-1 pr-2 truncate"
  >
    <div>{icon}</div>
    <div>{shortFormOfLink(link)}</div>
  </a>
)

const ProfileLinksRow = ({ profile }: { profile: Profile }) => {
  const { websiteLink, twitterLink, instagramLink } =
    getWebsiteLinksFromProfile(profile)
  return (
    <div className="flex flex-row gap-x-4 gap-y-2 flex-wrap break-words w-full">
      {websiteLink && (
        <ProfileLink link={websiteLink} icon={<AiOutlineLink />} />
      )}
      {twitterLink && (
        <ProfileLink link={twitterLink} icon={<AiOutlineTwitter />} />
      )}
      {instagramLink && (
        <ProfileLink link={instagramLink} icon={<AiOutlineInstagram />} />
      )}
    </div>
  )
}

export default ProfileLinksRow
