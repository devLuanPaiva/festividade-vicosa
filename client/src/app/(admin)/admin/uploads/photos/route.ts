import { NextResponse, type NextRequest } from 'next/server';
import { albumUploadPath } from '@/features/admin-gallery/lib/album-target';
import { parseAlbumTarget } from '@/features/admin-gallery/lib/album-query';
import {
  expiredSessionFailure,
  invalidAlbumFailure,
  toUploadFailure,
  type UploadFailure,
} from '@/features/admin-gallery/lib/upload-failure';
import { sendApiCommand } from '@/lib/api/server-fetch';
import { readSessionToken } from '@/lib/auth/session-cookie';
import { copyFileField } from '@/lib/forms/form-data';
import { INITIAL_FORM_ERROR_STATE } from '@/lib/forms/form-errors';

const PHOTO_FIELD = 'file';

function respond({ status, body }: UploadFailure): NextResponse {
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const target = parseAlbumTarget(request.nextUrl.searchParams);
  if (!target) {
    return respond(invalidAlbumFailure());
  }
  const token = await readSessionToken();
  if (!token) {
    return respond(expiredSessionFailure());
  }
  try {
    const body = copyFileField(await request.formData(), PHOTO_FIELD);
    await sendApiCommand(albumUploadPath(target), { method: 'POST', body, token });
    return NextResponse.json(INITIAL_FORM_ERROR_STATE);
  } catch (error) {
    return respond(toUploadFailure(error));
  }
}
