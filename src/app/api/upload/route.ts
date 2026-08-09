import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { env } from "~/env";
import { isAdminEmail } from "~/server/admin";
import { auth } from "~/server/auth";

/** Matches the FileUpload component's client-side limit. */
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

/**
 * Admin-only image upload — stores the file in the public Supabase Storage
 * bucket and returns its public URL.
 */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!isAdminEmail(session?.user.email)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  if (
    !env.SUPABASE_URL ||
    !env.SUPABASE_SERVICE_ROLE_KEY ||
    !env.SUPABASE_BUCKET
  ) {
    return NextResponse.json(
      { error: "File storage is not configured (SUPABASE_* env vars)." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, GIF and AVIF images are allowed." },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Images must be 8 MB or smaller." },
      { status: 400 },
    );
  }

  const supabase = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const extension = /\.[a-z0-9]+$/i.exec(file.name)?.[0]?.toLowerCase() ?? "";
  const path = `uploads/${crypto.randomUUID()}${extension}`;

  const { error } = await supabase.storage
    .from(env.SUPABASE_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) {
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500 },
    );
  }

  const { data } = supabase.storage
    .from(env.SUPABASE_BUCKET)
    .getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
