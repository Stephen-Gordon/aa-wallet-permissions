
import { createKernelAccountClient, createZeroDevPaymasterClient } from "@zerodev/sdk";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

const publicClient = createPublicClient({
    transport: http(`https://rpc.zerodev.app/api/v2/bundler/${process.env.NEXT_PUBLIC_ZERODEV_ID}`),
});

const useCreateKernel = async (sessionKeyAccount) => {

    console.log("Creating kernel account...");

    if (!sessionKeyAccount) {
        console.log("No session key account");
        return;
    }
    try {


    const kernelClient = createKernelAccountClient({
        account: sessionKeyAccount,
        chain: baseSepolia,
        bundlerTransport: http(`https://rpc.zerodev.app/api/v2/bundler/${process.env.NEXT_PUBLIC_ZERODEV_ID}`),
        entryPoint: ENTRYPOINT_ADDRESS_V07,
        middleware: {
            sponsorUserOperation: async ({ userOperation }) => {
                const zeroDevPaymaster = await createZeroDevPaymasterClient(
                    {
                        chain: baseSepolia,
                        transport: http(`https://rpc.zerodev.app/api/v2/paymaster/${process.env.NEXT_PUBLIC_ZERODEV_ID}`),
                        entryPoint: ENTRYPOINT_ADDRESS_V07
                    }
                );
                return zeroDevPaymaster.sponsorUserOperation({
                    userOperation,
                    entryPoint: ENTRYPOINT_ADDRESS_V07
                });
            }
        }
    });






    
        return kernelClient
    } catch (error) {
    console.log("Error creating kernel account: ", error);
    }
};

export default useCreateKernel;
