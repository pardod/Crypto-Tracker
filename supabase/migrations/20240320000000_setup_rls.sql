-- Enable RLS on transactions table
alter table transactions enable row level security;

-- Create policy for selecting transactions
create policy "Users can view their own transactions"
on transactions for select
using (auth.uid() = user_id);

-- Create policy for inserting transactions
create policy "Users can insert their own transactions"
on transactions for insert
with check (auth.uid() = user_id);

-- Create policy for updating transactions
create policy "Users can update their own transactions"
on transactions for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Create policy for deleting transactions
create policy "Users can delete their own transactions"
on transactions for delete
using (auth.uid() = user_id);