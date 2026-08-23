-- ============================================
-- profiles table setup for email/password auth
-- Run once in: Supabase Dashboard -> SQL Editor -> New query
-- Safe to re-run (idempotent).
-- ============================================

-- 1) Table
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text,
    avatar_url text,
    website text,
    role text not null default 'student'
        check (role in ('student', 'teacher', 'admin')),
    updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 2) Helper: is the current user an admin? (security definer avoids RLS recursion)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1 from public.profiles
        where id = (select auth.uid()) and role = 'admin'
    );
$$;

revoke execute on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

-- 3) RLS policies
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
    on public.profiles for select
    to authenticated
    using ((select auth.uid()) = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
    on public.profiles for insert
    to authenticated
    with check ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
    on public.profiles for update
    to authenticated
    using ((select auth.uid()) = id)
    with check ((select auth.uid()) = id);

drop policy if exists "profiles_select_all_admin" on public.profiles;
create policy "profiles_select_all_admin"
    on public.profiles for select
    to authenticated
    using (public.is_admin());

drop policy if exists "profiles_update_all_admin" on public.profiles;
create policy "profiles_update_all_admin"
    on public.profiles for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- 4) updated_at maintenance
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
    before update on public.profiles
    for each row
    execute function public.update_updated_at_column();

-- 5) Auto-create a profile whenever a new auth user appears
--    (reads username/role from signup metadata)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id, username, role)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
        coalesce(new.raw_user_meta_data ->> 'role', 'student')
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();

-- 6) Seed profiles for the already-created test accounts
--    (their auth users predate the trigger above)
insert into public.profiles (id, username, role)
values
    ('6571160c-7b08-4961-a0fa-04a31edc7ace', 'Test Teacher', 'teacher'),
    ('73e1f98d-3de3-4ee0-9526-8c4675ae3de2', 'Test Student', 'student')
on conflict (id) do update
    set username = excluded.username,
        role = excluded.role;
