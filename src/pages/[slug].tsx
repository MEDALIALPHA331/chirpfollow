import { GetStaticPropsContext, type NextPage } from "next";
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
    transformer: superjson,
  });

  const slug = context.params?.slug;

  if (typeof slug != "string") throw new Error("No Slug");

  //fetch data from trpc and hydrate it via getStaticProps
  await helpers.profiles.getUserByUsername.prefetch({ username: slug });

  return {
    props: {
      rpcState: helpers.dehydrate(),
    },
  };
}

export default ProfilePage;
