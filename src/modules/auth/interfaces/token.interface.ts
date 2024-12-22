import { TokenTypes } from "../constants/token.constant";

export interface ICreateToken {
  user: string;
  type: TokenTypes;
  role: string;
  name: string;
}

export interface IVerifySignature {
  signature: string;
  message: string;
  address: string;
}
