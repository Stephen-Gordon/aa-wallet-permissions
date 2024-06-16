'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { type StoreApi, useStore } from 'zustand'

import {
  type PolicyStore,
  createPolicyStore,
  initPolicyStore,
} from '@/stores/policy-store'
export const PolicyStoreContext = createContext<StoreApi<PolicyStore> | null>(
  null,
)

export interface PolicyStoreProviderProps {
  children: ReactNode
}

export const PolicyStoreProvider = ({
  children,
}: PolicyStoreProviderProps) => {
  const storeRef = useRef<StoreApi<PolicyStore>>()
  if (!storeRef.current) {
    storeRef.current = createPolicyStore(initPolicyStore())
  }

  return (
    <PolicyStoreContext.Provider value={storeRef.current}>
      {children}
    </PolicyStoreContext.Provider>
  )
}

export const usePolicyStore = <T,>(
  selector: (store: PolicyStore) => T,
): T => {
  const policyStoreContext = useContext(PolicyStoreContext)

  if (!policyStoreContext) {
    throw new Error(`usePolicyStore must be use within PolicyStoreProvider`)
  }

  return useStore(policyStoreContext, selector)
}