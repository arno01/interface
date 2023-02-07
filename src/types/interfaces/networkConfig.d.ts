interface NetworkConfig {
  name: string
  hiveUrl: string
  rpcUrl: string
  restUrl: string
  apolloAprUrl: string
  contracts: {
    addressProvider: string
    redBank: string
    incentives: string
    oracle: string
    rewardsCollector: string
    treasury: string
    safetyFund: string
    protocolRewardsCollector: string
    accountNft: string
    creditManager: string
  }
  assets: {
    base: Asset
    whitelist: Asset[]
    other: OtherAsset[]
  }
  displayCurrency: {
    denom: string
    prefix: string
    suffix: string
    decimals: number
  }
  appUrl: string
  councilUrl: string
  wallets: import('@marsprotocol/wallet-connector').WalletID[]
}
