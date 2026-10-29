-- The live pack check only allowed 'anthropic-marketing' and 'smart', so the new default
-- 'gtp-workshop-skills' broke every insert (23514). Allow it.
alter table public.skills_requests drop constraint if exists skills_requests_pack_check;
alter table public.skills_requests add constraint skills_requests_pack_check
  check (pack in ('anthropic-marketing', 'smart', 'gtp-workshop-skills'));

-- Optional session feedback from the skills form (owner 2026-10-29). All three answers are optional.
alter table public.skills_requests add column if not exists feedback_takeaway text;
alter table public.skills_requests add column if not exists feedback_change text;
alter table public.skills_requests add column if not exists feedback_value text;
do $$ begin
  alter table public.skills_requests add constraint skills_requests_feedback_len_chk check (
    coalesce(char_length(feedback_takeaway), 0) <= 600 and coalesce(char_length(feedback_change), 0) <= 600);
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.skills_requests add constraint skills_requests_feedback_value_chk check (
    feedback_value is null or feedback_value in ('yes-both', 'yes-business', 'yes-me', 'some', 'no'));
exception when duplicate_object then null; end $$;
