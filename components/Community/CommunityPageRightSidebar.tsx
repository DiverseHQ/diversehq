import React from 'react'
import { useProfilesQuery } from '../../graphql/generated'
import { getLevelAndThresholdXP } from '../../lib/helpers'
import { CommunityType } from '../../types/community'
import { xpPerMember } from '../../utils/config'
import ImageWithPulsingLoader from '../Common/UI/ImageWithPulsingLoader'
import MessageButton from '../Messages/MessageButton'
import formatHandle from '../User/lib/formatHandle'
import getAvatar from '../User/lib/getAvatar'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import { MdExpandMore } from 'react-icons/md'
import { useTheme } from '../Common/ThemeProvider'

interface Props {
  communityInfo: CommunityType
}

const CommunityPageRightSidebar = ({ communityInfo }: Props) => {
  const { currentXP, level, thresholdXP } = getLevelAndThresholdXP(
    communityInfo?.members?.length * xpPerMember || 0
  )

  const calculateBarPercentage = (currentXP, threshold) => {
    const percentage = Math.round((threshold * 100) / currentXP)
    return percentage
  }

  const { data, isLoading } = useProfilesQuery(
    {
      request: {
        ownedBy: communityInfo?.moderators,
        limit: 50
      }
    },
    {
      enabled: !!communityInfo?.moderators
    }
  )
  const { theme } = useTheme()

  return (
    <div
      className={`relative hidden lg:flex flex-col w-[150px] md:w-[200px] lg:w-[300px] xl:w-[350px] py-8 pr-4 pl-2 md:pl-2 lg:pl-4 xl:pl-6 overflow-scroll no-scrollbar space-y-3`}
    >
      {/* About Community Card */}
      <div className="flex flex-col bg-s-bg w-full rounded-[15px] border-[1px] border-s-border text-[#fff]">
        <div className="bg-[#9378d8] rounded-t-[15px] font-medium px-3 py-2">
          About Community
        </div>
        <div className="text-p-text px-3 py-2 flex flex-col">
          <div className="mb-3">
            <span>{communityInfo.description}</span>
          </div>
          <div className="flex gap-2 items-center mb-2">
            <img src="/communityCreatedOnDate.svg" alt="cake" />
            <span className="text-[#7c7c7c]">
              Created{' '}
              {new Date(communityInfo.createdAt)
                .toDateString()
                .split(' ')
                .slice(1)
                .join(' ')}
            </span>
          </div>
          <div className="bg-[#7c7c7c] h-[1px] mb-3"></div>
          <div className="flex flex-wrap mb-2 gap-x-6 gap-y-2">
            <div className="flex flex-col">
              <span className="font-semibold text-[16px]">
                {communityInfo.members?.length}
              </span>
              <span className="font-light text-[#7c7c7c]">members</span>
            </div>
          </div>
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
      {communityInfo?.rules?.length > 0 && (
        <div className="flex flex-col bg-s-bg w-full rounded-[15px] border-[1px] border-s-border text-[#fff]">
          <div className="bg-[#9378d8] rounded-t-[15px] font-medium px-3 py-2">
            Community Rules
          </div>
          <div className="text-p-text flex flex-col text-[14px] rounded-b-[15px] overflow-hidden">
            {communityInfo?.rules?.map((rule, index) => {
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

      {/* Moderators Card */}
      {data?.profiles && data?.profiles?.items && (
        <div className="flex flex-col bg-s-bg w-full rounded-[15px] border-[1px] border-s-border text-[#fff]">
          <div className="bg-[#9378d8] rounded-t-[15px] font-medium px-3 py-2">
            Moderators
          </div>
          <div className="text-p-text  flex flex-col text-[14px]">
            {isLoading && (
              <div className="flex flex-row items-center justify-center space-x-2">
                <div className="w-4 h-4 border-t-2 border-p-btn rounded-full animate-spin" />
                <div className="text-sm text-s-text">Loading...</div>
              </div>
            )}
            {data?.profiles &&
              data?.profiles?.items
                ?.filter((profile) => profile?.isDefault)
                .map((profile) => (
                  <div
                    className="flex flex-row w-full items-center justify-between py-2 px-3 hover:bg-s-hover"
                    key={profile?.id}
                  >
                    <div className="flex flex-row items-center justify-between gap-2 w-full">
                      <div className="flex gap-2">
                        <ImageWithPulsingLoader
                          className="w-8 h-8 rounded-full bg-p-bg"
                          // @ts-ignore
                          src={getAvatar(profile)}
                        />
                        <div className="flex flex-col flex-1">
                          {profile?.name && (
                            <div className="text-sm font-medium">
                              {profile.name}
                            </div>
                          )}
                          <div className="text-sm text-s-text font-medium">
                            u/{formatHandle(profile.handle)}
                          </div>
                        </div>
                      </div>
                      {/* @ts-ignore */}
                      <MessageButton userLensProfile={profile} />
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CommunityPageRightSidebar
