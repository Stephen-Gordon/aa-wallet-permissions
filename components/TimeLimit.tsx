

// store
import { usePolicyStore } from "@/providers/policy-store-provider"

// zerodev
import { toTimestampPolicy } from "@zerodev/permissions/policies"
import { useState } from "react"

//  ui
import { Button, Label } from "@/components/ui"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { useToast } from "./ui/use-toast"



export default function TimeLimit() {

    const [startTime, setStartTime] = useState<number>(0)
    const [endTime, setEndTime] = useState<number>(0)

    const { addPolicy } = usePolicyStore((state) => state)

    const { toast } = useToast()
    
    const timestampPolicy = toTimestampPolicy({
        validAfter: startTime,
        validUntil: endTime,
    })

    const handleSelectChange = (value: string) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const valAsNum = Number(value); 
        const endTime = currentTime + valAsNum; 

        setEndTime(endTime);
        setStartTime(currentTime);
      };
    


    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Time Limit</CardTitle>
                    <CardDescription>
                        Choose a time limit for the policy. Once the time limit is reached, the policy will no longer be valid.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                <div className="grid gap-2">

                    <Label htmlFor="expiry">Expiry</Label>

                    <Select onValueChange={handleSelectChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="120">2 minute</SelectItem>
                            <SelectItem value="600">10 minutes</SelectItem>
                            <SelectItem value="1800">30 minutes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => {
                        addPolicy(timestampPolicy)
                        toast({
                            title: "Time Limit Policy pAdded",
                        })
                    }} className="w-full">Add Policy</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
