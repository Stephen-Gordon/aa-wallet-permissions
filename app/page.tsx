'use client'

import { usePolicyStore } from "@/providers/policy-store-provider"

import { useEffect} from "react"



import useRegisterWithPasskey from "@/hooks/useRegisterWithPasskey"
import { useLoginWithPasskey } from "@/hooks"

import useCreateKernel from "@/hooks/useCreateKernel"

import useCreateSessionKeyAccount from "@/hooks/useCreateSessionKeyAccount"

import SpendingLimit from "@/components/SpendingLimit"
import TimeLimit from "@/components/TimeLimit"
import RateLimit from "@/components/RateLimit"
import ActivePolicies from "@/components/ActivePolicies"
import SendUsdc from "@/components/SendUsdc"

import { Button } from "@/components/ui"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"




export default function Home() {



  const { policies, setPasskeyValidator, passkeyValidator, sessionKeyAccount, kernelClient, setKernelClient, setSessionKeyAccount, setLoggedIn, loggedIn  } = usePolicyStore((state) => state)

    
  // register a user
  const handleRegister = async () => {
    const data = await useRegisterWithPasskey()
    setPasskeyValidator(data)
    setLoggedIn(true)
  }

  // login a user
  const handleLogin = async () => {
    const data = await useLoginWithPasskey()
    setPasskeyValidator(data)
    setLoggedIn(true)
  }


  useEffect(() => {
    // update the session account and kernel if the policies change 
    console.log(process.env.NEXT_PUBLIC_ZERODEV_ID ,"env")
    const onPolicyChange = async () => {
        const ska = await useCreateSessionKeyAccount({passkeyValidator, policies})
        setSessionKeyAccount(ska)
        const kc = await useCreateKernel(ska)
        setKernelClient(kc)
    }
    //onPolicyChange()

}, [policies])


  return (

    <div className="grid mx-auto w-full max-w-4xl px-4 md:px-6 min-h-screen py-24">      

      {!loggedIn && (
        <div className="w-full flex justify-center">
          <Card className="w-full h-fit max-w-[350px]">
          <CardHeader>
            <CardTitle>Register or Login</CardTitle>
            <CardDescription>
              Register or Login with Passkeys to start using Policies
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button className="w-full" onClick={handleRegister}>Register</Button>
            <Button className="w-full" onClick={handleLogin}>Login</Button>
          </CardContent>
        </Card>
        </div>
      )}

      {loggedIn && (
        <>
          <h1 className="text-4xl font-bold">Zerodev Policies</h1>
          <p>Address: {kernelClient?.account?.address}</p>
          <div>
            <p>Get some USDC from the Base Faucet <a className="text-blue-500" href="https://faucet.circle.com" target="_blank"></a></p>
          </div>
      
          <div className="grid gap-8 mt-16">
            <div className="w-full grid grid-cols-2 gap-8">
                <SendUsdc/>
                <ActivePolicies/>
              </div>
              <div className="gap-8 grid grid-cols-2">
                <SpendingLimit/> 
                <TimeLimit/>
                <RateLimit/>
              </div>
            
          </div>
        </>
      )}

      
 
    

     
    </div>

  );
}