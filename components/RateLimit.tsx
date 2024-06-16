import { Input, Button, Label } from "@/components/ui"
import { usePolicyStore } from "@/providers/policy-store-provider"

// zerodev
import { toRateLimitPolicy } from "@zerodev/permissions/policies"
import { useState } from "react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { useToast } from "./ui/use-toast"


export default function RateLimit() {

    const [count, setCount] = useState<number>(1)
    const [interval, setSecondInterval] = useState<number>(86400)

    const { addPolicy } = usePolicyStore((state) => state)

    const { toast } = useToast()


    const rateLimitPolicy = toRateLimitPolicy({
        count: count,
        interval: interval,
    })


    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Rate Limit</CardTitle>
                    <CardDescription>
                        Choose a rate limit policy. You will only be able to send a certain number of transactions within a certain time frame.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">


                <div className="grid gap-2">
                    <Label htmlFor="count">Count</Label>
                    <Input
                        onChange={(e) => setCount(parseInt(e.target.value))}
                        placeholder="Enter Count"
                        type="number"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Select onValueChange={(value:string) => setSecondInterval(Number(value))}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="60">1 minute</SelectItem>
                            <SelectItem value="86400">1 day</SelectItem>
                            <SelectItem value="604800">1 week</SelectItem>
                            <SelectItem value="2592000">1 month</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                </CardContent>
                <CardFooter>
                    <Button onClick={() => {
                        addPolicy(rateLimitPolicy)
                        toast({
                            title: "Rate Limit Policy Added",
                        })
                    }} className="w-full">Add Policy</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
