-- Enable RLS on skills table
alter table public.skills enable row level security;

-- Revoke default grants
revoke all on table public.skills from anon, authenticated;

-- Grant necessary permissions for anon role
grant select, insert, update, delete on table public.skills to anon;

-- Create policies for each operation
create policy "Allow select for all" on public.skills
  for select
  to anon, authenticated
  using (true);

create policy "Allow insert for all" on public.skills
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow update for all" on public.skills
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Allow delete for all" on public.skills
  for delete
  to anon, authenticated
  using (true);
