import { useEffect, useState } from "react";

import { invoke } from "@tauri-apps/api/tauri";

import { Code } from "../../utils/types";
import { LoaderIcon } from "../../shared/icons";

import { usePassword } from "../../stores/password";
import { useCodes } from "../../utils/hooks/useCodes";
import { useInterval } from "../../utils/hooks/useInterval";

interface CodeWithTotp extends Code {
  totp: string;
}

export default function Codes() {
  const password = usePassword((state) => state.password);
  const { status, codes } = useCodes(password);

  const [codesWithTotp, setCodesWithTotp] = useState<CodeWithTotp[] | null>(
    null
  );

  const generateTOTPs = async (codes: Code[]) => {
    const totps = await Promise.all(
      codes.map(async (code) => {
        try {
          const totp = await invoke<string>("generate_totp", {
            argument: code.code,
          });
          return totp;
        } catch (err) {
          console.error(err);
          return "error";
        }
      })
    );

    setCodesWithTotp(
      codes.map((code, index) => {
        return {
          ...code,
          totp: totps[index],
        };
      })
    );

    return totps;
  };

  useEffect(() => {
    const getEntries = async () => {
      await generateTOTPs(codes || []);
    };

    getEntries();
  }, []);

  useInterval(() => {
    generateTOTPs(codes || []);
  }, 1000);

  if (status === "loading") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderIcon className="h-6 w-6 animate-spin text-zinc-100" />
      </div>
    );
  }

  if (!codesWithTotp || codesWithTotp.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-sm opacity-60">No codes</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {codesWithTotp.map((code) => (
        <CodeItem key={code.id} code={code} />
      ))}
    </div>
  );
}

function CodeItem(props: { code: CodeWithTotp }) {
  const { code } = props;

  return (
    <div className="flex flex-col p-2 rounded-lg bg-zinc-900/20">
      <div className="font-medium">{code.name}</div>
      <div className="text-sm font-medium opacity-60">john.doe@example.com</div>
      <div className="text-2xl font-bold text-emerald-600 mt-1">
        {code.totp}
      </div>
    </div>
  );
}
