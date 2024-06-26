import { WebAuthnMode, toPasskeyValidator, toWebAuthnKey } from "@zerodev/passkey-validator"
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless"
import { createPublicClient, http } from "viem"

const publicClient = createPublicClient({
    transport: http(`https://rpc.zerodev.app/api/v2/bundler/${process.env.NEXT_PUBLIC_ZERODEV_ID}`),
})

// Register with a passkey hook
const useRegisterWithPasskey = async () => {

    const webAuthnKey = await toWebAuthnKey({
        passkeyName: "ZD Policies",
        passkeyServerUrl: `https://passkeys.zerodev.app/api/v3/${process.env.NEXT_PUBLIC_ZERODEV_ID}`,
        mode: WebAuthnMode.Register
    })
    console.log("webAuthnKey", webAuthnKey)

    const passkeyValidator = await toPasskeyValidator(publicClient, {
        webAuthnKey,
        passkeyServerUrl: `https://passkeys.zerodev.app/api/v3/${process.env.NEXT_PUBLIC_ZERODEV_ID}`,
        entryPoint: ENTRYPOINT_ADDRESS_V07
    })

    return passkeyValidator
}
export default useRegisterWithPasskey