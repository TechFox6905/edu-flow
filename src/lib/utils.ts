import { auth } from "@clerk/nextjs/server";

const { userId, sessionClaims } = await auth();
export const role = (sessionClaims?.metadata as { role?: string })?.role;
if (!userId) {
  throw new Error("User not authenticated");
}
export const currentUserId = userId;