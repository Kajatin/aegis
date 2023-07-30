export interface User {
  id: number;
  npub: string;
  pubkey: string;
  privkey: string;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
}
