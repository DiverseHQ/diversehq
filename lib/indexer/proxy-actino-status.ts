import { fetchData } from "../../auth-fetcher"
import { ProxyActionStatusDocument, ProxyActionStatusQuery, ProxyActionStatusQueryVariables } from "../../graphql/generated"

export const proxyActionStatusRequest = async (proxyActionId: string) => {
    const result = await  fetchData<ProxyActionStatusQuery,ProxyActionStatusQueryVariables>(ProxyActionStatusDocument,{
        proxyActionId
    })()
    return result.proxyActionStatus
}