// ui
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { Button, Label, Input } from "./ui"
import { Loader, Send } from "lucide-react"

// react 
import { useState } from "react"

// hooks
import { useSendUsdc } from "@/hooks"
// state
import { usePolicyStore } from "@/providers/policy-store-provider"
// framer motion
import { AnimatePresence, motion } from "framer-motion"


export default function SendUsdc() {

    // amount to send
    const [amount, setAmount] = useState<string>("")
    // base sepolia usdc faucet address
    const [payee, setPayee] = useState<string>("0xfaec9cdc3ef75713b48f46057b98ba04885e3391")

    // get session key account and kernel client
    const {sessionKeyAccount, kernelClient, isReady } = usePolicyStore((state) => state)
    // send usdc using this hook
    const {sendUsdc, loading, transactionHash } = useSendUsdc(kernelClient, sessionKeyAccount)

    
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Send USDC</CardTitle>
                    <CardDescription>
                        Send USDC to another account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
          
                <div className="grid gap-2">
                    <Label htmlFor="count">Amount</Label>
                    <Input
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter Count"
                        type="number"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="expiry">Payee</Label>
                    <Input
                        onChange={(e) => setPayee(e.target.value)}
                        value={payee}
                        placeholder="Enter Address"
                        type="text"
                    />
                </div>

                </CardContent>
                <CardFooter className="grid space-y-6">
                    <Button 
                        disabled={!isReady}
                        onClick={() => sendUsdc(amount, payee)}
                        className="w-full">
                        <AnimatePresence mode="wait">
                            {loading && isReady && (
                                <motion.div
                                    layout
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center"
                                >
                                    <span>Sending </span>
                                    <Loader className="ml-2 h-4 w-4 animate-spin" />
                                </motion.div>
                            )}
                            {!isReady && !loading && (
                                <motion.div
                                    layout
                                    key="waiting"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center"
                                >
                                    <span>Waiting for Kernel </span>
                                    <Loader className="ml-2 h-4 w-4 animate-spin" />
                                </motion.div>
                            )}
                            {isReady && !loading && (
                                <motion.div
                                    layout
                                    key="send"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center"
                                >
                                    <span>Send</span>
                                    <Send className="ml-2 h-4 w-4" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                    </Button>
                    
                    {transactionHash && (
                        <>
                            <a href={`https://jiffyscan.xyz/userOpHash/${transactionHash}`} target="_blank" className="text-blue-500">View on Basescan</a>          
                        </>
                    )}
                    
                </CardFooter>
            </Card>
        </div>
    )
}