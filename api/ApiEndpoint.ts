const mode = process.env.NEXT_PUBLIC_NODE_MODE;
// const mode = 'development'
let apiEndpoint:string  = ''
switch (mode) {
  case 'development':
    apiEndpoint = 'http://localhost:8000/apiv1'
    break
  case 'production':
    apiEndpoint = 'https://web-production-5080.up.railway.app/apiv1'
    break
  default:
    apiEndpoint = 'https://web-production-5080.up.railway.app/apiv1'
}
export default apiEndpoint
