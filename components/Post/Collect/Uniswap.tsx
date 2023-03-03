import React from 'react'
import { FeeCollectModuleSettings } from '../../../graphql/generated'
import getUniswapURL from './lib/getUniswapURL'

const Uniswap = ({ module }: { module: FeeCollectModuleSettings }) => {
  return (
    <a
      href={getUniswapURL(
        parseFloat(module?.amount?.value),
        module?.amount?.asset?.address
      )}
      target="_blank"
      rel="noreferrer noopener"
    >
      <div className="bg-p-btn text-p-btn-text rounded-xl w-fit py-2 px-4">
        Swap at Uniswap
      </div>
    </a>
  )
}

export default Uniswap
