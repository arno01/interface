import Tippy from '@tippyjs/react'
import BigNumber from 'bignumber.js'
import { AnimatedNumber, Apy, Card, DisplayCurrency } from 'components/common'
import { VaultLogo, VaultName } from 'components/fields'
import { getTimeAndUnit, ltvToLeverage } from 'libs/parse'
import Link from 'next/link'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import useStore from 'store'

import styles from './AvailableVaultsTableMobile.module.scss'

export const AvailableVaultsTableMobile = () => {
  const { t } = useTranslation()
  const availableVaults = useStore((s) => s.availableVaults)
  const baseCurrency = useStore((s) => s.baseCurrency)
  const redBankAssets = useStore((s) => s.redBankAssets)

  if (!availableVaults?.length) return null

  return (
    <Card
      title={t('fields.availableVaults')}
      styleOverride={{ marginBottom: 40 }}
      tooltip={<Trans i18nKey='fields.tooltips.availableVaults.mobile' />}
    >
      <div className={styles.container}>
        {availableVaults.map((vault, i) => {
          const borrowAsset = redBankAssets.find((asset) => asset.denom === vault.denoms.secondary)
          const maxBorrowRate = Number(borrowAsset?.borrowRate ?? 0) * vault.ltv.max
          const minAPY = new BigNumber(vault.apy || 0).toNumber()

          const leverage = ltvToLeverage(vault.ltv.max)
          const maxAPY =
            new BigNumber(minAPY).times(leverage).decimalPlaces(2).toNumber() - maxBorrowRate
          const apyDataNoLev = { total: vault.apy || 0, borrow: 0 }
          const apyDataLev = { total: vault.apy || 0, borrow: maxBorrowRate }
          return (
            <Link
              key={`${vault.address}-${i}`}
              href={`/farm/vault/${vault.address}/create`}
              className={styles.link}
            >
              <div className={styles.grid} key={`${vault.address}-${i}`}>
                <div className={styles.logo}>
                  <VaultLogo vault={vault} />
                </div>
                <div className={styles.name}>
                  <VaultName vault={vault} />
                </div>
                <div className={styles.stats}>
                  <div onClick={(e) => e.preventDefault()} className='xl'>
                    <span className='faded'>{t('common.apy')} </span>
                    <span>
                      <Tippy content={<Apy apyData={apyDataNoLev} leverage={1} />}>
                        <span className='tooltip xl'>
                          <AnimatedNumber amount={minAPY} suffix='-' />
                        </span>
                      </Tippy>
                      <Tippy
                        content={
                          <Apy apyData={apyDataLev} leverage={ltvToLeverage(vault.ltv.max)} />
                        }
                      >
                        <span className='tooltip xl'>
                          <AnimatedNumber amount={maxAPY} suffix='%' />
                        </span>
                      </Tippy>
                    </span>
                  </div>
                  <div className='s'>
                    <span className='faded'>{t('fields.leverage')} </span>
                    <AnimatedNumber amount={leverage} suffix='x' />
                  </div>
                  <div className='s'>
                    <span className='faded'>{t('fields.vaultCap')} </span>
                    <span>
                      <DisplayCurrency
                        coin={{
                          denom: baseCurrency.denom,
                          amount: (vault.vaultCap?.max || 0).toString(),
                        }}
                        className={styles.inline}
                      />
                    </span>
                  </div>
                </div>
                <div className={styles.description}>
                  {t('fields.tooltips.name', {
                    asset1: vault.symbols.primary,
                    asset2: vault.symbols.secondary,
                    ...getTimeAndUnit(vault.lockup),
                  })}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </Card>
  )
}
