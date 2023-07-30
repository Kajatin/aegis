import { appConfigDir } from "@tauri-apps/api/path";

export const vaultName = "aegis-vault";
export const clientName = "aegis-client";
export const storageName = "aegis.securestorage.stronghold";
export const storagePath = `${await appConfigDir()}${storageName}`;
