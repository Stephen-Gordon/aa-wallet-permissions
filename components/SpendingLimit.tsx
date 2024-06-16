// ui
import { Input, Button, Label } from "@/components/ui"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./ui/card"

// store
import { usePolicyStore } from "@/providers/policy-store-provider"

// zerodev
import { ParamCondition, toCallPolicy } from "@zerodev/permissions/policies"

//viem
import { Address, erc20Abi, parseUnits } from "viem"

// react
import { useState } from "react"
import { useToast } from "./ui/use-toast"

export default function SpendingLimit () {
    
    
    // spending limit
    const [spendLimit, setSpendLimit] = useState<string>("")

    const { addPolicy } = usePolicyStore((state) => state)

    const {toast} = useToast()
    
    // create a call policy
    // the call policy will be used to set the usdc spending limit
    const callPolicy = toCallPolicy({
        permissions: [
            {
                // usdc contract address 
                target: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
                // set the spending limit
                valueLimit: parseUnits(spendLimit, 6),
                // Contract abi
                abi: erc20Abi,
                // Function name
                functionName: "transfer",
                // arguments from the usdc transfer function 
                // pass in an address and a value
                args: [
                    {
                        condition: ParamCondition.EQUAL,
                        // base sepolia usdc faucet address
                        value: "0xfaec9cdc3ef75713b48f46057b98ba04885e3391" as Address,
                    },
                    {
                        // less than or equal the spending limit
                        condition: ParamCondition.LESS_THAN_OR_EQUAL,
                        value: parseUnits(spendLimit, 6),
                    }
                ],
            },
        ],
    })

   
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Spending Limit</CardTitle>
                    <CardDescription>
                        Choose a Spening limit for USDC, You wont be able to spend more than the limit
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input 
                        id="amount"
                        onChange={(e) => setSpendLimit(e.target.value)}
                        placeholder="Amount" 
                        type="number" 
                    />
                </div>
                </CardContent>
                <CardFooter>
                    
                    <Button onClick={() => {
                        addPolicy(callPolicy)
                        toast({
                            title: "Spend Limit Policy Added",
                        })
                    }} className="w-full">Add Policy</Button>
                </CardFooter>
            </Card>
        </div>
    )

}