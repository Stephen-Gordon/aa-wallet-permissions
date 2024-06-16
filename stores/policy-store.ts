import useCreateKernel from '@/hooks/useCreateKernel'
import useCreateSessionKeyAccount from '@/hooks/useCreateSessionKeyAccount'
import { Policy } from '@zerodev/permissions'
import { createStore } from 'zustand/vanilla'

export type PolicyState = {
  policies: any []
  passkeyValidator: any
  sessionKeyAccount: any
  kernelClient: any
  loggedIn: boolean
  isReady: boolean
}

export type PolicyActions = {
    addPolicy: (policy: any) => void
    removePolicy: (policyAddress: any) => void
    setPasskeyValidator: (passkeyValidator: any) => void
    setSessionKeyAccount: (sessionKeyAccount: any) => void
    setKernelClient: (kernelClient: any) => void
    setLoggedIn: (loggedIn: boolean) => void
    setIsReady: (isReady: boolean) => void
}

export type PolicyStore = PolicyState & PolicyActions

export const initPolicyStore = (): PolicyState => {
    return { policies: [], passkeyValidator: null, sessionKeyAccount: null, kernelClient: null, loggedIn: false, isReady: false }
    }

export const defaultInitState: PolicyState = {
    policies: [],
    passkeyValidator: null,
    sessionKeyAccount: null,
    kernelClient: null,
    loggedIn: false,
    isReady: false
}

export const createPolicyStore = (
  initState: PolicyState = defaultInitState,
) => {
  return createStore<PolicyStore>()((set) => ({
    ...initState,
    addPolicy: (newPolicy: { policyParams: { policyAddress: string }; [key: string]: any }) => set((state) => {
      const policyAddress = newPolicy.policyParams.policyAddress;
      const updatedPolicies = state.policies.filter(policy => policy.policyParams.policyAddress !== policyAddress);
      updatedPolicies.push(newPolicy);
      return { policies: updatedPolicies };
    }),
    removePolicy: (policyAddress: any) => {
      set((state) => {
        console.log('removing policy', policyAddress);
        const updatedPolicies = state.policies.filter(policy => policy.policyParams.policyAddress !== policyAddress);
        return { policies: updatedPolicies };
      });
    },
    setPasskeyValidator: (passkeyValidator: any) => set((state) => ({ passkeyValidator })),
    setSessionKeyAccount: (sessionKeyAccount: any) => set((state) => ({ sessionKeyAccount })),
    setKernelClient: (kernelClient: any) => set((state) => ({ kernelClient })),
    setLoggedIn: (loggedIn: boolean) => set((state) => ({ loggedIn })),
    setIsReady: (isReady: boolean) => set((state) => ({ isReady })),
  }))
}
