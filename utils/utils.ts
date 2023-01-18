import { Web3Storage } from 'web3.storage'
import { storage } from './firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { create } from 'ipfs-http-client'
import { PublicationMetadataV2Input } from '../graphql/generated'
import { BigNumber, utils } from 'ethers'

export const uploadFileToIpfs = async (file: File): Promise<string> => {
  // eslint-disable-next-line
  const token: string = String(process.env.NEXT_PUBLIC_WEB_STORAGE)
  const newFile: File = new File([file], file.name.replace(/\s/g, '_'), {
    type: file.type
  })
  const storage = new Web3Storage({ token })
  const cid = await storage.put([newFile])
  return `https://dweb.link/ipfs/${cid}/${newFile.name}`
}

// string to string of give length
export const stringToLength = (str: string, length: number): string => {
  if (!str) return str
  if (str.length <= length) return str
  return str.slice(0, length) + (str.length > length ? '...' : '')
}

// simple date to since data
export const dateToSince = (date: string): string => {
  const date1 = new Date(date)
  const date2 = new Date()
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'

  if (diffDays < 7) return diffDays + ' days ago'
  if (diffDays < 30) return Math.floor(diffDays / 7) + ' weeks ago'
  if (diffDays < 365) return Math.floor(diffDays / 30) + ' months ago'
  return Math.floor(diffDays / 365) + ' years ago'
}

export const uploadFileToFirebaseAndGetUrl = async (
  file: File,
  address: string
) => {
  console.log('file', file)
  const newFile = new File([file], file.name.replace(/\s/g, '_'), {
    type: file.type
  })
  let type = newFile.type.split('/')[0]
  if (!type) {
    type = 'other'
  }
  const path = `${type}/${address.toLowerCase()}/${newFile.name}`
  const storageRef = ref(storage, path)

  const uploadedToUrl = await uploadBytes(storageRef, newFile).then(
    async (snapshot) => {
      console.log('Uploaded a blob or newFile!')
      //return newFile url
      const url = await getDownloadURL(snapshot.ref).then((url) => {
        console.log('newFile available at', url)
        return url
      })
      return url
    }
  )
  return { uploadedToUrl, path }
}

/* eslint-disable */
const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(
      `${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}:${process.env.NEXT_PUBLIC_INFURA_API_SECRET}`,
      'utf-8'
    ).toString('base64')}`
  }
})

/* eslint-enable */

export const uploadToIpfsInfura = async (data: PublicationMetadataV2Input) => {
  const result = await client.add(JSON.stringify(data))
  console.log('upload result ipfs', result)
  return result
}

export const uploadToIpfsInfuraAndGetPath = async (
  data: PublicationMetadataV2Input
) => {
  const result = await client.add(JSON.stringify(data))
  console.log('upload result ipfs', result)
  return result.path
}

export const uploadFileToIpfsInfuraAndGetPath = async (file: File) => {
  const result = await client.add(file)
  console.log('upload result ipfs', result)
  return result.path
}

export const hasWhiteSpace = (s: string): boolean => {
  return /\s/g.test(s)
}

export const countLinesFromMarkdown = (markdownText: string): number => {
  return (markdownText?.match(/\n/g) || []).length
}

export const postIdFromIndexedResult = (
  profileId: string,
  indexedResult: any
) => {
  const logs = indexedResult.txReceipt.logs
  const topicId = utils.id(
    'PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)'
  )
  const profileCreatedLog = logs.find((l: any) => l.topics[0] === topicId)
  let profileCreatedEventLog = profileCreatedLog.topics
  const publicationId = utils.defaultAbiCoder.decode(
    ['uint256'],
    profileCreatedEventLog[2]
  )[0]
  const postId = profileId + '-' + BigNumber.from(publicationId).toHexString()
  return postId
}

export const getURLsFromText = (text: string) => {
  const urlRegex = /(((https?:\/\/)|(www\.))\S+)/g
  return text.match(urlRegex) ?? []
}
