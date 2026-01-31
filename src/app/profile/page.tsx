import { getSession } from "@/lib/auth/server";
import SignOutButton from "@/app/profile/sign-out-button";

export default async function ProfilePage() {
  const session = await getSession();
  console.log(session);

  if (!session) {
    return (
      <div>
        <div>403 Access Denied</div>
      </div>
    );
  }

  return (
    <div className={"w-screen h-screen flex p-8 gap-2"}>
      <div>{session.user.name}</div>
      <div>{session.user.email}</div>
      <SignOutButton />
    </div>
  );
}
