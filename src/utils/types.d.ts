export interface User {
  id: number;
  npub: string;
  pubkey: string;
  privkey: string;
}

export interface Code {
  id: number;
  name: string;
  code: string;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
}
