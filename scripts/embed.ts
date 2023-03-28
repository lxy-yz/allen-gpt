import { Essay, EssayJSON } from "@/types";
import { loadEnvConfig } from "@next/env";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import fs from "fs";
import { Configuration, OpenAIApi } from "openai";

loadEnvConfig("");

const generateEmbeddings = async (essays: Essay[]) => {
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  for (let i = 0; i < essays.length; i++) {
    const section = essays[i];

    for (let j = 0; j < section.chunks.length; j++) {
      const chunk = section.chunks[j];

      const { essay_title, essay_url, essay_date, essay_thanks, content, content_length, content_tokens } = chunk;

      const embeddingResponse = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: content
      });

      const [{ embedding }] = embeddingResponse.data.data;

      // clear all data
      // await deleteAll(supabase);

      const { data, error } = await supabase
        .from("allen")
        .insert({
          essay_title,
          essay_url,
          essay_date,
          essay_thanks,
          content,
          content_length,
          content_tokens,
          embedding
        })
        .select("*");

      if (error) {
        console.log("error", error);
      } else {
        console.log("saved", i, j);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
};

async function deleteAll(supabase: SupabaseClient) {
  const { error } = await supabase
    .from("allen")
    .delete()
    .neq('id', 0);
  if (error) {
    console.log("error", error);
  } else {
    console.log("deleted");
  }
}

(async () => {
  const book: EssayJSON = JSON.parse(fs.readFileSync("scripts/blog.json", "utf8"));

  await generateEmbeddings(book.essays);
  
  console.log("✅ Done!");
})();
