-- ============================================================================
-- HFUT-CS-Online · Supabase 用户数据 schema
-- 在 Supabase Dashboard → SQL Editor 中整份执行（可重复执行，幂等）。
--
-- 数据模型
--   profiles        用户资料（注册时自动创建，display_name 默认取邮箱前缀）
--   user_progress   每题作答（course + question_id 唯一；result 为 null 表示清空墓碑）
--   user_favorites  课程收藏（按课程一行，favorited=false 为取消收藏墓碑）
--   user_recent     最近查看（按课程一行，取最大 viewed_at）
--   user_reading    阅读进度（按页面一行，记录滚动位置与百分比）
--   user_qmarks     题目收藏本/错题本（course + question_id + kind 唯一；marked=false 为移出墓碑）
--   site_visits     首页访问计数（按访客 + 会话 + 日期去重，匿名可上报、不可直接读写）
--
-- 安全
--   * 所有表启用 RLS，只允许 auth.uid() = user_id 的读写；
--   * 前端只使用 Publishable Key，Service Role Key 不要出现在任何前端环境变量里；
--   * sync_push 为 security invoker，函数内仍受 RLS 约束；
--   * site_visits 只通过 security definer 的 record_site_visit 写入与读取。}

-- ============================================================================

-- ---------------------------------------------------------------- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 注册时自动建资料（邮箱前缀作为默认昵称）
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(coalesce(new.email, ''), '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------------------------------------------- progress
create table if not exists public.user_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  course text not null,
  question_id text not null,
  result text,
  updated_at timestamptz not null default now(),
  device_id text,
  primary key (user_id, course, question_id)
);

create index if not exists user_progress_user_idx on public.user_progress (user_id);

alter table public.user_progress enable row level security;

drop policy if exists "progress select own" on public.user_progress;
create policy "progress select own"
  on public.user_progress for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "progress insert own" on public.user_progress;
create policy "progress insert own"
  on public.user_progress for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "progress update own" on public.user_progress;
create policy "progress update own"
  on public.user_progress for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "progress delete own" on public.user_progress;
create policy "progress delete own"
  on public.user_progress for delete to authenticated
  using (auth.uid() = user_id);

-- -------------------------------------------------------------- favorites
create table if not exists public.user_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  course text not null,
  favorited boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_id, course)
);

create index if not exists user_favorites_user_idx on public.user_favorites (user_id);

alter table public.user_favorites enable row level security;

drop policy if exists "favorites select own" on public.user_favorites;
create policy "favorites select own"
  on public.user_favorites for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "favorites insert own" on public.user_favorites;
create policy "favorites insert own"
  on public.user_favorites for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "favorites update own" on public.user_favorites;
create policy "favorites update own"
  on public.user_favorites for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "favorites delete own" on public.user_favorites;
create policy "favorites delete own"
  on public.user_favorites for delete to authenticated
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------- recent
create table if not exists public.user_recent (
  user_id uuid not null references auth.users (id) on delete cascade,
  course text not null,
  viewed_at timestamptz not null default now(),
  primary key (user_id, course)
);

create index if not exists user_recent_user_idx on public.user_recent (user_id);

alter table public.user_recent enable row level security;

drop policy if exists "recent select own" on public.user_recent;
create policy "recent select own"
  on public.user_recent for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "recent insert own" on public.user_recent;
create policy "recent insert own"
  on public.user_recent for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "recent update own" on public.user_recent;
create policy "recent update own"
  on public.user_recent for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "recent delete own" on public.user_recent;
create policy "recent delete own"
  on public.user_recent for delete to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------- reading
create table if not exists public.user_reading (
  user_id uuid not null references auth.users (id) on delete cascade,
  course text not null,
  page text not null,
  scroll_y integer not null default 0,
  percent real not null default 0,
  section text,
  updated_at timestamptz not null default now(),
  device_id text,
  primary key (user_id, course, page)
);

create index if not exists user_reading_user_idx on public.user_reading (user_id);

alter table public.user_reading enable row level security;

drop policy if exists "reading select own" on public.user_reading;
create policy "reading select own"
  on public.user_reading for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "reading insert own" on public.user_reading;
create policy "reading insert own"
  on public.user_reading for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "reading update own" on public.user_reading;
create policy "reading update own"
  on public.user_reading for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "reading delete own" on public.user_reading;
create policy "reading delete own"
  on public.user_reading for delete to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------- qmarks
-- 每门课两本账：收藏本（kind='fav'）与错题本（kind='wrong'），一行一道题；
-- qid 与该课作答进度的 question_id 同一空间（net/phys 为 `${paperId}:${qid}`）。
create table if not exists public.user_qmarks (
  user_id uuid not null references auth.users (id) on delete cascade,
  course text not null,
  question_id text not null,
  kind text not null,
  marked boolean not null default true,
  updated_at timestamptz not null default now(),
  device_id text,
  primary key (user_id, course, question_id, kind)
);

create index if not exists user_qmarks_user_idx on public.user_qmarks (user_id);

alter table public.user_qmarks enable row level security;

drop policy if exists "qmarks select own" on public.user_qmarks;
create policy "qmarks select own"
  on public.user_qmarks for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "qmarks insert own" on public.user_qmarks;
create policy "qmarks insert own"
  on public.user_qmarks for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "qmarks update own" on public.user_qmarks;
create policy "qmarks update own"
  on public.user_qmarks for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "qmarks delete own" on public.user_qmarks;
create policy "qmarks delete own"
  on public.user_qmarks for delete to authenticated
  using (auth.uid() = user_id);

-- -------------------------------------------------------------- 访问统计
-- 每行 = 一个访客的一次会话（同一天内同一会话只记一次），用于首页「累计/今日访问量」。
-- 匿名访客不能直接读写本表，只能调用 record_site_visit() 上报并取回计数。
create table if not exists public.site_visits (
  visitor text not null,
  session text not null,
  visited_day date not null default ((now() at time zone 'Asia/Shanghai')::date),
  visited_at timestamptz not null default now(),
  primary key (visitor, session, visited_day)
);

create index if not exists site_visits_day_idx on public.site_visits (visited_day);

alter table public.site_visits enable row level security;

-- 只允许 security definer 函数访问；service_role 仍可在 Dashboard/后台查询。
revoke all on public.site_visits from public, anon, authenticated;

-- 上报一次访问并返回累计/今日计数。非法标识不写入，只返回当前计数。
create or replace function public.record_site_visit(
  p_visitor text default null,
  p_session text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_day date := (now() at time zone 'Asia/Shanghai')::date;
  v_total bigint;
  v_today bigint;
begin
  if p_visitor ~ '^[A-Za-z0-9_-]{8,64}$' and p_session ~ '^[A-Za-z0-9_-]{8,64}$' then
    insert into public.site_visits (visitor, session, visited_day)
    values (p_visitor, p_session, v_day)
    on conflict (visitor, session, visited_day) do nothing;
  end if;

  select count(*) into v_total from public.site_visits;
  select count(*) into v_today from public.site_visits where visited_day = v_day;

  return jsonb_build_object('total', v_total, 'today', v_today);
end;
$$;

-- --------------------------------------------------------------- 批量同步
-- 一次请求上传全部脏数据。冲突规则：updated_at 更新者胜；同一毫秒时保留云端。
-- 函数以调用者身份执行（security invoker），越权写会被 RLS 拒绝。
create or replace function public.sync_push(
  p_progress jsonb default '[]'::jsonb,
  p_favorites jsonb default '[]'::jsonb,
  p_recent jsonb default '[]'::jsonb
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  insert into public.user_progress (user_id, course, question_id, result, updated_at, device_id)
  select
    v_uid,
    x.course,
    x.question_id,
    x.result,
    coalesce(x.updated_at, now()),
    x.device_id
  from jsonb_to_recordset(coalesce(p_progress, '[]'::jsonb)) as x(
    course text,
    question_id text,
    result text,
    updated_at timestamptz,
    device_id text
  )
  where x.course is not null and x.question_id is not null
  on conflict (user_id, course, question_id) do update
    set result = excluded.result,
        updated_at = excluded.updated_at,
        device_id = excluded.device_id
    where excluded.updated_at > user_progress.updated_at;

  insert into public.user_favorites (user_id, course, favorited, updated_at)
  select
    v_uid,
    x.course,
    x.favorited,
    coalesce(x.updated_at, now())
  from jsonb_to_recordset(coalesce(p_favorites, '[]'::jsonb)) as x(
    course text,
    favorited boolean,
    updated_at timestamptz
  )
  where x.course is not null and x.favorited is not null
  on conflict (user_id, course) do update
    set favorited = excluded.favorited,
        updated_at = excluded.updated_at
    where excluded.updated_at > user_favorites.updated_at;

  insert into public.user_recent (user_id, course, viewed_at)
  select
    v_uid,
    x.course,
    coalesce(x.viewed_at, now())
  from jsonb_to_recordset(coalesce(p_recent, '[]'::jsonb)) as x(
    course text,
    viewed_at timestamptz
  )
  where x.course is not null
  on conflict (user_id, course) do update
    set viewed_at = greatest(user_recent.viewed_at, excluded.viewed_at);
end;
$$;

-- --------------------------------------------------- 阅读进度批量上传
-- 单独一个函数：老库没执行这段时前端会静默跳过，其它数据同步不受影响。
create or replace function public.sync_push_reading(
  p_reading jsonb default '[]'::jsonb
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  insert into public.user_reading (user_id, course, page, scroll_y, percent, section, updated_at, device_id)
  select
    v_uid,
    x.course,
    x.page,
    coalesce(x.scroll_y, 0),
    coalesce(x.percent, 0),
    x.section,
    coalesce(x.updated_at, now()),
    x.device_id
  from jsonb_to_recordset(coalesce(p_reading, '[]'::jsonb)) as x(
    course text,
    page text,
    scroll_y integer,
    percent real,
    section text,
    updated_at timestamptz,
    device_id text
  )
  where x.course is not null and x.page is not null
  on conflict (user_id, course, page) do update
    set scroll_y = excluded.scroll_y,
        percent = excluded.percent,
        section = excluded.section,
        updated_at = excluded.updated_at,
        device_id = excluded.device_id
    where excluded.updated_at > user_reading.updated_at;
end;
$$;

-- ------------------------------------------------- 题目两本账批量上传
-- 与 sync_push_reading 同款：老库没执行这段时前端会静默跳过，其它数据同步不受影响。
create or replace function public.sync_push_qmarks(
  p_qmarks jsonb default '[]'::jsonb
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  insert into public.user_qmarks (user_id, course, question_id, kind, marked, updated_at, device_id)
  select
    v_uid,
    x.course,
    x.question_id,
    x.kind,
    coalesce(x.marked, true),
    coalesce(x.updated_at, now()),
    x.device_id
  from jsonb_to_recordset(coalesce(p_qmarks, '[]'::jsonb)) as x(
    course text,
    question_id text,
    kind text,
    marked boolean,
    updated_at timestamptz,
    device_id text
  )
  where x.course is not null and x.question_id is not null
    and x.kind in ('fav', 'wrong')
  on conflict (user_id, course, question_id, kind) do update
    set marked = excluded.marked,
        updated_at = excluded.updated_at,
        device_id = excluded.device_id
    where excluded.updated_at > user_qmarks.updated_at;
end;
$$;

-- ----------------------------------------------------------------- grants
-- 只授予登录用户；匿名访客不接触任何用户表。
grant select, insert, update, delete on public.user_progress to authenticated;
grant select, insert, update, delete on public.user_favorites to authenticated;
grant select, insert, update, delete on public.user_recent to authenticated;
grant select, insert, update, delete on public.user_reading to authenticated;
grant select, insert, update, delete on public.user_qmarks to authenticated;
grant select, insert, update on public.profiles to authenticated;

revoke all on public.user_progress from anon;
revoke all on public.user_favorites from anon;
revoke all on public.user_recent from anon;
revoke all on public.user_reading from anon;
revoke all on public.user_qmarks from anon;
revoke all on public.profiles from anon;

revoke all on function public.sync_push(jsonb, jsonb, jsonb) from public;
revoke all on function public.sync_push(jsonb, jsonb, jsonb) from anon;
grant execute on function public.sync_push(jsonb, jsonb, jsonb) to authenticated;

revoke all on function public.sync_push_reading(jsonb) from public;
revoke all on function public.sync_push_reading(jsonb) from anon;
grant execute on function public.sync_push_reading(jsonb) to authenticated;

revoke all on function public.sync_push_qmarks(jsonb) from public;
revoke all on function public.sync_push_qmarks(jsonb) from anon;
grant execute on function public.sync_push_qmarks(jsonb) to authenticated;

-- 访问统计：游客也要能上报，所以匿名角色可执行；表本身仍不开放直接访问。
revoke all on function public.record_site_visit(text, text) from public;
grant execute on function public.record_site_visit(text, text) to anon, authenticated;

-- 可选：实时订阅（跨设备即时刷新，当前前端按「回到前台拉取」处理，无需开启）
-- alter publication supabase_realtime add table public.user_progress;
