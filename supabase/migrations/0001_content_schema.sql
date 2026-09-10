-- AIChE KU hub — content schema
-- Every table the website reads. Public (anon) role can SELECT content and INSERT
-- analytics/planner rows; editing content happens in the Supabase dashboard
-- (or a future admin UI using an authenticated role).

create table if not exists site_config (
  id smallint primary key default 1 check (id = 1),
  society_name text not null,
  chapter_name text not null,
  short_name text not null,
  arabic_name text,
  university text,
  department text,
  academic_year text,
  tagline text,
  description text,
  footer_line text,
  email text,
  phone_display text,
  whatsapp_url text,
  instagram_handle text,
  instagram_url text,
  linkedin_url text,
  join_url text,
  event_registration_url text,
  whatsapp_community_url text,
  website_url text,
  feedback_url text,
  membership_info_url text,
  updated_at timestamptz not null default now()
);

create table if not exists nav_items (
  id text primary key,
  label text not null,
  href text not null,
  sort_order int not null default 0,
  visible boolean not null default true
);

create table if not exists socials (
  id text primary key,
  label text not null,
  handle text,
  url text,
  icon text not null,
  hint text,
  sort_order int not null default 0,
  visible boolean not null default true
);

create table if not exists link_groups (
  id text primary key,
  title text not null,
  sort_order int not null default 0,
  visible boolean not null default true
);

create table if not exists links (
  id text primary key,
  group_id text not null references link_groups(id) on delete cascade,
  title text not null,
  subtitle text,
  url text,
  icon text not null default 'Link',
  featured boolean not null default false,
  sort_order int not null default 0,
  visible boolean not null default true
);

create table if not exists events (
  id text primary key,
  title text not null,
  date date not null,
  start_time time,
  end_time time,
  location text,
  description text,
  registration_url text,
  status text not null default 'open' check (status in ('open','soon','closed','full','none')),
  pinned boolean not null default false,
  tags text[] not null default '{}',
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists announcements (
  id text primary key,
  category text not null check (category in ('NEW','REMINDER','UPDATE')),
  date date not null,
  text text not null,
  url text,
  link_label text,
  is_new boolean not null default false,
  visible boolean not null default true
);

-- Copy for whole sections (about, our_year, gallery, link_hub, tools ...)
create table if not exists sections (
  id text primary key,
  eyebrow text,
  title text,
  description text,
  note text,
  extra jsonb not null default '{}'::jsonb
);

create table if not exists about_highlights (
  id text primary key,
  icon text not null,
  label text not null,
  text text,
  sort_order int not null default 0
);

create table if not exists resource_categories (
  id text primary key,
  title text not null,
  icon text not null default 'BookOpen',
  blurb text,
  sort_order int not null default 0,
  visible boolean not null default true
);

create table if not exists resources (
  id text primary key,
  category_id text not null references resource_categories(id) on delete cascade,
  title text not null,
  description text,
  url text,
  tags text[] not null default '{}',
  sort_order int not null default 0,
  visible boolean not null default true
);

create table if not exists team_members (
  id text primary key,
  role text not null,
  name text not null,
  photo_url text,
  instagram text,
  linkedin text,
  email text,
  sort_order int not null default 0,
  visible boolean not null default true
);

create table if not exists year_stats (
  id text primary key,
  label text not null,
  value int,
  icon text not null,
  text text,
  sort_order int not null default 0
);

create table if not exists gallery_items (
  id text primary key,
  src text,
  alt text,
  title text,
  date_label text,
  sort_order int not null default 0,
  visible boolean not null default true
);

-- Academic data ----------------------------------------------------------
create table if not exists course_categories (
  id text primary key,
  label text not null,
  short text not null,
  sort_order int not null default 0
);

create table if not exists courses (
  code text primary key,
  name text not null,
  short text,
  credits int,
  category text not null references course_categories(id),
  prerequisites jsonb not null default '[]'::jsonb,
  corequisites jsonb not null default '[]'::jsonb,
  notes text,
  unlisted boolean not null default false
);

create table if not exists academic_plans (
  id text primary key,
  major_id text not null,
  major text not null,
  label text not null,
  years text not null,
  is_current boolean not null default false,
  applies_to text,
  sheet_title text,
  sheet_pdf text,
  sheet_pages int,
  sheet_publisher text,
  semesters jsonb,
  requirements jsonb not null default '[]'::jsonb,
  dept_electives text[] not null default '{}',
  gen_ed_elective_departments jsonb,
  overrides jsonb not null default '{}'::jsonb,
  notes text[] not null default '{}',
  sort_order int not null default 0,
  visible boolean not null default true
);

create table if not exists assistant_settings (
  id smallint primary key default 1 check (id = 1),
  name text not null,
  tagline text,
  intro text,
  disclaimer text,
  unknown_answer text,
  course_count_options int[] not null default '{3,4,5,6}',
  time_options jsonb not null default '[]'::jsonb,
  hour_options text[] not null default '{}',
  days text[] not null default '{}'
);

-- Student-generated data --------------------------------------------------
create table if not exists planner_saves (
  client_id uuid primary key,
  plan_id text,
  completed text[] not null default '{}',
  in_progress text[] not null default '{}',
  pinned text[] not null default '{}',
  prefs jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists analytics_events (
  id bigint generated always as identity primary key,
  event text not null,
  props jsonb not null default '{}'::jsonb,
  path text,
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_event_idx on analytics_events (event, created_at desc);

-- Row Level Security -------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['site_config','nav_items','socials','link_groups','links','events','announcements','sections','about_highlights','resource_categories','resources','team_members','year_stats','gallery_items','course_categories','courses','academic_plans','assistant_settings']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "public read %s" on %I', t, t);
    execute format('create policy "public read %s" on %I for select to anon, authenticated using (true)', t, t);
  end loop;
end $$;

alter table planner_saves enable row level security;
create policy "anyone can save a plan" on planner_saves for insert to anon, authenticated with check (true);
create policy "anyone can update their plan" on planner_saves for update to anon, authenticated using (true) with check (true);
-- No public select: saved plans are only readable from the dashboard / service role.

alter table analytics_events enable row level security;
create policy "anyone can log an event" on analytics_events for insert to anon, authenticated with check (true);
