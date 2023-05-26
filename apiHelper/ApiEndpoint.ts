//eslint-disable-next-line
export const mode = process.env.NEXT_PUBLIC_NODE_API_MODE
// const mode = 'production'
let apiEndpoint: string = ''
switch (mode) {
  case 'development':
    apiEndpoint = 'http://localhost:8000/apiv1'
    break
  case 'production':
    apiEndpoint = 'https://diverse-hq-api-alpha.vercel.app/apiv1'
    break
  case 'testnet':
    apiEndpoint =
      'https://diverse-hq-api-git-dev-diversehq-xyz.vercel.app/apiv1'
    break
  default:
    apiEndpoint = 'https://diverse-hq-api-diversehq.vercel.app/apiv1'
}
export default apiEndpoint
