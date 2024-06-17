import { toPermissionValidator } from "@zerodev/permissions";
import { ParamCondition, toCallPolicy, toSudoPolicy, toTimestampPolicy } from "@zerodev/permissions/policies";
import { toECDSASigner } from "@zerodev/permissions/signers";
import {  createKernelAccount } from "@zerodev/sdk";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { createPublicClient, erc20Abi, http, parseUnits } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";


// Create a public client for communication
const publicClient = createPublicClient({
    transport: http(`https://rpc.zerodev.app/api/v2/bundler/${process.env.NEXT_PUBLIC_ZERODEV_ID}`),
});

interface ICreateSessionKeyAccount {
    passkeyValidator: any;
    policies?: any[];
}
// Custom hook to create a session key account
const useCreateSessionKeyAccount = async ({ passkeyValidator, policies }: ICreateSessionKeyAccount) => {

    console.log("Policies in Hook:", policies);

    const entryPoint = ENTRYPOINT_ADDRESS_V07;
   
    try {
        // Generate a private key for ECDSA signer
        const privateKey = generatePrivateKey();
        const ecdsaSigner = await toECDSASigner({
            signer: privateKeyToAccount(privateKey),
        });

        // Create a sudo policy
        const sudoPolicy = await toSudoPolicy({});

        // Create a permission validator
        const permissionValidator = await toPermissionValidator(publicClient, {
            signer: ecdsaSigner,
            policies: policies?.length > 0 ? policies : [sudoPolicy],            
            entryPoint,
        });
        console.log("Permission Validator:", permissionValidator);

        // Create a kernel account with the passkey validator plugin
        const account = await createKernelAccount(publicClient, {
            plugins: {
                sudo: passkeyValidator,
                regular: permissionValidator
            },
            entryPoint,
        });
        console.log("Account created:", account);

        return account;
    } catch (error) {
        console.error("Error creating session key account:", error);
    }
};

export default useCreateSessionKeyAccount;
