import { Answer } from "@/components/Answer/Answer";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { EssayChunk } from "@/types";
import { APP_NAME } from "@/utils/constants";
import {
  IconArrowRight,
  IconExternalLink,
  IconSearch,
} from "@tabler/icons-react";
import endent from "endent";
import Head from "next/head";
import { Fragment, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

const LOCAL_STORAGE_MATCH_COUNT_KEY =
  APP_NAME.replaceAll(" ", "_").toUpperCase() + "_MATCH_COUNT";
const LOCAL_STORAGE_MODE_KEY =
  APP_NAME.replaceAll(" ", "_").toUpperCase() + "_MODE";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string>("");
  const [chunks, setChunks] = useState<EssayChunk[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [mode, setMode] = useState<"search" | "chat">("chat");
  const [matchCount, setMatchCount] = useState<number>(5);
  const [apiKey] = useState<string>(
    process.env.NEXT_PUBLIC_OPENAI_API_KEY as string
  );

  const handleSearch = async () => {
    if (!apiKey) {
      alert("Please enter an API key.");
      return;
    }

    if (!query) {
      alert("Please enter a query.");
      return;
    }

    setAnswer("");
    setChunks([]);

    setLoading(true);

    const searchResponse = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, apiKey, matches: matchCount }),
    });

    if (!searchResponse.ok) {
      setLoading(false);
      throw new Error(searchResponse.statusText);
    }

    const results: EssayChunk[] = await searchResponse.json();

    setChunks(results);

    setLoading(false);

    inputRef.current?.focus();

    return results;
  };

  const handleAnswer = async () => {
    if (!apiKey) {
      alert("Please enter an API key.");
      return;
    }

    if (!query) {
      alert("Please enter a query.");
      return;
    }

    setAnswer("");
    setChunks([]);

    setLoading(true);

    const searchResponse = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, apiKey, matches: matchCount }),
    });

    if (!searchResponse.ok) {
      setLoading(false);
      throw new Error(searchResponse.statusText);
    }

    const results: EssayChunk[] = await searchResponse.json();

    setChunks(results);

    const prompt = endent`
    Use the following passages to provide an answer to the query: "${query}"

    ${results?.map((d: any) => d.content).join("\n\n")}
    `;

    const answerResponse = await fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, apiKey }),
    });

    if (!answerResponse.ok) {
      setLoading(false);
      throw new Error(answerResponse.statusText);
    }

    const data = answerResponse.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setAnswer((prev) => prev + chunkValue);
    }

    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (mode === "search") {
        handleSearch();
      } else {
        handleAnswer();
      }
    }
  };

  const handleSave = () => {
    if (apiKey.length !== 51) {
      alert("Please enter a valid API key.");
      return;
    }

    localStorage.setItem(LOCAL_STORAGE_MATCH_COUNT_KEY, matchCount.toString());
    localStorage.setItem(LOCAL_STORAGE_MODE_KEY, mode);

    setShowSettings(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    // localStorage.removeItem("PG_KEY");
    // setApiKey("");
    localStorage.removeItem(LOCAL_STORAGE_MATCH_COUNT_KEY);
    setMatchCount(5);
    localStorage.removeItem(LOCAL_STORAGE_MODE_KEY);
    setMode("chat");
  };

  useEffect(() => {
    if (matchCount > 10) {
      setMatchCount(10);
    } else if (matchCount < 1) {
      setMatchCount(1);
    }
  }, [matchCount]);

  useEffect(() => {
    // const PG_KEY = localStorage.getItem("PG_KEY");
    // if (PG_KEY) {
    //   setApiKey(PG_KEY);
    // }

    const matchCount = localStorage.getItem(LOCAL_STORAGE_MATCH_COUNT_KEY);
    if (matchCount) {
      setMatchCount(parseInt(matchCount));
    }

    const mode = localStorage.getItem(LOCAL_STORAGE_MODE_KEY);
    if (mode) {
      setMode(mode as "search" | "chat");
    }

    inputRef.current?.focus();
  }, []);

  return (
    <>
      <Head>
        <title>Allen GPT</title>
        <meta
          name="description"
          content={`AI-powered search and chat for Allen's essays.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gpt bg-cover flex flex-col h-screen">
        <Navbar showSettings={showSettings} setShowSettings={setShowSettings} />

        <div className="break-words	flex-1 overflow-auto">
          <div className="mx-auto flex h-full w-full max-w-[750px] flex-col items-center px-3 pt-4 sm:pt-8">
            {showSettings && (
              <>
                <Transition appear show={showSettings} as={Fragment}>
                  <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => setShowSettings(false)}
                  >
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                      <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title
                              as="h3"
                              className="text-lg font-medium leading-6 text-gray-900"
                            >
                              Settings
                            </Dialog.Title>

                            <div className="mt-4 text-sm text-gray-500 w-[340px] sm:w-[400px]">
                              <div className="flex flex-col gap-1">
                                <div>Mode</div>
                                <select
                                  className="max-w-[400px] block w-full cursor-pointer rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                  value={mode}
                                  onChange={(e) =>
                                    setMode(e.target.value as "search" | "chat")
                                  }
                                >
                                  <option value="search">Search</option>
                                  <option value="chat">Chat</option>
                                </select>
                              </div>

                              <div className="mt-3 flex flex-col gap-1">
                                <div>Passage Count</div>
                                <input
                                  type="number"
                                  min={1}
                                  max={10}
                                  value={matchCount}
                                  onChange={(e) =>
                                    setMatchCount(Number(e.target.value))
                                  }
                                  className="max-w-[400px] block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                />
                              </div>

                              {/* <div className="mt-2">
                                <div>OpenAI API Key</div>
                                <input
                                  type="password"
                                  placeholder="OpenAI API Key"
                                  className="max-w-[400px] block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                                  value={apiKey}
                                  onChange={(e) => {
                                    setApiKey(e.target.value);

                                    if (e.target.value.length !== 51) {
                                      setShowSettings(true);
                                    }
                                  }}
                                />
                              </div> */}

                              <div className="mt-4 flex space-x-3 justify-center">
                                <div
                                  className="flex cursor-pointer items-center space-x-2 rounded-full px-3 py-1 text-sm 
                                  text-green-900 bg-green-200 hover:bg-green-300"
                                  onClick={handleSave}
                                >
                                  Save
                                </div>

                                <div
                                  className="flex cursor-pointer items-center space-x-2 rounded-full px-3 py-1 text-sm 
                                  text-red-900  bg-red-200  hover:bg-red-300"
                                  onClick={handleClear}
                                >
                                  Clear
                                </div>
                              </div>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              </>
            )}

            {apiKey.length === 51 ? (
              <div className="w-full">
                <div className="relative mt-10 lg:mt-20">
                  <IconSearch className="absolute top-3 w-10 left-1 h-6 rounded-full opacity-50 sm:left-3 sm:top-4 sm:h-8" />
                  <input
                    ref={inputRef}
                    className="text-gray-700 h-12 w-full rounded-full border border-zinc-600 pr-12 pl-11 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pr-16 sm:pl-16 sm:text-lg"
                    type="text"
                    placeholder="What is the meaning of life?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <style jsx>{`
                    input:placeholder-shown {
                      // font-style: italic;
                    }
                  `}</style>

                  <button>
                    <IconArrowRight
                      onClick={mode === "search" ? handleSearch : handleAnswer}
                      className="absolute right-2 top-2.5 h-7 w-7 rounded-full bg-blue-500 p-1 hover:cursor-pointer hover:bg-blue-600 sm:right-3 sm:top-3 sm:h-10 sm:w-10 text-white"
                    />
                  </button>
                </div>

                <h2
                  className="text-center italic mx-auto te font-bold text-3xl mt-12
                  break-words truncate bg-clip-text text-transparent
                  bg-gradient-to-r from-green-400 to-blue-500
                 "
                >
                  Ask Allen Anything.
                </h2>
              </div>
            ) : (
              <div className="text-center font-bold text-3xl mt-7">
                Please enter your
                <a
                  className="mx-2 underline hover:opacity-50"
                  href="https://platform.openai.com/account/api-keys"
                >
                  OpenAI API key
                </a>
                in settings.
              </div>
            )}

            {loading ? (
              <div className="mt-6 w-full">
                {mode === "chat" && (
                  <>
                    <div className="font-bold text-2xl">Answer</div>
                    <div className="animate-pulse mt-2">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                    </div>
                  </>
                )}

                <div className="font-bold text-2xl mt-6">Passages</div>
                <div className="animate-pulse mt-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                </div>
              </div>
            ) : answer ? (
              <div className="w-full mt-6">
                <div className="font-bold text-2xl mb-2">Answer</div>
                <Answer text={answer} />

                <div className="w-full mt-6 mb-16">
                  <div className="font-bold text-2xl">Passages</div>

                  {chunks.map((chunk, index) => (
                    <div key={index}>
                      <div className="mt-4 border border-zinc-600 rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-bold text-xl">
                              {/* FIXME: title with <img /> tag */}
                              {chunk.essay_title.replace(
                                /<img[^>]+src="([^"]+)"(.*)\/>/i,
                                "➜"
                              )}
                            </div>
                            <div className="mt-1 font-bold text-sm">
                              {chunk.essay_date}
                            </div>
                          </div>
                          <a
                            className="hover:opacity-50 ml-2"
                            href={chunk.essay_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <IconExternalLink />
                          </a>
                        </div>
                        <div
                          className="mt-2"
                          dangerouslySetInnerHTML={{ __html: chunk.content }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : chunks.length > 0 ? (
              <div className="w-full mt-6 pb-16">
                <div className="font-bold text-2xl">Passages</div>
                {chunks.map((chunk, index) => (
                  <div key={index}>
                    <div className="mt-4 border border-zinc-600 rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-bold text-xl">
                            {chunk.essay_title}
                          </div>
                          <div className="mt-1 font-bold text-sm">
                            {chunk.essay_date}
                          </div>
                        </div>
                        <a
                          className="hover:opacity-50 ml-2"
                          href={chunk.essay_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <IconExternalLink />
                        </a>
                      </div>
                      <div className="mt-2">{chunk.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null
              // <div className="mt-6 text-center text-lg">{`AI-powered search & chat for Allen's essays.`}</div>
            }
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
