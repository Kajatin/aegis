import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createUser } from "../../../utils/storage";
import {
  GeneratedKeys,
  useSecureStorage,
} from "../../../utils/hooks/useSecureStorage";

import { LoaderIcon } from "../../../shared/icons";
import { usePassword } from "../../../stores/password";

export default function CreateStep2Screen() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const password = usePassword((state) => state.password);

  // Generate keys
  const { generate } = useSecureStorage();
  const [keys, setKeys] = useState<GeneratedKeys | null>(null);
  useEffect(() => {
    if (!password || keys) return;

    const generateKeys = async () => {
      const { mnemonic, privkey, pubkey } = await generate(password);
      setKeys({ mnemonic, privkey, pubkey });
    };
    generateKeys();
  }, [keys, password]);

  const download = async () => {
    await writeTextFile(
      "aegis-keys.txt",
      `Public key: ${keys?.pubkey || "invalid"}\nPrivate key: ${
        keys?.privkey || "invalid"
      }\nMnemonic: ${keys?.mnemonic || "invalid"}`,
      {
        dir: BaseDirectory.Download,
      }
    );
    setDownloaded(true);
  };

  const user = useMutation({
    mutationFn: (data: { pubkey: string }) => {
      return createUser(data.pubkey);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
    },
  });

  const submit = () => {
    if (!keys?.mnemonic || loading) return;

    setLoading(true);

    user.mutate({
      pubkey: keys.pubkey || "",
    });

    // redirect to next step
    setTimeout(() => navigate("/auth/onboarding", { replace: true }), 1200);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="text-center text-xl font-semibold">
        Your mnemonic phrase
      </div>
      <div className="flex flex-col gap-2">
        <MnemonicDisplay mnemonic={keys?.mnemonic || null} />
        <div className="text-sm opacity-60">
          This mnemonic phrase is used to generate your private key. If you
          forget this phrase, you will lose access to your account! Copy it and
          keep it in a safe place. There is no other way to recover your account
          otherwise.
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          disabled={loading || !keys?.mnemonic}
          className={
            "flex w-full items-center justify-center rounded-lg px-5 py-3 font-medium bg-emerald-600 transition-all " +
            (!loading && keys?.mnemonic && "hover:bg-emerald-500")
          }
          onClick={() => submit()}
        >
          {loading || !keys?.mnemonic ? (
            <LoaderIcon className="w-6 h-6 animate-spin" />
          ) : (
            "I have saved my phrase, continue"
          )}
        </button>
        <button
          disabled={!keys?.mnemonic}
          className={
            "flex w-full items-center justify-center rounded-lg px-5 py-3 font-medium bg-zinc-800/60 transition-all " +
            (keys?.mnemonic && "hover:bg-zinc-800")
          }
          onClick={() => download()}
        >
          {downloaded
            ? "Saved to Downloads folder"
            : keys?.mnemonic
            ? "Download"
            : "Generating.."}
        </button>
      </div>
    </div>
  );
}

const MnemonicDisplay = (props: { mnemonic: string | null }) => {
  const { mnemonic } = props;

  const words = (
    mnemonic ||
    "human lonely hollow cheese destroy slight shield fit joy field great timber around very spy switch panel reform have front chimney skull exhibit hold"
  ).split(" ");
  const [blurred, setBlurred] = useState(true);

  return (
    <div
      className="flex bg-zinc-900/60 rounded-lg p-6 cursor-pointer"
      onClick={() => setBlurred(!blurred)}
    >
      <div
        className={
          "flex flex-row flex-wrap justify-center gap-2.5 font-bold text-lg " +
          (blurred && "blur-sm")
        }
      >
        {words.map((word, index) => {
          const color = getNextColor(index, words.length);

          return (
            <div
              key={index}
              className={
                "transition-all duration-500 ease-in-out " +
                (mnemonic === null && "opacity-0")
              }
              style={{
                color: color,
                textShadow: `${color} 0 2px 12px`,
              }}
            >
              {word}
            </div>
          );
        })}
      </div>
    </div>
  );
};

function getNextColor(index: number, max: number) {
  const hue = Math.floor((index / max) * 360) % 360;
  return `hsl(${hue}, 85%, 60%)`;
}
