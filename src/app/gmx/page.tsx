import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GMX Smart Dashboard',
  description:
    'GMX is a decentralized spot and perpetual exchange that supports low swap fees and zero price impact trades.Trading is supported by a unique multi-asset pool that earns liquidity providers fees from market making, swap fees, leverage trading (spreads, funding fees & liquidations) and asset rebalancing. Dynamic pricing is supported by Chainlink Oracles along with TWAP pricing from leading volume DEXs.',
}

function Page() {
  return (
    <div>
      <h1>GMX</h1>
    </div>
  )
}

export default Page
