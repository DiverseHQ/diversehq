import { client, challenge, authenticate, parseJwt } from '../../utils/lensAuth'
import { useAccount, useSignMessage } from 'wagmi'
import { useProfile } from '../Common/WalletContext'

export default function LensSign() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage({
    onSettled(data, error) {
      console.log('Settled', { data, error })
    }
  })
  const { lensToken, setLensToken } = useProfile()

  async function login() {
    try {
      /* first request the challenge from the API server */
      const challengeInfo = await client.query({
        query: challenge,
        variables: { address }
      })
      console.log({ challengeInfo })
      /* ask the user to sign a message with the challenge info returned from the server */
      const signature = await signMessageAsync({
        message: challengeInfo.data.challenge.text
      })
      console.log(signature)
      /* authenticate the user */
      const authData = await client.mutate({
        mutation: authenticate,
        variables: {
          address,
          signature
        }
      })
      /* if user authentication is successful, you will receive an accessToken and refreshToken */
      const { accessToken, refreshToken } = authData.data.authenticate
      const accessTokenData = parseJwt(accessToken)
      localStorage.setItem(
        'STORAGE_KEY',
        JSON.stringify({
          accessToken,
          refreshToken,
          exp: accessTokenData.exp
        })
      )
      setLensToken(accessToken)
    } catch (err) {
      console.log('Error signing in: ', err)
    }
  }
  return (
    <>
      {address && !lensToken && (
        <button onClick={login} className="border p-btn p-2 rounded ">
          Lens Login
        </button>
      )}
      {/* once the user has authenticated, show them a success message */}
      {address && lensToken && (
        <button className=" border p-btn p-2 rounded">Signed In</button>
      )}
    </>
  )
}
