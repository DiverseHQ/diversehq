import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from '@mui/material'
import Link from 'next/link'
import React from 'react'
import { MdExpandMore } from 'react-icons/md'
import { getLevelAndThresholdXP } from '../../lib/helpers'
import { LensCommunity } from '../../types/community'
import { xpPerMember } from '../../utils/config'
import { useTheme } from '../Common/ThemeProvider'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import Markup from '../Lexical/Markup'
import MessageButton from '../Messages/MessageButton'
import formatHandle from '../User/lib/formatHandle'
import getAvatar from '../User/lib/getAvatar'
import CreatePostBar from '../Home/CreatePostBar'
import { useCommunityStore } from '../../store/community'

const LensCommunityPageRightSidebar = ({
  community
}: {
  community: LensCommunity
}) => {
  const { theme } = useTheme()
  const { currentXP, level, thresholdXP } = getLevelAndThresholdXP(
    community?.Profile?.stats?.totalFollowers * xpPerMember || 0
  )
  const selectCommunityForPost = useCommunityStore(
    (state) => state.selectCommunityForPost
  )

  const calculateBarPercentage = (currentXP: number, threshold: number) => {
    const percentage = Math.round((threshold * 100) / currentXP)
    return percentage
  }
  return (
    <div className="relative pt-14 hidden lg:flex flex-col w-[150px] md:w-[200px] lg:w-[300px] xl:w-[350px] py-8 pr-4 pl-2 md:pl-2 lg:pl-4 xl:pl-6 overflow-scroll no-scrollbar space-y-3">
      {community?.Profile?.isFollowedByMe && (
        <CreatePostBar
          title="Create Post"
          beforeOpen={() => {
            selectCommunityForPost({
              _id: community._id,
              name: formatHandle(community?.handle),
              logoImageUrl: getAvatar(community?.Profile),
              isLensCommunity: true
            })
          }}
        />
      )}

      {/* About Community Card */}
      <div className="flex flex-col bg-s-bg w-full rounded-[15px] border-[1px] border-s-border text-[#fff]">
        <div className="bg-[#9378d8] rounded-t-[15px] font-medium px-3 py-2">
          About Community
        </div>
        <div className="text-p-text px-3 py-2 flex flex-col">
          <div className="mb-3">
            <Markup>{community.Profile?.bio}</Markup>
          </div>
          <div className="flex gap-2 items-center mb-2">
            <img src="/communityCreatedOnDate.svg" alt="cake" />
            <span className="text-[#7c7c7c]">
              Created{' '}
              {new Date(community.createdAt)
                .toDateString()
                .split(' ')
                .slice(1)
                .join(' ')}
            </span>
          </div>
          <div className="bg-[#7c7c7c] h-[1px] mb-3"></div>
          {/* <div className="flex flex-wrap mb-2 gap-x-6 gap-y-2">
            <div className="flex flex-col">
              <span className="font-semibold text-[16px]">
                {community?.Profile?.stats?.totalFollowers}
              </span>
              <span className="font-light text-[#7c7c7c]">members</span>
            </div>
          </div> */}
          <div className="flex flex-row gap-1 w-full">
            <div className="flex flex-col w-full">
              <div className="relative bg-[#7c7c7c] h-[35px] rounded-[10px] flex flex-row">
                <div className="flex z-10 self-center justify-self-center w-full justify-center text-white dark:text-p-text text-[14px]">
                  Level {level}
                </div>
                <div
                  className="absolute h-full bg-[#9378D8] rounded-[10px] "
                  style={{
                    width: `${calculateBarPercentage(thresholdXP, currentXP)}%`,
                    maxWidth: '100%'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Rules */}
      {community?.rules?.length > 0 && (
        <div className="flex flex-col bg-s-bg w-full rounded-[15px] border-[1px] border-s-border text-[#fff]">
          <div className="bg-[#9378d8] rounded-t-[15px] font-medium px-3 py-2">
            Community Rules
          </div>
          <div className="text-p-text flex flex-col text-[14px] rounded-b-[15px] overflow-hidden">
            {community?.rules?.map((rule, index) => {
              return (
                <Accordion
                  key={index}
                  disableGutters={true}
                  sx={{
                    '& .MuiAccordionDetails-root': {
                      backgroundColor: theme === 'dark' ? '#1a1a1b' : '#fff',
                      color: theme === 'dark' ? '#d7dadc' : '#000'
                    },
                    '& .MuiAccordionSummary-root': {
                      backgroundColor: theme === 'dark' ? '#1a1a1b' : '#fff',
                      color: theme === 'dark' ? '#d7dadc' : '#000'
                    },
                    '& .MuiAccordionSummary-expandIconWrapper': {
                      color: theme === 'dark' ? '#d7dadc' : '#000'
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<MdExpandMore />}
                    aria-controls={`panel${index + 1}a-content`}
                    id={`panel${index + 1}a-header`}
                  >
                    <Typography>
                      <span className="font-semibold">{index + 1}. </span>
                      {rule.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{rule.description}</Typography>
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </div>
        </div>
      )}

      {/* Owner Contact Card */}
      <div className="flex flex-col bg-s-bg w-full rounded-[15px] border-[1px] border-s-border text-[#fff]">
        <div className="bg-[#9378d8] rounded-t-[15px] font-medium px-3 py-2">
          Contact Owner
        </div>
        <div className="text-p-text  flex flex-col text-[14px]">
          <div className="flex flex-row w-full items-center justify-between py-2 px-3">
            <div className="flex flex-row items-center justify-between gap-2 w-full">
              <div className="flex gap-2">
                <ImageWithPulsingLoader
                  className="w-8 h-8 rounded-full bg-p-bg"
                  // @ts-ignore
                  src={getAvatar(community?.Profile)}
                />
                <div className="flex flex-col flex-1">
                  {community?.Profile?.name && (
                    <div className="text-sm font-medium">
                      {community?.Profile.name}
                    </div>
                  )}
                  <Link href={`/u/${formatHandle(community?.Profile.handle)}`}>
                    <div className="text-sm text-s-text font-medium hover:underline cursor-pointer">
                      u/{formatHandle(community?.Profile.handle)}
                    </div>
                  </Link>
                </div>
              </div>
              {/* @ts-ignore */}
              <MessageButton userLensProfile={community?.Profile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LensCommunityPageRightSidebar
