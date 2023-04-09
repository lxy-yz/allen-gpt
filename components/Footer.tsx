import { IconBrandGithub, IconBrandTwitter } from "@tabler/icons-react";
import type { FC } from "react";

export const Footer: FC = () => {
  return (
    <div className="flex h-[50px] border-t border-gray-500 py-2 px-8 items-center sm:justify-between justify-center">
      <div className="hidden sm:flex"></div>

      <div className="text-sm">
        {/* Based on the
        <a
          className="hover:opacity-50 mx-1"
          href="https://blog.liallen.me/posts"
          target="_blank"
          rel="noreferrer"
        >
          essays
        </a>
        of Allen. */}
        🤖 powered search for Allen{"'"}s essays.
      </div>

      <div className="hidden sm:flex space-x-4">
        <a
          className="flex items-center hover:opacity-50"
          href="https://github.com/lxy-yz"
          target="_blank"
          rel="noreferrer"
        >
          <IconBrandGithub size={24} />
        </a>
      </div>
    </div>
  );
};
