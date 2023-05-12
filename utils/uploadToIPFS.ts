import { S3 } from '@aws-sdk/client-s3'
// import { Upload } from '@aws-sdk/lib-storage'
import axios from 'axios'
import { v4 as uuid } from 'uuid'
import { EVER_ENDPOINT, EVER_REGION, STS_TOKEN_URL } from './config'

export type IPFSUploadResult = {
  url: string
  type: string
}

const getS3Client = async () => {
  const token = await axios.get(STS_TOKEN_URL)
  const client = new S3({
    endpoint: EVER_ENDPOINT,
    credentials: {
      accessKeyId: token.data?.accessKeyId,
      secretAccessKey: token.data?.secretAccessKey,
      sessionToken: token.data?.sessionToken
    },
    region: EVER_REGION,
    maxAttempts: 5
  })

  return client
}

/**
 *
 * @param data - Data to upload to IPFS
 * @returns attachment array
 */
const uploadToIPFS = async (
  file: File
): Promise<{
  url: string
  type?: string
} | null> => {
  try {
    const client = await getS3Client()
    const params = {
      Bucket: 'diversehq',
      Key: uuid()
    }
    await client.putObject({ ...params, Body: file, ContentType: file.type })
    const result = await client.headObject(params)
    const metadata = result.Metadata

    return {
      url: `ipfs://${metadata?.['ipfs-hash']}`,
      type: file.type || 'image/jpeg'
    }
  } catch (error) {
    console.log('error', error)
    return {
      url: '',
      type: file.type || 'image/jpeg'
    }
  }
}

/* eslint-disable */

// export const everland = async (
//   file: File,
//   onProgress?: (percentage: number) => void
// ) => {
//   try {
//     const token = await axios.get(STS_TOKEN_URL)
//     const client = new S3({
//       endpoint: EVER_ENDPOINT,
//       region: EVER_REGION,
//       // @ts-ignore
//       signatureVersion: 'v4',
//       credentials: {
//         accessKeyId: token.data?.accessKeyId,
//         secretAccessKey: token.data?.secretAccessKey,
//         sessionToken: token.data?.sessionToken
//       },
//       maxAttempts: 10
//     })
//     client.middlewareStack.addRelativeTo(
//       (next: Function) => async (args: any) => {
//         const { response } = await next(args)
//         if (response.body == null) {
//           response.body = new Uint8Array()
//         }
//         return {
//           response
//         }
//       },
//       {
//         name: 'nullFetchResponseBodyMiddleware',
//         toMiddleware: 'deserializerMiddleware',
//         relation: 'after',
//         override: true
//       }
//     )
//     const fileKey = uuid()

//     console.log('fileKey', fileKey)
//     const params = {
//       Bucket: 'diversehq',
//       Key: fileKey,
//       Body: file,
//       ContentType: file.type
//     }
//     const task = new Upload({
//       client,
//       params
//     })
//     task.on('httpUploadProgress', (e) => {
//       const loaded = e.loaded ?? 0
//       const total = e.total ?? 0
//       const progress = (loaded / total) * 100
//       onProgress?.(Math.round(progress))
//     })
//     await task.done()
//     console.log('task', task)
//     const result = await client.headObject({
//       Bucket: 'diversehq',
//       Key: fileKey
//     })

//     console.log('result', result)
//     const metadata = result.Metadata
//     return {
//       url: `ipfs://${metadata?.['ipfs-hash']}`,
//       type: file.type
//     }
//   } catch (error) {
//     console.log(error)
//     return {
//       url: '',
//       type: file.type
//     }
//   }
// }

// const uploadToIPFS = async (
//   file: File,
//   onProgress?: (percentage: number) => void
// ): Promise<IPFSUploadResult> => {
//   const { url, type } = await everland(file, onProgress)
//   console.log(url)
//   return { url, type }
// }

export default uploadToIPFS
