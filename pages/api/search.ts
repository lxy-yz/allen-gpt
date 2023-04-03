import { supabaseAdmin } from "@/utils";
import { POSTGRES_FUNCTION_NAME } from "@/utils/constants";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { query, apiKey, matches } = (await req.json()) as {
      query: string;
      apiKey: string;
      matches: number;
    };

    const input = query.replace(/\n/g, " ");

    const res = await fetch("https://api.openai.com/v1/embeddings", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: "text-embedding-ada-002",
        input,
      }),
    });

    const json = await res.json();
    console.log("json", json);
    const embedding = json.data[0].embedding;

    const { data: chunks, error } = await supabaseAdmin.rpc(
      POSTGRES_FUNCTION_NAME,
      {
        query_embedding: embedding,
        similarity_threshold: 0.01,
        match_count: matches,
      }
    );

    if (error) {
      console.error(error);
      return new Response("Error", { status: 500 });
    }

    return new Response(JSON.stringify(chunks), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
