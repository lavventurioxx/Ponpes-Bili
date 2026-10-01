-- Bucket `pendaftaran` harus dibuat private.
-- Pendaftar anonim hanya dapat mengunggah berkas ke folder registrasinya.
create policy "Allow anonymous registration document uploads"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'pendaftaran'
  and name ~ '^[0-9a-f-]{36}/(kartu-keluarga|akta-kelahiran|bukti-transfer)-.*'
  and (metadata->>'mimetype') like 'image/%'
  and case
    when metadata->>'size' ~ '^[0-9]+$'
    then (metadata->>'size')::bigint <= 1048576
    else false
  end
);

-- Policy ini diperlukan agar admin dapat membuat signed URL.
create policy "Allow registration document signed links"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'pendaftaran'
  and name like '%/%'
);
