import Tippy from '@tippyjs/react'
import classNames from 'classnames'
import {
  AnimatedNumber,
  Apy,
  BorrowCapacity,
  DisplayCurrency,
  TokenBalance,
} from 'components/common'
import { MARS_DECIMALS, MARS_SYMBOL, VAULT_DEPOSIT_BUFFER } from 'constants/appConstants'
import { getLiqBorrowValue, getMaxBorrowValue } from 'functions/fields'
import { useAsset, usePrice, useRedBankAsset } from 'hooks/data'
import { formatCooldown, formatValue, lookup } from 'libs/parse'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import useStore from 'store'

import styles from './BreakdownTable.module.scss'

interface Props {
  vault: Vault
  prevPosition: Position
  newPosition: Position
  isRepay?: boolean
  setIsRepay?: React.Dispatch<React.SetStateAction<boolean>>
  isAfter?: boolean
  className?: string
  hideTitle?: boolean
  isSetUp?: boolean
}

export enum AmountType {
  NET_PRIMARY,
  NET_SECONDARY,
  DEBT,
  POSITION_PRIMARY,
  POSITION_SECONDARY,
}

export const BreakdownTable = (props: Props) => {
  const { t } = useTranslation()
  const primaryAsset = useAsset({ denom: props.vault.denoms.primary })
  const secondaryAsset = useAsset({ denom: props.vault.denoms.secondary })
  const convertToDisplayCurrency = useStore((s) => s.convertToDisplayCurrency)

  const primaryPrice = usePrice(props.vault.denoms.primary)
  const secondaryPrice = usePrice(props.vault.denoms.secondary)
  const secondaryRedBankAsset = useRedBankAsset(props.vault.denoms.secondary)
  const primaryChange = props.newPosition.amounts.primary - props.prevPosition.amounts.primary
  const secondaryChange = props.newPosition.amounts.secondary - props.prevPosition.amounts.secondary
  const borrowedChange = props.newPosition.amounts.borrowed - props.prevPosition.amounts.borrowed

  const containerClasses = classNames([
    props.className,
    styles.container,
    props.isAfter && styles.isAfter,
  ])

  const getTokenBalance = (amountType: AmountType) => {
    let denom = ''
    let amount = 0
    switch (amountType) {
      case AmountType.NET_PRIMARY:
        amount = props.newPosition.amounts.primary
        denom = props.vault.denoms.primary
        break
      case AmountType.NET_SECONDARY:
        amount = props.newPosition.amounts.secondary
        denom = props.vault.denoms.secondary
        break
      case AmountType.DEBT:
        amount = props.newPosition.amounts.borrowed
        denom = props.vault.denoms.secondary
        break
      case AmountType.POSITION_PRIMARY:
        amount = props.newPosition.amounts.primary
        denom = props.vault.denoms.primary
        break
      case AmountType.POSITION_SECONDARY:
        amount = props.newPosition.amounts.secondary + props.newPosition.amounts.borrowed
        denom = props.vault.denoms.secondary
        break
    }

    return (
      <TokenBalance
        coin={{
          denom,
          amount: amount.toString(),
        }}
        maxDecimals={2}
      />
    )
  }

  const getChangeText = (amount: number, type: 'primary' | 'secondary', isBorrow?: boolean) => {
    const decimals = type === 'primary' ? primaryAsset?.decimals : secondaryAsset?.decimals
    const symbol = type === 'primary' ? primaryAsset?.symbol : secondaryAsset?.symbol
    return (
      <span
        className={
          (amount > 0 && !isBorrow) || (amount < 0 && isBorrow)
            ? 'colorInfoProfit'
            : 'colorInfoLoss'
        }
      >
        {amount !== 0
          ? formatValue(
              lookup(amount, symbol ?? MARS_SYMBOL, decimals ?? MARS_DECIMALS),
              0,
              4,
              true,
              amount > 0 ? '(+' : '(',
              ')',
              true,
              false,
            )
          : ''}
      </span>
    )
  }

  const getValueText = (type: 'net' | 'borrowed' | 'total') => (
    <DisplayCurrency
      prefixClass='s faded'
      valueClass='m faded'
      isApproximation
      coin={{
        amount: props.newPosition.values[type].toString(),
        denom: props.vault.denoms.primary,
      }}
    />
  )

  const maxBorrowValue = useMemo(
    () => getMaxBorrowValue(props.vault, props.newPosition),
    [props.vault, props.newPosition],
  )

  const getWarningMessage = () => {
    const isReducingSupply =
      props.prevPosition.amounts.primary > props.newPosition.amounts.primary ||
      props.prevPosition.amounts.secondary > props.newPosition.amounts.secondary

    if (isReducingSupply) {
      return (
        <p className={styles.warning}>
          {t('fields.messages.unlockWarning', { time: formatCooldown(props.vault.lockup) })}
        </p>
      )
    }

    const isReducingDebt = props.newPosition.amounts.borrowed < props.prevPosition.amounts.borrowed
    if (isReducingDebt) {
      return (
        <>
          <p className={styles.warning}>{t('fields.messages.noReduce')}</p>
          <p className={styles.repay} onClick={() => props.setIsRepay && props.setIsRepay(true)}>
            {t('fields.messages.repayFromWallet')}
          </p>
        </>
      )
    }

    const additionalPositionValue = props.isSetUp
      ? props.newPosition.values.total
      : props.newPosition.values.total - props.prevPosition.values.total
    const vaultCap = (props.vault.vaultCap?.max || 0) * VAULT_DEPOSIT_BUFFER
    const isVaultCapReached = props.vault.vaultCap
      ? props.vault.vaultCap.used + additionalPositionValue > vaultCap
      : false

    if (isVaultCapReached && props.vault.vaultCap) {
      const leftoverCap = vaultCap - props.vault.vaultCap.used
      const maxPositionValue = convertToDisplayCurrency({
        amount: ((props.isSetUp ? 0 : props.prevPosition.values.total) + leftoverCap).toString(),
        denom: 'uosmo',
      })

      if (maxPositionValue <= 0) {
        return <p className={styles.warning}>{t('fields.messages.vaultCapReached')}</p>
      }

      return (
        <p className={styles.warning}>
          {t('fields.messages.vaultCap', {
            amount: formatValue(maxPositionValue, 0, 2, true, '$'),
          })}
        </p>
      )
    }

    return null
  }

  /* APY CALCULATION */
  const currentLeverage = props.newPosition.currentLeverage

  const trueBorrowRate =
    (Number(secondaryRedBankAsset?.borrowRate ?? 0) / 2) * (Number(currentLeverage) - 1)
  const apy = (props.vault.apy || 0) * currentLeverage - trueBorrowRate

  const apyData = {
    total: props.vault.apy || 0,
    borrow: trueBorrowRate,
  }

  return (
    <div className={containerClasses}>
      {!props.hideTitle && (
        <p className={`sCaps ${styles.title}`}>{props.isAfter ? 'After' : 'Before'}</p>
      )}

      <div className={styles.stats}>
        <div className={styles.apy}>
          <span className='faded'>{t('common.apy')}: </span>
          <Tippy content={<Apy apyData={apyData} leverage={currentLeverage} />}>
            <span className='tooltip'>
              <AnimatedNumber amount={apy} suffix='%' abbreviated={false} />
            </span>
          </Tippy>
        </div>
        <div className={styles.price}>
          <span className='faded'>{formatValue(1, 0, 0, false, false, ' OSMO ≈ ')}</span>

          <AnimatedNumber
            amount={primaryPrice / secondaryPrice}
            minDecimals={0}
            maxDecimals={4}
            thousandSeparator={true}
            suffix={` ${props.vault.symbols.secondary}`}
            abbreviated={false}
          />
        </div>
      </div>
      <table className={styles.values}>
        <tbody>
          <tr className={`${styles.labelRow} faded`}>
            <td colSpan={2}>{t('fields.supply')}</td>
            <td></td>
          </tr>
          <tr className={styles.supplyRow}>
            <td className={`${styles.showDesktop} faded`}>{t('fields.supply')}</td>
            <td className={styles.alignRight}>
              <div>{getTokenBalance(AmountType.NET_PRIMARY)}</div>
              {props.newPosition.amounts.secondary > 0 && (
                <div>{getTokenBalance(AmountType.NET_SECONDARY)}</div>
              )}
            </td>
            <td>
              <div>{primaryAsset?.symbol}</div>
              {props.newPosition.amounts.secondary > 0 && <div>{secondaryAsset?.symbol}</div>}
            </td>
            <td>
              <div>{getChangeText(primaryChange, 'primary')}</div>
              {props.newPosition.amounts.secondary > 0 && (
                <div>{getChangeText(secondaryChange, 'secondary')}</div>
              )}
            </td>
            <td className={styles.space}>{getValueText('net')}</td>
          </tr>

          <tr className={`${styles.labelRow} faded`}>
            <td colSpan={2}>{t('common.debt')}</td>
            <td></td>
          </tr>

          <tr className={styles.debtRow}>
            <td className={`${styles.showDesktop} faded`}>{t('common.debt')}</td>
            <td className={styles.alignRight}>{getTokenBalance(AmountType.DEBT)}</td>
            <td>{secondaryAsset?.symbol}</td>
            <td>{getChangeText(borrowedChange, 'secondary', true)}</td>
            <td>{getValueText('borrowed')}</td>
          </tr>

          <tr className={`${styles.labelRow} faded`}>
            <td colSpan={2}>{t('fields.positionValue')}</td>
            <td></td>
          </tr>

          <tr className={styles.posValueRow}>
            <td className={`${styles.showDesktop} faded`}>{t('fields.positionValue')}</td>
            <td className={styles.alignRight}>
              <div>{getTokenBalance(AmountType.POSITION_PRIMARY)}</div>
              <div>{getTokenBalance(AmountType.POSITION_SECONDARY)}</div>
            </td>
            <td>
              <div>{primaryAsset?.symbol}</div>
              <div>{secondaryAsset?.symbol}</div>
            </td>
            <td>
              <div>{getChangeText(primaryChange, 'primary')}</div>
              <div> {getChangeText(secondaryChange + borrowedChange, 'secondary')}</div>
            </td>
            <td>{getValueText('total')}</td>
          </tr>
        </tbody>
      </table>
      {!props.isRepay && <div className={styles.reduceMessage}>{getWarningMessage()}</div>}
      <BorrowCapacity
        className={styles.borrowCapacity}
        limit={maxBorrowValue}
        max={getLiqBorrowValue(props.vault, maxBorrowValue)}
        balance={props.newPosition.values.borrowed}
        barHeight={'24px'}
        showPercentageText
      />
    </div>
  )
}
