import { removeFile } from "@tauri-apps/api/fs";
import { BaseDirectory } from "@tauri-apps/api/path";
import { Location, Stronghold } from "tauri-plugin-stronghold-api";

import { clientName, storageName, storagePath, vaultName } from "../constants";

export function useSecureStorage() {
  async function getClient(stronghold: Stronghold) {
    try {
      return await stronghold.loadClient(clientName);
    } catch {
      return await stronghold.createClient(clientName);
    }
  }

  const save = async (key: string, value: string, password: string) => {
    const stronghold = await Stronghold.load(storagePath, password);
    const client = await getClient(stronghold);
    const store = client.getStore();
    await store.insert(key, Array.from(new TextEncoder().encode(value)));
    return await stronghold.save();
  };

  const load = async (key: string, password: string) => {
    const stronghold = await Stronghold.load(storagePath, password);
    const client = await getClient(stronghold);
    const store = client.getStore();
    const value = await store.get(key);
    const decoded = new TextDecoder().decode(new Uint8Array(value || []));
    return decoded;
  };

  const reset = async () => {
    return await removeFile(storageName, {
      dir: BaseDirectory.AppConfig,
    });
  };

  const generate = async (password: string) => {
    // await reset();

    const stronghold = await Stronghold.load(storagePath, password);
    const client = await getClient(stronghold);
    const vault = client.getVault(vaultName);

    // Testing
    // const seedLocation = Location.generic(vaultName, "mnemonic");
    // const mnemonic =
    //   "tennis advice tower message birth toy memory physical token mother join crouch equip high umbrella combine hollow gain opinion fortune table torch memory toy";
    // const ret = await vault.recoverBIP39(mnemonic, seedLocation);
    // const tt = window.btoa(String.fromCharCode(...ret));
    // console.log("test", tt);
    // ****

    // Generate seed
    const seedLocation = Location.generic(vaultName, "mnemonic");
    const bip39 = await vault.generateBIP39(seedLocation);
    const mnemonic = new TextDecoder().decode(bip39);

    // Generate private key
    const privkeyLocation = Location.generic(vaultName, "slip10");
    const slip10 = await vault.deriveSLIP10(
      [0, 0, 0],
      "Seed",
      seedLocation,
      privkeyLocation
    );
    const privkey = window.btoa(String.fromCharCode(...slip10));

    // Generate public key
    const ed25519 = await vault.getEd25519PublicKey(privkeyLocation);
    const pubkey = window.btoa(String.fromCharCode(...ed25519));

    console.log("mnemonic", seedLocation, mnemonic);
    console.log("privkey", privkeyLocation, privkey);
    console.log("pubkey", ed25519, pubkey);

    return { mnemonic, privkey, pubkey } as GeneratedKeys;
  };

  return { save, load, reset, generate };
}

export interface GeneratedKeys {
  mnemonic: string;
  privkey: string;
  pubkey: string;
}
