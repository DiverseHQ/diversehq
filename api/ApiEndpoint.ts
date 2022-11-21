const mode = process.env.NEXT_PUBLIC_NODE_MODE;
// const mode = 'production'
let apiEndpoint:string  = ''
switch (mode) {
  case 'development':
    apiEndpoint = 'http://localhost:8000/apiv1'
    break
  case 'production':
    apiEndpoint = 'https://diversehq.herokuapp.com/apiv1'
    break
  default:
    apiEndpoint = 'https://diversehq.herokuapp.com/apiv1'
}
export default apiEndpoint
