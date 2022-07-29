// Extra Dependencies
import DiveToken from "../../utils/DiveToken.json";
import {toBuffer} from "ethereumjs-util";
import {ethers} from "ethers"
import { Biconomy } from "@biconomy/mexa";

const CONTRACT_ADDRESS = "0x5d781fA0fB8241B5fA998B89bD9175a95625DB72"

let config = {
  contract: {
      address: CONTRACT_ADDRESS,
      abi: DiveToken,
  },
  apiKey: {
      test: "g5GSvGp0O.5beb05f5-40f6-422a-ad77-e264632cf8e8",
      prod: "g5GSvGp0O.5beb05f5-40f6-422a-ad77-e264632cf8e8"
  },
  api: {
      test: "https://test-api.biconomy.io",
      prod: "https://api.biconomy.io"
  }
}


let ethersProvider,walletProvider, walletSigner;
let contract = new ethers.Contract(
  config.contract.address,
  config.contract.abi,
  Biconomy.getSignerByAddress(userAddress)
);
contractInterface = new ethers.utils.Interface(config.contract.abi);
walletProvider = new ethers.providers.Web3Provider(window.ethereum);
 walletSigner = walletProvider.getSigner();

 let messageToSign = constructMetaTransactionMessage(nonce.toNumber(),4,  functionSignature, config.contract.address);             
const signature = await walletSigner.signMessage(messageToSign);
let { r, s, v } = getSignatureParameters(signature);
sendTransaction(userAddress, functionSignature, r, s, v);

//////////
/**helpers**/

const getSignatureParameters = signature => {
        if (!ethers.utils.isHexString(signature)) {
            throw new Error(
                'Given value "'.concat(signature, '" is not a valid hex string.')
            );
        }
        var r = signature.slice(0, 66);
        var s = "0x".concat(signature.slice(66, 130));
        var v = "0x".concat(signature.slice(130, 132));
        v = ethers.BigNumber.from(v).toNumber();
        if (![27, 28].includes(v)) v += 27;
        return {
            r: r,
            s: s,
            v: v
        };
    };             
    
const constructMetaTransactionMessage = (nonce, salt, functionSignature, contractAddress) => {
        return abi.soliditySHA3(
            ["uint256","address","uint256","bytes"],
            [nonce, contractAddress, salt, toBuffer(functionSignature)]
        );
      }

// Initialize Constants
export const onSubmitWithPersonalSign = async event => {
  if (contract) {
      setTransactionHash("");
      if (metaTxEnabled) {
          showInfoMessage(`Getting user signature`);
          let userAddress = selectedAddress;
          let nonce = await contract.getNonce(userAddress);
          let functionSignature = contractInterface.encodeFunctionData();
          let message = {};
          message.nonce = parseInt(nonce);
          message.from = userAddress;
          message.functionSignature = functionSignature;

          let messageToSign = constructMetaTransactionMessage(
              nonce.toNumber(),
              salt,
              functionSignature,
              config.contract.address
            );
          const signature = await walletSigner.signMessage(messageToSign);

          console.info(`User signature is ${signature}`);
          let { r, s, v } = getSignatureParameters(signature);
          sendTransaction(userAddress, functionSignature, r, s, v);
      } else {
          console.log("Sending normal transaction");
          let tx = await contract.setQuote(newQuote);
          console.log("Transaction hash : ", tx.hash);
          showInfoMessage(`Transaction sent by relayer with hash ${tx.hash}`);
          let confirmation = await tx.wait();
          console.log(confirmation);
          setTransactionHash(tx.hash);
          showSuccessMessage("Transaction confirmed on chain");
      }
  } else {
      showErrorMessage("Contract is not initialized");
  }
};