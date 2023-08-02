import { useState } from "react";
import { Link } from "react-router-dom";

import Codes from "./codes";
import NewCodeModal from "./new";

import {
  ArrowPathRoundedSquareIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";

export default function AuthenticatorScreen() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative h-full w-full border border-zinc-900/60 rounded-lg p-2">
      {showModal && <NewCodeModal setShowModal={setShowModal} />}
      <div className="flex flex-col items-start justify-start gap-4 h-full w-full">
        <Codes />
        <BottomBar setShowModal={setShowModal} />
      </div>
    </div>
  );
}

function BottomBar(props: { setShowModal: (showModal: boolean) => void }) {
  const { setShowModal } = props;

  return (
    <div className="absolute bottom-2 left-0 flex justify-center items-center w-full">
      <div className="flex flex-row gap-1.5 px-3 py-1.5 items-center rounded-lg bg-zinc-900">
        <button
          className="p-1.5 bg-zinc-700/60 hover:bg-zinc-700 rounded-lg"
          onClick={() => {}}
        >
          <ArrowPathRoundedSquareIcon className="h-5 w-5" />
        </button>
        <button
          className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <SquaresPlusIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
