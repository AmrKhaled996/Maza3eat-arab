import { useEffect, useRef, useState } from "react";

import type { Comment } from "../../Types/Comment";
import { Badge } from "../shared/Tag";
import { FormatPublishDate } from "../../utils/DateFormater";
import { Heart, LoaderIcon, Reply } from "lucide-react";
import { useLocale } from "../../i18n/useLocale";
import { useTranslation } from "react-i18next";

import ReplyItem from "./ReplyItem";
import type { Reply as ReplyType } from "../../Types/Reply";
import { createReplyToComment } from "../../Apis/CommentsApi/CommentReplies";
import useGetCommentsReplies from "../../Hooks/CommentHooks/useGetCommentReplies";

export default function CommentItem({
  comment,
  depth,
}: {
  comment: Comment;
  depth: number;
}) {
  const { lang } = useLocale();
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(comment?.likesCount);
  const [showReplies, setShowReplies] = useState(false);

  const [replying, setReplying] = useState(false);
  const [replyInputValue, setreplyInputValue] = useState("");
  const [replyHeights, setreplyHeights] = useState<number[]>([0]);
  const replysRef = useRef<HTMLDivElement[]>([]);
  const [replies, setReplies] = useState<ReplyType[]>([
    // {
    //   id: "4c9ec43e-991b-4292-b3ed-48e9343579e0",
    //   postId: "67f528b9-54cf-4c65-ac8d-00ca143186d9",
    //   authorId: "01ba7079-7d55-4749-8764-64de5bc3c99c",
    //   content:
    //     "It is an Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum ea architecto vel maxime impedit quidem dignissimos, aperiam harum in, quo itaque asperiores atque at laboriosam molestiae veniam praesentium quibusdam voluptas. place!6",
    //   likesCount: 29,
    //   repliesCount: 16,
    //   createdAt: new Date(),
    //   author: {
    //     id: "01ba7079-7d55-4749-8764-64de5bc3c99c",
    //     name: "Ali Magdy",
    //     avatar: "https://i.pravatar.cc/40?img=1",
    //     tierName: "silver",
    //     badgeColor: "#7a6d6dff",
    //   },
    //   likedByMe: false,
    // },
    // {
    //   id: "4c9ec43e-991b-4252-b3ed-48e9343579e0",
    //   postId: "67f528b9-54cf-4c65-ac8d-00ca143186d9",
    //   authorId: "01ba7079-7d55-4749-8764-64de5bc3c99c",
    //   content: "It is an amazing place!6",
    //   likesCount: 29,
    //   repliesCount: 16,
    //   createdAt: new Date(),
    //   author: {
    //     id: "01ba7059-7d55-4749-8764-64de5bc3c99c",
    //     name: "Ali Magdy",
    //     avatar: "https://i.pravatar.cc/40?img=1",
    //     tierName: "silver",
    //     badgeColor: "#7a6d6dff",
    //   },
    //   likedByMe: false,
    // },
    // {
    //   id: "4c9ec43e-191b-4252-b3ed-48e9343579e0",
    //   postId: "67f528b9-54cf-4c65-ac8d-00ca143186d9",
    //   authorId: "01ba7079-7d55-4749-8764-64de5bc3c99c",
    //   content:
    //     "It is an amazing place!6 Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis in tempora non vel! Dolorum eius modi, sit natus ut consequatur, id necessitatibus ullam harum illum dolore perferendis culpa magnam. Officia. ",
    //   likesCount: 29,
    //   repliesCount: 16,
    //   createdAt: new Date(),
    //   author: {
    //     id: "01ba7059-7d55-4749-8764-64de5bc3c99c",
    //     name: "Ali Magdy",
    //     avatar: "https://i.pravatar.cc/40?img=1",
    //     tierName: "silver",
    //     badgeColor: "#7a6d6dff",
    //   },
    //   likedByMe: false,
    // },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: repliesResponse, isLoading } = useGetCommentsReplies(
    comment?.id,
  );

  const handleLike = () => {
    setLiked(!liked);
    setLikes((c) => (liked ? c - 1 : c + 1));
  };

  // const addElement = (element: HTMLDivElement|null) => {
  //   setReplysElement((ele) =>
  //     [...(ele || []), element].filter((e): e is HTMLDivElement => e !== null),
  //   );
  // };

  const handleReplying = async () => {
    const content = replyInputValue.trim();

    if (!content) return;

    if (!comment?.id) {
      console.error("no valid comment id");
      return;
    }

    if (content.length > 1000) {
      console.error("Comment is too long");
      return;
    }

    try {
      setIsSubmitting(true);

      await createReplyToComment(content, comment?.id);

      setreplyInputValue("");
      setReplies((prev) => [...prev, repliesResponse?.data.data.replies]);
    } catch (error) {
      console.error(error);
      console.error("Failed to create comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log("replies" + replysRef);
    const prefixSums = replysRef?.current.reduce(
      (acc: number[], curr: HTMLDivElement) => {
        acc.push(
          acc.length
            ? acc[acc.length - 1] + curr.offsetHeight
            : curr.offsetHeight,
        );
        return acc;
      },
      [],
    );
    replysRef?.current.map((r, i) => console.log("top of reply:", r.offsetTop));
    setreplyHeights((prev) => [...prev, ...prefixSums.slice(0, -1)]);
  }, [replysRef, showReplies, replies]);

  useEffect(() => {
    if (repliesResponse?.data) {
      setReplies(repliesResponse.data.data.replies);
    }
  }, [repliesResponse]);

  return (
    <div className="flex max-w-2xl  " dir="rtl">
      <div className="relative w-9 ml-4">
        <img
          src={comment?.author?.avatar}
          className="w-9 h-9 rounded-full object-cover ring-2 ring-white outline-3 shadow shrink-0 ml-4"
          style={{ outlineColor: comment?.author?.tier.badgeColor }}
        />

        <div className="w-fit">
          {showReplies && (
            <>
              {" "}
              <div
                className="absolute  bg-[#B4B8C0] left-1/2 -translate-x-1/2 w-[1.5px] -z-10"
                style={{
                  top: "36px",
                  height: `${replyHeights?.[replyHeights?.length - 1]}px`,
                }}
              ></div>
              {replysRef.current.map((replyHeight, index) => {
                console.log("first", replyHeight.offsetHeight);
                return (
                  <svg
                    key={index}
                    width={41}
                    height="114"
                    viewBox="0 0 41 114"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={` ${lang == "ar" ? "-scale-x-100 " : " "}  -left-1/2 translate-x-[0.75px] w-full absolute  -z-10`}
                    style={{
                      top: `${replyHeights[index] + 26}px`,
                    }} //36 is the height of the bubble of the image
                  >
                    <path
                      d="M0.75 0 V80 C0 103 11.4952 110 40.75 113"
                      stroke="#B4B8C0"
                      strokeWidth={1.5}
                      vectorEffect="non-scaling-stroke"
                      className="absolute"
                    />
                  </svg>
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="flex-1">
        {/* bubble */}
        <div className="bg-[#f7f7f7] border border-[#E5E7EB] rounded-2xl px-4 py-3 shadow-sm  w-full">
          <div className="flex gap-2 items-center">
            <span className="font-bold">{comment?.author?.name}</span>
            <Badge
              tier={comment?.author?.tier.name}
              color={comment?.author?.tier.badgeColor}
            />
            <span className="mr-auto text-xs text-gray-400">
              {FormatPublishDate(comment?.createdAt)}
            </span>
          </div>

          <p className="text-sm text-gray-600 overflow-[break-word] ">
            {comment?.content}
          </p>
        </div>

        {/* actions */}
        <div className="flex gap-4 mt-2 mx-2 text-xs">
          <button
            onClick={() => {
              handleLike();
            }}
            className="flex gap-1 items-center"
          >
            <Heart
              className={`h-5 w-5 hover:cursor-pointer  hover:text-red-500 group transition-all duration-200   ${
                liked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 group-hover:text-red-500 hover:cursor-pointer"
              }`}
            />{" "}
            {likes}
          </button>

          <button
            onClick={() => {
              setReplying(!replying);
            }}
            className="flex items-center gap-1 hover:cursor-pointer text-gray-600 hover:text-blue-500 group transition-all duration-200"
          >
            <Reply className="h-5 w-5 text-gray-600 group-hover:text-blue-500 " />
            رد
          </button>
        </div>

        {/* reply input */}
        {replying && (
          <div className="flex gap-2 mt-2  rounded-full">
            <textarea
              value={replyInputValue}
              onChange={(e) => {
                setreplyInputValue(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Enter" && {}}
              placeholder="اكتب..."
              className="flex-1 border border-slate-400 rounded-full px-3 py-2 text-sm focus:border-primary focus:outline-primary text-gray-700 placeholder-gray-400 resize-none min-h-5 h-10 scrollbar-hide line-clamp-3"
            />
            <button
              onClick={() => handleReplying()}
              className="px-4 py-1 text-white font-semibold main-gradient rounded-full"
            >
              {isSubmitting ? (
                <>
                  <LoaderIcon className="animate-spin" />
                </>
              ) : (
                " نشر "
              )}
            </button>
          </div>
        )}

        {/* replies */}
        {replies && replies.length > 0 && (
          <>
            {!showReplies && (
              <button
                onClick={() => {
                  setShowReplies(true);
                  console.log(
                    "height:" + replyHeights,
                    "replies:" + replysRef.current,
                  );
                }}
                className="text-slate-600 font-semibold mt-3"
              >
                عرض المزيد
              </button>
            )}

            {showReplies && (
              <div className="mt-3  ">
                {replies?.map((r, index) => (
                  <div
                    ref={(element) => {
                      if (element) replysRef.current[index] = element;
                    }}
                    key={r.id}
                  >
                    <ReplyItem key={r.id} reply={r} depth={depth} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SkeletonComment({ indent = false }) {
  return (
    <div className={`flex gap-3 animate-pulse ${indent ? "mr-10" : ""}`}>
      <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2 items-center">
          <div className="h-3 w-24 bg-gray-200 rounded-full" />
          <div className="h-3 w-12 bg-gray-200 rounded-full" />
        </div>
        <div className="h-3 w-full bg-gray-200 rounded-full" />
        <div className="h-3 w-3/4 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}
