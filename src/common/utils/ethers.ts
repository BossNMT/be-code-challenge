import { AbiCoder } from "@ethersproject/abi";
import { getAddress } from "@ethersproject/address";
import { arrayify } from "@ethersproject/bytes";
import { AddressZero } from "@ethersproject/constants";
import { Contract } from "@ethersproject/contracts";
import { keccak256 as keccak256Base } from "@ethersproject/keccak256";
import { Web3Provider } from "@ethersproject/providers";
import { toUtf8Bytes } from "@ethersproject/strings";
import { Wallet } from "@ethersproject/wallet";

import type { Signer } from "@ethersproject/abstract-signer";
import type { Provider } from "@ethersproject/providers";
export const getLibrary = (provider: any) => {
  return new Web3Provider(provider);
};

// returns the checksummed address if the address is valid, otherwise returns false
function isAddress(value: any) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function getWallet(privateKey: string, provider: Provider) {
  return new Wallet(privateKey, provider);
}

export function getContract(
  address: string,
  ABI: any,
  signer: Provider | Signer,
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return new Contract(address, ABI, signer);
}

export const signMessage = async (
  signer: Signer,
  message: string,
): Promise<string> => {
  return signer.signMessage(message);
};

export const keccak256 = (message: string) =>
  keccak256Base(toUtf8Bytes(message));

export const keccak256Extend = (message: string) => keccak256Base(message);

export const encodeParameters = (types: string[], values: any[]) => {
  return new AbiCoder().encode(types, values);
};

export const generateParamsSign = (params: string[], values: any[]) => {
  const encodedMessage = encodeParameters(params, values);
  const hashMessage = keccak256Extend(encodedMessage);
  return arrayify(hashMessage);
};

export const getNonce = (address: string) => {
  return BigInt(address).toString() + Date.now();
};
