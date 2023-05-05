import { User } from "@clerk/nextjs/dist/api";

export function filterUserInfos(user: User) {
  return {
    id: user.id,
    username: user.username,
    emailAddresses: user.emailAddresses,
    profileImageUrl: user.profileImageUrl,
  };
}
