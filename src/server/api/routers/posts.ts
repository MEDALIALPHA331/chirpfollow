import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, publicProcedure } from "../trpc";

function filterUserInfos(user: User) {
  return {
    id: user.id,
    username: user.username,
    emailAddresses: user.emailAddresses,
    profileImageUrl: user.profileImageUrl,
  };
}

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filterUserInfos);

    console.info(users);

    return posts.map((post) => {
      return {
        post,
        auther: users.find((user) => user.id === post.authorId),
      };
    });
  }),
});
