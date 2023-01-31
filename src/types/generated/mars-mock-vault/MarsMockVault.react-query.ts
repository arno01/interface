// @ts-nocheck
/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.24.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import { Coin, StdFee } from '@cosmjs/amino'
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate'
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query'

import { MarsMockVaultClient, MarsMockVaultQueryClient } from './MarsMockVault.client'
import { Empty, Uint128, VaultInfoResponse, VaultStandardInfoResponse } from './MarsMockVault.types'
export const marsMockVaultQueryKeys = {
  contract: [
    {
      contract: 'marsMockVault',
    },
  ] as const,
  address: (contractAddress: string | undefined) =>
    [{ ...marsMockVaultQueryKeys.contract[0], address: contractAddress }] as const,
  vaultStandardInfo: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      {
        ...marsMockVaultQueryKeys.address(contractAddress)[0],
        method: 'vault_standard_info',
        args,
      },
    ] as const,
  info: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsMockVaultQueryKeys.address(contractAddress)[0], method: 'info', args }] as const,
  previewDeposit: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsMockVaultQueryKeys.address(contractAddress)[0], method: 'preview_deposit', args },
    ] as const,
  previewRedeem: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsMockVaultQueryKeys.address(contractAddress)[0], method: 'preview_redeem', args },
    ] as const,
  totalAssets: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsMockVaultQueryKeys.address(contractAddress)[0], method: 'total_assets', args },
    ] as const,
  totalVaultTokenSupply: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      {
        ...marsMockVaultQueryKeys.address(contractAddress)[0],
        method: 'total_vault_token_supply',
        args,
      },
    ] as const,
  convertToShares: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsMockVaultQueryKeys.address(contractAddress)[0], method: 'convert_to_shares', args },
    ] as const,
  convertToAssets: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsMockVaultQueryKeys.address(contractAddress)[0], method: 'convert_to_assets', args },
    ] as const,
  vaultExtension: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsMockVaultQueryKeys.address(contractAddress)[0], method: 'vault_extension', args },
    ] as const,
}
export interface MarsMockVaultReactQuery<TResponse, TData = TResponse> {
  client: MarsMockVaultQueryClient | undefined
  options?: Omit<
    UseQueryOptions<TResponse, Error, TData>,
    "'queryKey' | 'queryFn' | 'initialData'"
  > & {
    initialData?: undefined
  }
}
export interface MarsMockVaultVaultExtensionQuery<TData>
  extends MarsMockVaultReactQuery<Empty, TData> {}
export function useMarsMockVaultVaultExtensionQuery<TData = Empty>({
  client,
  options,
}: MarsMockVaultVaultExtensionQuery<TData>) {
  return useQuery<Empty, Error, TData>(
    marsMockVaultQueryKeys.vaultExtension(client?.contractAddress),
    () => (client ? client.vaultExtension() : Promise.reject(new Error('Invalid client'))),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsMockVaultConvertToAssetsQuery<TData>
  extends MarsMockVaultReactQuery<Uint128, TData> {
  args: {
    amount: Uint128
  }
}
export function useMarsMockVaultConvertToAssetsQuery<TData = Uint128>({
  client,
  args,
  options,
}: MarsMockVaultConvertToAssetsQuery<TData>) {
  return useQuery<Uint128, Error, TData>(
    marsMockVaultQueryKeys.convertToAssets(client?.contractAddress, args),
    () =>
      client
        ? client.convertToAssets({
            amount: args.amount,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsMockVaultConvertToSharesQuery<TData>
  extends MarsMockVaultReactQuery<Uint128, TData> {
  args: {
    amount: Uint128
  }
}
export function useMarsMockVaultConvertToSharesQuery<TData = Uint128>({
  client,
  args,
  options,
}: MarsMockVaultConvertToSharesQuery<TData>) {
  return useQuery<Uint128, Error, TData>(
    marsMockVaultQueryKeys.convertToShares(client?.contractAddress, args),
    () =>
      client
        ? client.convertToShares({
            amount: args.amount,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsMockVaultTotalVaultTokenSupplyQuery<TData>
  extends MarsMockVaultReactQuery<Uint128, TData> {}
export function useMarsMockVaultTotalVaultTokenSupplyQuery<TData = Uint128>({
  client,
  options,
}: MarsMockVaultTotalVaultTokenSupplyQuery<TData>) {
  return useQuery<Uint128, Error, TData>(
    marsMockVaultQueryKeys.totalVaultTokenSupply(client?.contractAddress),
    () => (client ? client.totalVaultTokenSupply() : Promise.reject(new Error('Invalid client'))),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsMockVaultTotalAssetsQuery<TData>
  extends MarsMockVaultReactQuery<Uint128, TData> {}
export function useMarsMockVaultTotalAssetsQuery<TData = Uint128>({
  client,
  options,
}: MarsMockVaultTotalAssetsQuery<TData>) {
  return useQuery<Uint128, Error, TData>(
    marsMockVaultQueryKeys.totalAssets(client?.contractAddress),
    () => (client ? client.totalAssets() : Promise.reject(new Error('Invalid client'))),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsMockVaultPreviewRedeemQuery<TData>
  extends MarsMockVaultReactQuery<Uint128, TData> {
  args: {
    amount: Uint128
  }
}
export function useMarsMockVaultPreviewRedeemQuery<TData = Uint128>({
  client,
  args,
  options,
}: MarsMockVaultPreviewRedeemQuery<TData>) {
  return useQuery<Uint128, Error, TData>(
    marsMockVaultQueryKeys.previewRedeem(client?.contractAddress, args),
    () =>
      client
        ? client.previewRedeem({
            amount: args.amount,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsMockVaultPreviewDepositQuery<TData>
  extends MarsMockVaultReactQuery<Uint128, TData> {
  args: {
    amount: Uint128
  }
}
export function useMarsMockVaultPreviewDepositQuery<TData = Uint128>({
  client,
  args,
  options,
}: MarsMockVaultPreviewDepositQuery<TData>) {
  return useQuery<Uint128, Error, TData>(
    marsMockVaultQueryKeys.previewDeposit(client?.contractAddress, args),
    () =>
      client
        ? client.previewDeposit({
            amount: args.amount,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsMockVaultInfoQuery<TData>
  extends MarsMockVaultReactQuery<VaultInfoResponse, TData> {}
export function useMarsMockVaultInfoQuery<TData = VaultInfoResponse>({
  client,
  options,
}: MarsMockVaultInfoQuery<TData>) {
  return useQuery<VaultInfoResponse, Error, TData>(
    marsMockVaultQueryKeys.info(client?.contractAddress),
    () => (client ? client.info() : Promise.reject(new Error('Invalid client'))),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsMockVaultVaultStandardInfoQuery<TData>
  extends MarsMockVaultReactQuery<VaultStandardInfoResponse, TData> {}
export function useMarsMockVaultVaultStandardInfoQuery<TData = VaultStandardInfoResponse>({
  client,
  options,
}: MarsMockVaultVaultStandardInfoQuery<TData>) {
  return useQuery<VaultStandardInfoResponse, Error, TData>(
    marsMockVaultQueryKeys.vaultStandardInfo(client?.contractAddress),
    () => (client ? client.vaultStandardInfo() : Promise.reject(new Error('Invalid client'))),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsMockVaultVaultExtensionMutation {
  client: MarsMockVaultClient
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsMockVaultVaultExtensionMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsMockVaultVaultExtensionMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsMockVaultVaultExtensionMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.vaultExtension(msg, fee, memo, funds),
    options,
  )
}
export interface MarsMockVaultRedeemMutation {
  client: MarsMockVaultClient
  msg: {
    amount: Uint128
    recipient?: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsMockVaultRedeemMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsMockVaultRedeemMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsMockVaultRedeemMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.redeem(msg, fee, memo, funds),
    options,
  )
}
export interface MarsMockVaultDepositMutation {
  client: MarsMockVaultClient
  msg: {
    amount: Uint128
    recipient?: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsMockVaultDepositMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsMockVaultDepositMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsMockVaultDepositMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.deposit(msg, fee, memo, funds),
    options,
  )
}