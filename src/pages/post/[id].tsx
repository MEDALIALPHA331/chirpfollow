import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import PageLayout from "~/components/Layout";
import PostView from "~/components/PostView";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import { LoadingScreen } from "..";

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const SinglePostPage: NextPage<PageProps> = ({ id }) => {
  const { data: postData, isLoading } = api.posts.getById.useQuery({
    id,
  });

  if (isLoading) return <LoadingScreen />;
  if (!postData) return <div />;

  return (
    <>
      <Head>
        <title>{`Post ${postData?.post.content} By ${postData?.author.username}`}</title>
        <meta name="description" content="chirp clone profiles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout>
        <PostView PostWithUser={postData} />
      </PageLayout>
    </>
  );
};

export default SinglePostPage;

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const helpers = generateSSGHelper();
  const id = context.params?.id as string;

  //? prefetch `profiles.getUserByUsername`
  helpers.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
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
