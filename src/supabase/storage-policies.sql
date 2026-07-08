-- Run this in the Supabase SQL Editor

-- Allow authenticated users to upload files into the book-covers bucket
create policy "Allow authenticated uploads to book-covers"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'book-covers');

-- Allow public reads from the book-covers bucket
create policy "Allow public reads from book-covers"
on storage.objects
for select
using (bucket_id = 'book-covers');

-- Optional: allow authenticated users to update or delete their own uploads
create policy "Allow authenticated updates to book-covers"
on storage.objects
for update
to authenticated
using (bucket_id = 'book-covers');

create policy "Allow authenticated deletes from book-covers"
on storage.objects
for delete
to authenticated
using (bucket_id = 'book-covers');
