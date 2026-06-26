alter table public.bookings
  add column if not exists profile_id uuid,
  add column if not exists category text not null default 'Uncategorized',
  add column if not exists price numeric(10, 2),
  add column if not exists booking_type text not null default 'Laboratory Visit',
  add column if not exists preferred_time_slot text not null default 'Not specified',
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_profile_id_fkey'
      and conrelid = 'public.bookings'::regclass
  ) then
    alter table public.bookings
      add constraint bookings_profile_id_fkey
      foreign key (profile_id)
      references public.profiles(id)
      on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_price_nonnegative'
      and conrelid = 'public.bookings'::regclass
  ) then
    alter table public.bookings
      add constraint bookings_price_nonnegative
      check (price is null or price >= 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_booking_type_check'
      and conrelid = 'public.bookings'::regclass
  ) then
    alter table public.bookings
      add constraint bookings_booking_type_check
      check (
        booking_type in (
          'Home Sample Collection',
          'Laboratory Visit',
          'Request Callback'
        )
      );
  end if;
end $$;

create index if not exists bookings_profile_id_idx
  on public.bookings (profile_id);

create index if not exists bookings_email_idx
  on public.bookings (email);

create index if not exists bookings_created_at_idx
  on public.bookings (created_at desc);

create or replace function public.set_bookings_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_bookings_updated_at on public.bookings;

create trigger set_bookings_updated_at
before update on public.bookings
for each row
execute function public.set_bookings_updated_at();

alter table public.bookings enable row level security;
