import { auth } from "@/lib/auth";
import handlePermission from "@/lib/server/permission/handle-permission";
import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { user as users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidateCache } from "@/lib/server/cache";

/**
 * 사용자의 프로필 이미지 URL 을 업데이트 하는 API
 * @param request
 * @param params
 * @constructor
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ memberId: string }> },
) {
  const session = await auth();
  // 사용자 권한 확인
  if (!(await handlePermission(session?.user?.id, "put", "members"))) {
    return NextResponse.error();
  }
  // Body 에서 프로필 이미지 URL 추출
  const body = (await request.json()) as { profileImage: string };

  try {
    const db = await getDB();
    // 사용자 프로필 이미지 URL 업데이트 쿼리
    await db
      .update(users)
      .set({ image: body.profileImage })
      .where(eq(users.id, (await params).memberId));

    // 캐시 업데이트
    revalidateCache("members");
    return NextResponse.json({ success: true });
  } catch (e) {
    // 오류 처리
    console.error(e);
    return NextResponse.json({ success: false });
  }
}
