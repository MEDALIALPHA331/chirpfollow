import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { RouterOutputs } from "~/utils/api";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: { PostWithUser: PostWithUser }) => {
  const {
    PostWithUser: { author, post },
  } = props;
  return (
    <div className="flex items-center justify-start gap-6 border-b border-slate-400  px-2 md:py-4">
      <Image
        alt={`${author.username} profile picture`}
        src={author.profileImageUrl}
        width={48}
        height={48}
        className="rounded-full"
      />
      <div className="flex flex-col items-start justify-center">
        <div className="flex items-center justify-center">
          <Link href={`/@${author.username}`}>
            <span className="text-xs text-slate-400">@{author.username}</span>
          </Link>
          <Link href={`/post/@${post.id}`}>
            <span className="text-xs text-slate-400">
              {` . ${dayjs(post.createdAt).fromNow()}`}
            </span>
          </Link>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
};

export default PostView;
