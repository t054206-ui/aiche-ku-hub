-- Public bucket for gallery photos (anyone can view; uploads via dashboard or signed-in users)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery', 'gallery', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
drop policy if exists "public read gallery" on storage.objects;
create policy "public read gallery" on storage.objects for select to anon, authenticated using (bucket_id = 'gallery');
drop policy if exists "authenticated upload gallery" on storage.objects;
create policy "authenticated upload gallery" on storage.objects for insert to authenticated with check (bucket_id = 'gallery');

-- Photo dimensions so the gallery can reserve space before images load
alter table gallery_items add column if not exists width int;
alter table gallery_items add column if not exists height int;

-- Anonymous planner saves go through a security-definer function (no public SELECT needed)
create or replace function public.save_planner(
  p_client_id uuid, p_plan_id text, p_completed text[], p_in_progress text[], p_pinned text[], p_prefs jsonb
) returns void
language sql security definer set search_path = public as $$
  insert into planner_saves (client_id, plan_id, completed, in_progress, pinned, prefs, updated_at)
  values (p_client_id, p_plan_id, coalesce(p_completed,'{}'), coalesce(p_in_progress,'{}'), coalesce(p_pinned,'{}'), coalesce(p_prefs,'{}'::jsonb), now())
  on conflict (client_id) do update set
    plan_id = excluded.plan_id, completed = excluded.completed, in_progress = excluded.in_progress,
    pinned = excluded.pinned, prefs = excluded.prefs, updated_at = now();
$$;
revoke all on function public.save_planner(uuid,text,text[],text[],text[],jsonb) from public;
grant execute on function public.save_planner(uuid,text,text[],text[],text[],jsonb) to anon, authenticated;
