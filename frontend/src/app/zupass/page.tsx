// TODO: Abstract client component into separate file so page does not
// need to be client component
"use client";
import { EthereumOwnershipPCDPackage } from "@pcd/ethereum-ownership-pcd";
import {
    constructZupassPcdProveAndAddRequestUrl,
    openSignedZuzaluSignInPopup,
    useZupassPopupMessages,
    getWithoutProvingUrl,
} from "@pcd/passport-interface";
import { ArgumentTypeName, SerializedPCD } from "@pcd/pcd-types";
import { SemaphoreIdentityPCDPackage } from "@pcd/semaphore-identity-pcd";
import { SemaphoreSignaturePCDPackage } from "@pcd/semaphore-signature-pcd";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const ZUPASS_URL = "https://zupass.org";

export function sendZupassRequest(proofUrl: string) {
    const popupUrl = `#/popup?proofUrl=${encodeURIComponent(proofUrl)}`;
    window.open(popupUrl, "_blank", "width=450,height=600,top=100,popup");
}

async function zupassSignIn(originalSiteName: string) {
    openSignedZuzaluSignInPopup(
        ZUPASS_URL,
        window.location.origin + "#/popup",
        originalSiteName
    );
}

function getEthProofWithoutProving() {
    const url = getWithoutProvingUrl(
        ZUPASS_URL,
        window.location.origin + "/popup",
        EthereumOwnershipPCDPackage.name
    );
    sendZupassRequest(url);
}


export default function Group({ params }: { params: { id: string } }) {
    const [pcdStr] = useZupassPopupMessages();
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // new eth key flow
        if (!pcdStr) return;
        if (!isActive) return;

        const parsed = JSON.parse(pcdStr) as SerializedPCD;

        const ethereum = (window as any).ethereum;
        const provider = new ethers.providers.Web3Provider(ethereum);
        if (!ethereum) {
            alert("Please install MetaMask to use this dApp!");
        }

        (async function () {
            await ethereum.request({ method: "eth_requestAccounts" });
            const pcd = await SemaphoreSignaturePCDPackage.deserialize(parsed.pcd);
            const signature = await provider
                .getSigner()
                .signMessage(pcd.claim.identityCommitment);

            const popupUrl = window.location.origin + "#/popup";

            const proofUrl = constructZupassPcdProveAndAddRequestUrl<
                typeof EthereumOwnershipPCDPackage
            >(ZUPASS_URL, popupUrl, EthereumOwnershipPCDPackage.name, {
                identity: {
                    argumentType: ArgumentTypeName.PCD,
                    pcdType: SemaphoreIdentityPCDPackage.name,
                    value: undefined,
                    userProvided: true,
                    description:
                        "The Semaphore Identity which you are proving owns the given Ethereum address."
                },
                ethereumAddress: {
                    argumentType: ArgumentTypeName.String,
                    value: await provider.getSigner().getAddress()
                },
                ethereumSignatureOfCommitment: {
                    argumentType: ArgumentTypeName.String,
                    value: signature
                }
            });

            sendZupassRequest(proofUrl);
        })();

        setIsActive(false);
    }, [pcdStr, isActive]);



    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-6 lg:p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <h1 className="text-2xl">
                    Connect your Ethereum address to Zupass
                </h1>

                <button
                    onClick={() => {
                        setIsActive(true);
                        zupassSignIn("eth-pcd");
                    }}
                >
                    add a new Ethereum address to Zupass
                </button>


                <button
                    onClick={() => {
                        setIsActive(true);
                        getEthProofWithoutProving();
                    }}
                >
                    get existing Ethereum address from Zupass
                </button>
            </div>
        </main>
    );
}
