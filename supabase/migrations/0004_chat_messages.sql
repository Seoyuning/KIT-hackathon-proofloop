-- Chat message history for students
create table if not exists chat_messages (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references classes(id) on delete cascade not null,
  student_id uuid references profiles(id) not null,
  role text not null check (role in ('user', 'assistant')),
  message_text text not null,
  evidence text,
  follow_up text,
  understanding int,
  created_at timestamptz default now()
);

alter table chat_messages enable row level security;

-- Students can read their own messages
create policy "Students read own messages" on chat_messages
  for select using (auth.uid() = student_id);

-- Students can insert their own messages
create policy "Students insert own messages" on chat_messages
  for insert with check (auth.uid() = student_id);

-- Teachers can read messages from their classes
create policy "Teachers read class messages" on chat_messages
  for select using (
    exists (
      select 1 from classes
      where classes.id = chat_messages.class_id
      and classes.teacher_id = auth.uid()
    )
  );
