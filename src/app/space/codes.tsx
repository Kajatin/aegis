import { useEffect, useState } from "react";
import { LoaderIcon } from "../../shared/icons";
import { useCodes } from "../../utils/hooks/useCodes";
import { Code } from "../../utils/types";
import { invoke } from "@tauri-apps/api/tauri";
import { useInterval } from "../../utils/hooks/useInterval";
import { useSecureStorage } from "../../utils/hooks/useSecureStorage";

interface CodeWithTotp extends Code {
  totp: string;
}

export default function Codes() {
  const { status, codes } = useCodes("password1234");

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
    <div className="flex flex-col gap-2">
      {codesWithTotp.map((code) => (
        <CodeItem key={code.id} code={code} />
      ))}
    </div>
  );
}

function CodeItem(props: { code: CodeWithTotp }) {
  return (
    <div className="flex flex-col gap-2">
      <div>{props.code.name}</div>
      <div>{props.code.totp}</div>
    </div>
  );
}
