import { WebAuthnMode, toPasskeyValidator, toWebAuthnKey } from "@zerodev/passkey-validator"
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless"
import { createPublicClient, http } from "viem"

const publicClient = createPublicClient({
    transport: http(`https://rpc.zerodev.app/api/v2/bundler/${process.env.NEXT_PUBLIC_ZERODEV_ID}`),
})

// Login with a passkey hook
const useLoginWithPasskey = async () => {

    const webAuthnKey = await toWebAuthnKey({
        passkeyName: "ZD Policies",
        passkeyServerUrl: `https://passkeys.zerodev.app/api/v3/${process.env.NEXT_PUBLIC_ZERODEV_ID}`,
        mode: WebAuthnMode.Login
    })

    console.log("env", process.env.NEXT_PUBLIC_ZERODEV_ID)
    const passkeyValidator = await toPasskeyValidator(publicClient, {
        webAuthnKey,
        passkeyServerUrl: `https://passkeys.zerodev.app/api/v3/${process.env.NEXT_PUBLIC_ZERODEV_ID}`,
        entryPoint: ENTRYPOINT_ADDRESS_V07
    })
    
    return passkeyValidator
}
export default useLoginWithPasskey