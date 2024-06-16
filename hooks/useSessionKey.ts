import { ModularSigner, deserializePermissionAccount } from "@zerodev/permissions"
import { createKernelAccountClient, createZeroDevPaymasterClient } from "@zerodev/sdk"
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless"
import { createPublicClient, http, zeroAddress } from "viem"
import { baseSepolia } from "viem/chains"

const useSessionKey = async (
    approval: string,
    sessionKeySigner: ModularSigner
  ) => {
    const publicClient = createPublicClient({
      transport: http(`https://rpc.zerodev.app/api/v2/bundler/${process.env.NEXT_PUBLIC_ZERODEV_ID}`),
    })
    const entryPoint = ENTRYPOINT_ADDRESS_V07
    const sessionKeyAccount = await deserializePermissionAccount(
      publicClient,
      entryPoint,
      approval,
      sessionKeySigner
    )
  
    const kernelPaymaster = createZeroDevPaymasterClient({
      entryPoint,
      chain: baseSepolia,
      transport: http(process.env.PAYMASTER_RPC),
    })
    const kernelClient = createKernelAccountClient({
      entryPoint,
      account: sessionKeyAccount,
      chain: baseSepolia,
      bundlerTransport: http(process.env.BUNDLER_RPC),
      middleware: {
        sponsorUserOperation: kernelPaymaster.sponsorUserOperation,
      },
    })
  
    const userOpHash = await kernelClient.sendUserOperation({
      userOperation: {
        callData: await sessionKeyAccount.encodeCallData({
          to: zeroAddress,
          value: BigInt(0),
          data: "0x",
        }),
      },
    })
  
    console.log("userOp hash:", userOpHash)
    // return the kernelclient
}
  
export default useSessionKey