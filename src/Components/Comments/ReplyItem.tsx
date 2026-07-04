import { useEffect, useRef, useState } from "react";

import { Badge } from "../shared/Tag";
import { FormatPublishDate } from "../../utils/DateFormater";
import { Heart, LoaderIcon, MoreHorizontal, Reply } from "lucide-react";
import { useLocale } from "../../i18n/useLocale";
import { useTranslation } from "react-i18next";

import type { Reply as ReplyType } from "../../Types/Reply";
import {
  createReplyToReply,
  deleteReply,
  likeToReply,
  reportReply,
  UnlikeToReply,
} from "../../Apis/CommentsApi/CommentReplies";
import useGetReplyReplies from "../../Hooks/CommentHooks/useGetReplyReplies";
import { useNavigate } from "react-router-dom";
import { localizedPath } from "../../i18n/paths";
import DeleteThreadDialog from "./DeleteItemDialog";
import ReportDialog from "./ReportDialog";

export default function ReplyItem({
  reply,

  showRepliesFlag = false,
}: {
  reply: ReplyType;

  showRepliesFlag?: boolean;
}) {
  const { lang } = useLocale();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(reply?.likesCount);
  const [isLiking, setIsLiking] = useState(false);

  const [openMoreMenu, setOpenMoreMenu] = useState(false);

  const [showReplies, setShowReplies] = useState(showRepliesFlag);

  const [replying, setReplying] = useState(false);
  const [replyInputValue, setreplyInputValue] = useState("");
  const [replyHeights, setreplyHeights] = useState<number[]>([0]);
  const repliesRef = useRef<HTMLDivElement[]>([]);
  const lastReplyRef = useRef<HTMLDivElement>(null);
  const [replies, setReplies] = useState<ReplyType[]>([]);

  const [hasMoreReplies, setHasMoreReplies] = useState(false);
  const [nextCursor, setNextCursor] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeoutRef = useRef<number | null>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reportValue, setReportValue] = useState("spam");
  const [isReporting, setIsReporting] = useState(false);
  const [reportingError, setReportingError] = useState("");

  const { data, isLoading, error, isFetching, refetch } = useGetReplyReplies(
    reply?.id,
    nextCursor,
  );

  const handleLike = async () => {
    if (!reply?.id || isLiking) return;

    setIsLiking(true);

    const wasLiked = liked;
    const previousLikes = likes;

    setLiked(!wasLiked);
    setLikes(previousLikes + (wasLiked ? -1 : 1));

    try {
      if (wasLiked) {
        await UnlikeToReply(reply.id);
      } else {
        await likeToReply(reply.id);
      }
    } catch (error) {
      setLiked(wasLiked);
      setLikes(previousLikes);
    } finally {
      setIsLiking(false);
    }
  };

  /** */
  const handleReplying = async () => {
    const content = replyInputValue.trim();

    if (!content) return;

    if (!reply?.id) {
      console.error("no valid reply id");
      return;
    }

    if (content.length > 1000) {
      console.error("Comment is too long");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await createReplyToReply(content, reply?.id);

      setreplyInputValue("");
      setReplies((prev) => [...prev, response?.data?.data]);
    } catch (error) {
      console.error(error);
      console.error("Failed to create reply");
    } finally {
      setIsSubmitting(false);
      setReplying(false);
    }
  };

  const handleDelete = async () => {
    if (!reply?.id || isDeleting) return;

    try {
      setIsDeleting(true);

      await deleteReply(reply.id);

      setOpenDeleteDialog(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const MAX_REPORT_LENGTH = 200;

  const handleReport = async () => {
    if (!reply?.id) return;

    if (isReporting) return;

    const reason = reportValue.trim();

    if (!reason) {
      setReportingError("Please enter a reason.");
      return;
    }

    if (reason.length > MAX_REPORT_LENGTH) {
      setReportingError(`Maximum ${MAX_REPORT_LENGTH} characters.`);
      return;
    }

    try {
      setIsReporting(true);

      await reportReply(reply.id, reason);
      console.log(
        "the report is reported with id:",
        reply.id,
        "reason:",
        reason,
      );
      setReportingError("");
      setOpenReportDialog(false);
    } catch (err) {
      console.error(err);
      setReportingError("Failed to submit report.");
    }
  };

  /* handle overflow replies*/

  const handleShowReplies = () => {
    if (replies[0]?.depth % 3 === 0)
      navigate(localizedPath(lang, `replies/${reply?.id}`), {
        state: { reply: reply, postId:data.postId },
      });
    if (showReplies) return;
    setShowReplies(true);
  };

  const recomputeHeights = () => {
    if (!rootRef.current) return;
    const parentRect = rootRef.current!.offsetTop;

    const tops = repliesRef.current.map((reply) => {
      return reply.offsetTop - parentRect;
    });

    setreplyHeights(tops);
  };

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      recomputeHeights();
    });

    repliesRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [replies, showReplies, repliesRef, replying]);

  useEffect(() => {
    if (!rootRef.current) return;

    const observer = new ResizeObserver(() => {
      recomputeHeights();
    });

    observer.observe(rootRef.current);

    return () => observer.disconnect();
  }, [rootRef, replying]);

  // useEffect(() => {
  //   if (data) {
  //     const replies = data.pages.flatMap((page: any) => page.replies);
  //     setReplies(replies);
  //     console.log("loading");
  //     if (isFetching) {
  //     }
  //   }
  // }, [data]);
  useEffect(() => {
    if (data) {
      setReplies(data?.replies);
      setNextCursor(data?.nextCursor);
      setHasMoreReplies(data?.hasMore);
    }
  }, [data]);
  return (
    <div className="flex max-w-2xl  " dir="rtl" ref={rootRef}>
      <div className={`relative w-9  ${lang === "ar"?"ml-4":"mr-4"} group`}>
        <img
          src={reply?.author?.avatar}
          className={`w-8 h-8 rounded-full object-cover ring-2 ring-white outline-3 shadow shrink-0 ${lang === "ar"?"ml-4":"mr-4"}`}
          style={{ outlineColor: reply?.author?.tier.badgeColor }}
        />

        <div className="w-fit group">
          {showReplies && !isFetching && (
            <>
              {" "}
              <div
                className="absolute  bg-[#B4B8C0] group-hover:bg-blue-400 left-1/2 -translate-x-1/2 w-[1.5px] max-w-[1.5px] min-w-[1.5px] -z-10"
                style={{
                  top: "36px",
                  height: `${replyHeights?.[replyHeights?.length - 1] - 113}px`,
                }}
              />
              {replyHeights?.map((_, index) => {
                return (
                  <svg
                    key={index}
                    width={41}
                    height={repliesRef.current[index]?.offsetHeight}
                    // viewBox="0 0 41 114"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={` ${lang == "ar" ? "-scale-x-100 -left-1/2 translate-x-[0.75px]" : "-right-1/2 -translate-x-[0.75px] "} text-[#B4B8C0] group-hover:text-blue-400   w-full absolute  -z-10`}
                    style={{
                      top: `${replyHeights[index] - 100}px`,
                    }} //36 is the height of the bubble of the image
                  >
                    <path
                      d="M0.75 0 V80 C0 103 11.4952 110 40.75 113"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      vectorEffect="non-scaling-stroke"
                      className="absolute w-[1.5px] max-w-[1.5px] min-w-[1.5px] -z-10"
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
            <span className="font-bold">{reply?.author?.name}</span>
            <Badge
              tier={reply?.author?.tier.name}
              color={reply?.author?.tier.badgeColor}
            />
            <span className="mr-auto text-xs text-gray-400">
              {FormatPublishDate(reply?.createdAt)}
            </span>
          </div>

          <p className="text-sm text-gray-600 wrap-anywhere whitespace-pre-wrap ">
            {reply?.content}
          </p>
        </div>

        {/* actions */}
        <div className="flex gap-4 mt-2 mx-2 text-xs mb-2">
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
            className={`flex ${lang == "ar" ? "flex-row" : "flex-row-reverse"} items-center gap-1 hover:cursor-pointer text-gray-600 hover:text-blue-500 group transition-all duration-200`}
          >
            <Reply className={`h-5 w-5 ${lang == "ar" ? "" : "-scale-x-100"} text-gray-600 group-hover:text-blue-500 `} />
            رد
          </button>
          <div className="relative inline-block">
            {(reply?.permissions?.canDelete ||
              reply?.permissions?.canReport) && (
              <button
                onClick={() => setOpenMoreMenu((o) => !o)}
                onBlur={() => {
                  timeoutRef.current = window.setTimeout(() => {
                    setOpenMoreMenu(false);
                  }, 300);
                }}
                onFocus={() => {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                }}
                className=" rounded-full hover:bg-gray-100 hover:cursor-pointer"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-600" />
              </button>
            )}

            {openMoreMenu && (
              <div className="absolute right-0 bottom-full mb-2 w-40 rounded-lg  bg-white shadow-lg">
                {reply?.permissions?.canReport && (
                  <button
                    onClick={() => setOpenReportDialog(true)}
                    className="block w-full px-4 py-2 hover:bg-gray-100 hover:cursor-pointer"
                  >
                    Report
                  </button>
                )}

                {reply?.permissions?.canDelete && (
                  <button
                    onClick={() => setOpenDeleteDialog(true)}
                    className="block w-full px-4 py-2 text-red-600 hover:bg-red-50 hover:cursor-pointer"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* reply input */}
        {replying && (
          <div className="flex gap-2 mt-2 mb-2  rounded-full">
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
                onClick={() => handleShowReplies()}
                className="text-slate-600 font-semibold mt-3  mb-3"
              >
                {replies?.length} ردود
              </button>
            )}

            {showReplies && (
              <div className="mt-3  ">
                {isFetching ? (
                  <div className="w-full flex justify-center">
                    <LoaderIcon className="animate-spin" />
                  </div>
                ) : (
                  replies?.map((r, index) => (
                    <div
                      ref={(element) => {
                        if (element) repliesRef.current[index] = element;
                      }}
                      key={r.id}
                    >
                      <ReplyItem key={r.id} reply={r} />
                    </div>
                  ))
                )}
                {hasMoreReplies && (
                  <button
                    onClick={() => handleShowReplies()}
                    className="text-slate-600 font-semibold mt-3  mb-3"
                  >
                    عرض المزيد
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {openDeleteDialog && (
        <DeleteThreadDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={() => {
            handleDelete();
          }}
        />
      )}
      {openReportDialog && (
        <ReportDialog
          open={openReportDialog}
          onClose={() => setOpenReportDialog(false)}
          onConfirm={() => {
            handleReport();
          }}
          setReportReason={setReportValue}
          reportReason={reportValue}
          errorMessage={reportingError}
        />
      )}
    </div>
  );
}

function SkeletonReply({ indent = false }) {
  return (
    <div className={`flex gap-3 animate-pulse ${indent ? "mr-10" : ""}`}>
      <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
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
