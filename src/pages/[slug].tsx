import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Image from "next/image";
import { api } from "~/utils/api";

const ProfileFeed = (props: { userId: string }) => {
  const { data: profileData, isLoading } = api.posts.getPostsByUserId.useQuery({
    userid: props.userId,
  });

  if (isLoading) return <LoadingScreen />;

  if (!profileData || !profileData.length) return <div></div>;

  return (
    <div className="flex flex-col">
      {profileData.map((postData) => {
        return <PostView PostWithUser={postData} key={postData.post.id} />;
      })}
    </div>
  );
};

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const ProfilePage: NextPage<PageProps> = ({ username }) => {
  const { data: userProfile } = api.profiles.getUserByUsername.useQuery({
    username,
  });

  return (
    <>
      <Head>
        <title>Profile {}</title>
        <meta name="description" content="chirp clone profiles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={userProfile?.profileImageUrl!}
            width={128}
            height={128}
            alt={`${userProfile?.profileImageUrl} Profile Picture`}
            className="absolute bottom-0 left-0 -mb-16 ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div id="spacer" className="p-8" />
        <div className="p-4">
          <h2 className="text-2xl">{`@${userProfile?.username}`}</h2>
        </div>
        <div className="w-full border-b border-slate-400" />

        <ProfileFeed userId={userProfile?.id!} />
      </PageLayout>
    </>
  );
};

export default ProfilePage;

/**
 *  Prefetching data for the dynamic page from tRPC using GetStaticProps
 * @see https://trpc.io/docs/nextjs/ssg
 */

import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import PageLayout from "~/components/Layout";
import PostView from "~/components/PostView";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { LoadingScreen } from ".";

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, //? optional - adds superjson serialization
  });
  const slug = context.params?.slug as string;

  const username = slug.replace("@", "");

  //? prefetch `profiles.getUserByUsername`
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
