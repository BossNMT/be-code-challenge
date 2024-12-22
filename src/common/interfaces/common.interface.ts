import { Network } from "common/enums/network.enum";

export interface IAttribute {
  trait_type: string;
  value: string;
}

export interface NFTInput {
  contract_address: string;
  token_id: number;
  network: Network;
}
