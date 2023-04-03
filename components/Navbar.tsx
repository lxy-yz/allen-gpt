import { IconExternalLink } from "@tabler/icons-react";
import Icon from "./Icon";

export const Navbar = ({ showSettings, setShowSettings }: { showSettings: boolean, setShowSettings(value: boolean): void }) => {
  return (
    <div className="flex h-[60px] border-b border-slate-500 py-2 px-8 items-center justify-between">
      <div className="font-semibold text-lg flex items-center">
        <a
          className="hover:opacity-50"
          href="https://liallen.me"
        >
          {/* AMA GPT */}
          <Icon className="w-8 h-8 mr-2" />
        </a>
      </div>
      <div className="flex items-center gap-2">
        <div className="">
          <button
            className="flex cursor-pointer items-center space-x-2 px-3 py-1 hover:opacity-50"
            onClick={() => setShowSettings(!showSettings)}
          >
            Settings
          </button>
        </div>
        <a
          className="flex items-center hover:opacity-50"
          href="https://blog.liallen.me"
          target="_blank"
          rel="noreferrer"
        >
          <div className="hidden sm:flex">Blog</div>

          <IconExternalLink
            className="ml-1"
            size={20}
          />
        </a>
      </div>
    </div>
  );
};
