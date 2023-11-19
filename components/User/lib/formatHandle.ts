import { HandleInfo } from '../../../graphql/generated'

/**
 *
 * @param handle - Complete handle
 * @param keepSuffix - Keep .lens or .test suffix
 * @returns formatted handle without .lens or .test suffix
 */
const formatHandle = (handleInfo?: HandleInfo, keepSuffix = false): string => {
  if (!handleInfo) {
    return ''
  }
  if (keepSuffix) {
    return handleInfo.fullHandle
  }

  return handleInfo.localName
}

export default formatHandle
