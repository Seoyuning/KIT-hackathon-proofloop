-- Chat sessions: groups chat messages into separate conversations
create table if not exists chat_sessions (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references classes(id) on delete cascade not null,
  student_id uuid references profiles(id) not null,
  title text default '새 대화',
  created_at timestamptz default now()
);

alter table chat_sessions enable row level security;

create policy "Students read own sessions" on chat_sessions
  for select using (auth.uid() = student_id);

create policy "Students insert own sessions" on chat_sessions
  for insert with check (auth.uid() = student_id);

-- Teachers can read sessions from their classes
create policy "Teachers read class sessions" on chat_sessions
  for select using (
    exists (
      select 1 from classes
      where classes.id = chat_sessions.class_id
      and classes.teacher_id = auth.uid()
    )
  );

-- Add session_id to chat_messages
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS session_id uuid references chat_sessions(id) on delete cascade;
