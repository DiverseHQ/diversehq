import React from 'react'
import {
  PublicationReportingFraudSubreason,
  PublicationReportingIllegalSubreason,
  PublicationReportingSensitiveSubreason,
  PublicationReportingSpamSubreason
} from '../../../graphql/generated'

/* eslint-disable */

interface Props {
  setType: (type: string) => void
  setSubReason: (subReason: string) => void
  type: string
  subReason: string
}

const Reason = ({ setType, setSubReason, type, subReason }: Props) => {
  return (
    <div className="space-y-3 px-4">
      <div>
        <div className="label">Type</div>
        <div>
          <select
            className="w-full bg-s-bg rounded-xl border border-s-border outline-none py-1 px-2 my-2"
            onChange={(e) => setType(e.target.value)}
          >
            <option disabled selected>
              Select type
            </option>
            <option value="illegalReason" selected={type === 'illegalReason'}>
              Illegal
            </option>
            <option value="fraudReason" selected={type === 'fraudReason'}>
              Fraud
            </option>
            <option
              value="sensitiveReason"
              selected={type === 'sensitiveReason'}
            >
              Sensitive
            </option>
            <option value="spamReason" selected={type === 'spamReason'}>
              Spam
            </option>
          </select>
        </div>
      </div>
      {type && (
        <div>
          <div className="label">
            <div>Reason</div>
          </div>
          <div>
            <select
              className="w-full bg-s-bg rounded-xl border border-s-border outline-none py-1 px-2 my-2"
              onChange={(e) => setSubReason(e.target.value)}
            >
              <option disabled selected>
                Select sub reason
              </option>
              {type === 'illegalReason' && (
                <>
                  <option
                    value={PublicationReportingIllegalSubreason.AnimalAbuse}
                    selected={
                      subReason ===
                      PublicationReportingIllegalSubreason.AnimalAbuse
                    }
                  >
                    Animal Abuse
                  </option>
                  <option
                    value={PublicationReportingIllegalSubreason.DirectThreat}
                    selected={
                      subReason ===
                      PublicationReportingIllegalSubreason.DirectThreat
                    }
                  >
                    Direct Threat
                  </option>
                  <option
                    value={PublicationReportingIllegalSubreason.HumanAbuse}
                    selected={
                      subReason ===
                      PublicationReportingIllegalSubreason.HumanAbuse
                    }
                  >
                    Human Abuse
                  </option>
                  <option
                    value={
                      PublicationReportingIllegalSubreason.ThreatIndividual
                    }
                    selected={
                      subReason ===
                      PublicationReportingIllegalSubreason.ThreatIndividual
                    }
                  >
                    Threat Individual
                  </option>
                  <option
                    value={PublicationReportingIllegalSubreason.Violence}
                    selected={
                      subReason ===
                      PublicationReportingIllegalSubreason.Violence
                    }
                  >
                    Violence
                  </option>
                </>
              )}
              {type === 'fraudReason' && (
                <>
                  <option
                    value={PublicationReportingFraudSubreason.Scam}
                    selected={
                      subReason === PublicationReportingFraudSubreason.Scam
                    }
                  >
                    Scam
                  </option>
                  <option
                    value={PublicationReportingFraudSubreason.Impersonation}
                    selected={
                      subReason ===
                      PublicationReportingFraudSubreason.Impersonation
                    }
                  >
                    Impersonation
                  </option>
                </>
              )}
              {type === 'sensitiveReason' && (
                <>
                  <option
                    value={PublicationReportingSensitiveSubreason.Nsfw}
                    selected={
                      subReason === PublicationReportingSensitiveSubreason.Nsfw
                    }
                  >
                    NSFW
                  </option>
                  <option
                    value={PublicationReportingSensitiveSubreason.Offensive}
                    selected={
                      subReason ===
                      PublicationReportingSensitiveSubreason.Offensive
                    }
                  >
                    Offensive
                  </option>
                </>
              )}
              {type === 'spamReason' && (
                <>
                  <option
                    value={PublicationReportingSpamSubreason.FakeEngagement}
                    selected={
                      subReason ===
                      PublicationReportingSpamSubreason.FakeEngagement
                    }
                  >
                    Fake engagement
                  </option>
                  <option
                    value={PublicationReportingSpamSubreason.ManipulationAlgo}
                    selected={
                      subReason ===
                      PublicationReportingSpamSubreason.ManipulationAlgo
                    }
                  >
                    Algorithm manipulation
                  </option>
                  <option
                    value={PublicationReportingSpamSubreason.Misleading}
                    selected={
                      subReason === PublicationReportingSpamSubreason.Misleading
                    }
                  >
                    Misleading
                  </option>
                  <option
                    value={PublicationReportingSpamSubreason.MisuseHashtags}
                    selected={
                      subReason ===
                      PublicationReportingSpamSubreason.MisuseHashtags
                    }
                  >
                    Misuse hashtags
                  </option>
                  <option
                    value={PublicationReportingSpamSubreason.Repetitive}
                    selected={
                      subReason === PublicationReportingSpamSubreason.Repetitive
                    }
                  >
                    Repetitive
                  </option>
                  <option
                    value={PublicationReportingSpamSubreason.SomethingElse}
                    selected={
                      subReason ===
                      PublicationReportingSpamSubreason.SomethingElse
                    }
                  >
                    Something else
                  </option>
                  <option
                    value={PublicationReportingSpamSubreason.Unrelated}
                    selected={
                      subReason === PublicationReportingSpamSubreason.Unrelated
                    }
                  >
                    Unrelated
                  </option>
                </>
              )}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reason
