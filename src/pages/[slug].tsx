import type { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";

const ProfilePage: NextPage = () => {
  const { data: userProfile, isLoading: LoadingProfile } =
    api.profiles.getUserByUsername.useQuery({
      username: "medalialpha331",
    });

  return (
    <>
      <Head>
        <title>Profile {}</title>
        <meta name="description" content="chirp clone profiles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center">
        Profile view
        <div>{userProfile?.username}</div>
      </main>
    </>
  );
};

export default ProfilePage;

/**
 * @see https://trpc.io/docs/nextjs/ssg
 */

import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });
  const slug = context.params?.slug as string;

  const username = slug.replace("@", "");

  // prefetch `post.byId`
  helpers.profiles.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
    },
    revalidate: 1,
  };
}
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
    fallback: "blocking",
  };
};
