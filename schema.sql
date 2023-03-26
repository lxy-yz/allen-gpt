--  RUN 1st
create extension vector;

-- RUN 2nd
create table allen (
  id bigserial primary key,
  essay_title text,
  essay_url text,
  essay_date text,
  essay_thanks text,
  content text,
  content_length bigint,
  content_tokens bigint,
  embedding vector (1536)
);

-- RUN 3rd after running the scripts
create or replace function allen_search (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int
)
returns table (
  id bigint,
  essay_title text,
  essay_url text,
  essay_date text,
  essay_thanks text,
  content text,
  content_length bigint,
  content_tokens bigint,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    allen.id,
    allen.essay_title,
    allen.essay_url,
    allen.essay_date,
    allen.essay_thanks,
    allen.content,
    allen.content_length,
    allen.content_tokens,
    1 - (allen.embedding <=> query_embedding) as similarity
  from allen
  where 1 - (allen.embedding <=> query_embedding) > similarity_threshold
  order by allen.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- RUN 4th
create index on allen 
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);