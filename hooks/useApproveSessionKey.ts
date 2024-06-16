import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator"
import { serializePermissionAccount, toPermissionValidator } from "@zerodev/permissions"
import { toSudoPolicy } from "@zerodev/permissions/policies"
import { toECDSASigner } from "@zerodev/permissions/signers"
import { addressToEmptyAccount, createKernelAccount } from "@zerodev/sdk"
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless"
import { Address, Hex, createPublicClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"

const publicClient = createPublicClient({
    transport: http(`https://rpc.zerodev.app/api/v2/bundler/${process.env.NEXT_PUBLIC_ZERODEV_ID}`),
})
const useApproveSessionKey = async (sessionKeyAddress: Address) => {
   
    const entryPoint = ENTRYPOINT_ADDRESS_V07
    const signer = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)

    const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
      entryPoint,
      signer,
    })
  
    // Create an "empty account" as the signer -- you only need the public
    // key (address) to do this.
    const emptyAccount = addressToEmptyAccount(sessionKeyAddress)
    const emptySessionKeySigner = await toECDSASigner({ signer: emptyAccount })
  
    const permissionPlugin = await toPermissionValidator(publicClient, {
      entryPoint,
      signer: emptySessionKeySigner,
      policies: [
        // In this example, we are just using a sudo policy to allow everything.
        // In practice, you would want to set more restrictive policies.
        toSudoPolicy({}),
      ],
    })
  
    const sessionKeyAccount = await createKernelAccount(publicClient, {
      entryPoint,
      plugins: {
        sudo: ecdsaValidator,
        regular: permissionPlugin,
      },
    })
  
    return await serializePermissionAccount(sessionKeyAccount)
  }
export default useApproveSessionKey;