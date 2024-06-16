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
   

    // Early return if passkeyValidator is not provided
  /*   if (!passkeyValidator) {
        console.log("No passkey validator");
        return;
    } */


    console.log("Passkey validator:", passkeyValidator);
    console.log("Creating session key account...");


    
    let num = 0.1
    let value = parseUnits(num.toString(), 6)
    const callPolicy = toCallPolicy({
        permissions: [
        {
            // target address
            target: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
            // Maximum value that can be transferred.  In this case we
            // set it to zero so that no value transfer is possible.
           
            valueLimit: parseUnits("0.1", 6),
            // Contract abi
            abi: erc20Abi,
            // Function name
            functionName: "transfer",
            // An array of conditions, each corresponding to an argument for
            // the function.
           /*  args: [
            {
                condition: ParamCondition.EQUAL,
                value: num.toString() as `0x${string}`,
                
            },
            null

            ],   */
        },
        ],
    })
    try {
        // Generate a private key for ECDSA signer
        const privateKey = generatePrivateKey();
        const ecdsaSigner = await toECDSASigner({
            signer: privateKeyToAccount(privateKey),
        });
        console.log("ECDSA Signer:", ecdsaSigner);

        // Create a sudo policy
        const sudoPolicy = await toSudoPolicy({});

        // Create a permission validator
        const permissionValidator = await toPermissionValidator(publicClient, {
            signer: ecdsaSigner,
            policies: policies?.length > 0 ? policies : [sudoPolicy],
            //policies: [callPolicy, timestampPolicy],
            
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
