import { usePolicyStore } from "@/providers/policy-store-provider";
import { Policy } from "@zerodev/permissions";
import { Button } from "./ui";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { formatUnits } from "viem";

export default function ActivePolicies() {

    const { policies, removePolicy } = usePolicyStore((state) => state);

    // format seconds
    function secondsToDhms(seconds: number | string) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600*24));
        var h = Math.floor(seconds % (3600*24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        
        var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
    }
    // format timestamp
    const formatUnixTimestamp = (timestamp: number) => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString(); 
    }

    return (
        <div className="w-full">
        <Card>
            <CardHeader>
                <CardTitle>Active Policies</CardTitle>
                <CardDescription className="text-wrap">
                    {policies.length <= 0 && 'You have no active policies.'}
                </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
            <Accordion type="single" collapsible className="w-full">
                <AnimatePresence initial={false}>
                    {policies.map((policy: Policy, index) => (
                        <motion.div
                            key={policy.policyParams.policyAddress}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0}}
                            transition={{ 
                                opacity: { duration: 0.2 },
                                height: { duration: 0.4 }
                            }}
                        >
                            <AccordionItem value={`item-${index}`}>
                                <AccordionTrigger>
                                    <p className="text-xl font-semibold leading-none tracking-tight">
                                        {policy.policyParams.type === "call" && "Spend Limit"}
                                        {policy.policyParams.type === "rate-limit" && "Rate Limit"}
                                        {policy.policyParams.type === "timestamp" && "Timestamp"}
                                    </p>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removePolicy(policy.policyParams.policyAddress)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </AccordionTrigger>
                                <AccordionContent>
                                {policy.policyParams.type === "call" && (
                                    <div className="flex justify-between">
                                        <p>Limit:</p> 
                                        <p>{formatUnits(policy?.policyParams?.permissions[0].args[1]?.value.toString(), 6)} USDC</p>
                                    </div>
                                )}
                                {policy.policyParams.type === "rate-limit" && (
                                    <>
                                        <div className="flex justify-between">
                                            <p>Limit</p>
                                            <p>{policy.policyParams.count}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p>Valid for:</p>
                                            <p>{secondsToDhms(policy.policyParams.interval)}</p>
                                        </div>
                                    </>
                                )}

                                {policy.policyParams.type === "timestamp" && (
                                    <>
                                        <div className="flex justify-between">
                                            <p>Valid From:</p>
                                            <p>{formatUnixTimestamp(policy.policyParams.validAfter)}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p>Valid Until:</p>
                                            <p>{formatUnixTimestamp(policy.policyParams.validUntil)}</p>
                                        </div>
                                    </>
                                )}
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    ))}
                </AnimatePresence>
                </Accordion>
                
                
               
             
            </CardContent>
        </Card>
        </div>
    );
}

