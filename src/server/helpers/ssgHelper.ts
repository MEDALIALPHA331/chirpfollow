/**
 *  Prefetching data for the dynamic page from tRPC using GetStaticProps
 * @see https://trpc.io/docs/nextjs/ssg
 */

import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export function generateSSGHelper() {
  return createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, //? optional - adds superjson serialization
  });
}
