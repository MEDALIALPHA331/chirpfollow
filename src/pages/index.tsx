import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: postsData, isLoading } = api.posts.getAll.useQuery();

  console.log(postsData);

  const user = useUser();
  //bg-gradient-to-b from-[#2e026d] to-[#15162c]
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <div>{user.isSignedIn ? <SignOutButton /> : <SignInButton />}</div>

        <div>
          {postsData?.map((post) => {
            return (
              <div key={post.id}>
                <span>{post.content}</span>
                <span>By: {post.authorId}</span>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default Home;
