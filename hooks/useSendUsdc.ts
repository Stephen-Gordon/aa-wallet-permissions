// react
import { useState } from 'react';
// viem
import { encodeFunctionData, parseUnits, erc20Abi } from 'viem';

// toast 
import { useToast } from "@/components/ui/use-toast"

const useSendUsdc = (kernelClient: any, sessionKeyAccount: any) => {
  const [transactionStatus, setTransactionStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>('');

  const { toast } = useToast()


  const sendUsdc = async (amount: string, payee: string) => {
    try {
     
      const encoded = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [payee as `0x${string}`, parseUnits(amount, 6)],
      });

      setLoading(true);
      console.log("kernel client in send hook", kernelClient)
      
      const userOpHash = await kernelClient.sendUserOperation({
        userOperation: {
            callData: await sessionKeyAccount.encodeCallData({
                to: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC contract address
                value: BigInt(0),
                data: encoded,
            })
        }
      })
      console.log('success')

      if (userOpHash) {
        console.log('userOpHash in hook', userOpHash);
        setLoading(false);
        setTransactionStatus(true);
        setTransactionHash(userOpHash);
        toast({
          title: "USDC Sent",
          description: `Sent ${amount} to ${payee}`,
        })
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      toast({
        title: "Error Sending USDC",
        description: error.message,
        variant: "destructive"
      })
    }
  };

  return { sendUsdc, transactionStatus, loading, transactionHash };
};

export default useSendUsdc;