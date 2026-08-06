import { useEffect, useRef, useState } from "react";

import type { Answer } from "../../Types/Answer";
import { Badge } from "../shared/Tag";
import { FormatPublishDate } from "../../utils/DateFormater";
import { ArrowBigDown, ArrowBigUp, LoaderIcon, MoreHorizontal, Reply } from "lucide-react";
import { useLocale } from "../../i18n/useLocale";
import { useTranslation } from "react-i18next";

import ReplyItem from "./ReplyItem";
import type { Reply as ReplyType } from "../../Types/Reply";
import { createReplyToAnswer } from "../../Apis/AnswersApi/AnswerReplies";
import useGetAnswersReplies from "../../Hooks/AnswerHooks/useGetAnswersReplies";
import {
  answerDownVote,
  answerUpVote,
  deleteAnswers,
  reportAnswers,
} from "../../Apis/AnswersApi/Answers";
import DeleteThreadDialog from "./DeleteItemDialog";
import ReportDialog from "./ReportDialog";
import { Link, useParams, useSearchParams } from "react-router-dom";
import cn from "../../utils/Cn";
import { CheckCircle2 } from "lucide-react";
import { localizedPath } from "../../i18n/paths";

export default function AnswerItem({ answer, isFirst = false }: { answer: Answer; isFirst?: boolean }) {
  const { lang } = useLocale();
  const { t } = useTranslation();

  const [voted, setVoted] = useState(answer?.myVote);
  const [votes, setVotes] = useState(answer?.totalVoteValue);
  const [isVoting, setIsVoting] = useState(false);

  const [openMoreMenu, setOpenMoreMenu] = useState(false);

  const [showReplies, setShowReplies] = useState(false);

  const [replying, setReplying] = useState(false);
  const [replyInputValue, setreplyInputValue] = useState("");
  const [replyHeights, setreplyHeights] = useState<number[]>([0]);
  const repliesRef = useRef<HTMLDivElement[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const [replies, setReplies] = useState<ReplyType[]>([]);
  const [hasMoreReplies, setHasMoreReplies] = useState(false);
  const [nextCursor, setNextCursor] = useState("");

  const [IsHighligthed, setIsHighligthed] = useState(false);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  const HighlightedAnswerID = searchParams.get("highlighted");

  const timeoutRef = useRef<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reportValue, setReportValue] = useState("spam");
  const [isReporting, setIsReporting] = useState(false);
  const [reportingError, setReportingError] = useState("");

  const { id: questionIdparam } = useParams<{ id: string }>();

  const { data, isFetching, refetch } = useGetAnswersReplies(
    answer?.id,
    nextCursor,
  );

  const Highlight = () => {
    if (answer?.id === HighlightedAnswerID) {
      return "border-blue-300 bg-sky-100";
    } else if (isFirst) {
      return "border-emerald-300 bg-emerald-50/70 shadow-sm";
    } else {
      return "border-[#E5E7EB] bg-[#f7f7f7]";
    }
  };

  const handleUpVote = async () => {
    if (!answer?.id || isVoting) return;

    setIsVoting(true);

    const previousVote = voted;
    const previousTotal = votes;

    let nextVote: -1 | 0 | 1;
    let delta = 0;

    switch (previousVote) {
      case 1:
        nextVote = 0;
        delta = -1;
        break;

      case 0:
        nextVote = 1;
        delta = 1;
        break;

      case -1:
        nextVote = 1;
        delta = 2;
        break;
    }

    setVoted(nextVote);
    setVotes(previousTotal + delta);

    try {
      await answerUpVote(answer.id);
    } catch (error) {
      setVoted(previousVote);
      setVotes(previousTotal);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDownVote = async () => {
    if (!answer?.id || isVoting) return;

    setIsVoting(true);

    const previousVote = voted;
    const previousTotal = votes;

    let nextVote: -1 | 0 | 1;
    let delta = 0;

    switch (previousVote) {
      case 1:
        nextVote = -1;
        delta = -2;
        break;

      case 0:
        nextVote = -1;
        delta = -1;
        break;

      case -1:
        nextVote = 0;
        delta = 1;
        break;
    }

    setVoted(nextVote);
    setVotes(previousTotal + delta);

    try {
      await answerDownVote(answer.id);
    } catch (error) {
      setVoted(previousVote);
      setVotes(previousTotal);
    } finally {
      setIsVoting(false);
    }
  };

  const handleReplying = async () => {
    const content = replyInputValue.trim();

    if (!content) return;

    if (!answer?.id) {
      console.error("no valid answer id");
      return;
    }

    if (content.length > 1000) {
      console.error("Answer is too long");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await createReplyToAnswer(content, answer?.id);

      setreplyInputValue("");
      setReplies((prev) => [...prev, response?.data?.data]);
      setShowReplies(true);
    } catch (error) {
      console.error(error);
      console.error("Failed to create answer");
    } finally {
      setIsSubmitting(false);
      setReplying(false);
    }
  };

  const handleDelete = async () => {
    if (!questionIdparam || !answer?.id || isDeleting) return;

    try {
      setIsDeleting(true);

      await deleteAnswers(questionIdparam, answer.id);

      setOpenDeleteDialog(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const MAX_REPORT_LENGTH = 200;

  const handleReport = async () => {
    if (!answer?.id) return;

    if (isReporting) return;

    const reason = reportValue.trim();

    if (!reason) {
      setReportingError(t("answers.errors.enterReason"));
      return;
    }

    if (reason.length > MAX_REPORT_LENGTH) {
      setReportingError(
        t("answers.errors.maxChars", { count: MAX_REPORT_LENGTH }),
      );
      return;
    }

    try {
      setIsReporting(true);

      await reportAnswers(answer.id, reason);
      console.log(
        "the report is reported with id:",
        answer.id,
        "reason:",
        reason,
      );
      setReportingError("");
      setOpenReportDialog(false);
    } catch (err) {
      console.error(err);
      setReportingError(t("answers.errors.failedReport"));
    } finally {
      setIsReporting(false);
    }
  };

  const recomputeHeights = () => {
    if (!rootRef.current) return;

    const tops = repliesRef.current.map((reply) => {
      return reply.offsetTop;
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

  useEffect(() => {
    if (data) {
      setReplies((prev) => [...prev, ...(data?.replies ?? [])]);
      setNextCursor(data?.nextCursor);
      setHasMoreReplies(data?.hasMore);
    }
  }, [data]);
  useEffect(() => {
    if (HighlightedAnswerID === answer?.id) {
      setShowReplies(true);
      setIsHighligthed(true);
    }
  }, [HighlightedAnswerID]);
  return (
    <div className="flex max-w-2xl  " dir="rtl" ref={rootRef} id={answer?.id}>
      <div
        className={`relative w-9 mx-4 ${lang === "ar" ? "ml-4" : "mr-4"} group`}
      > 
        <Link to={localizedPath(lang, `profile/${answer?.author?.id}`)}>
          <img
            src={answer?.author?.avatar}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white outline-3 shadow shrink-0 mx-2 relative z-30 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ outlineColor: answer?.author?.tier.badgeColor }}
          />
        </Link>

        <div className="w-fit ">
          {showReplies && (
            <>
              {" "}
              <div
                className="absolute  bg-[#B4B8C0] group-hover:bg-blue-400 transition-colors duration-300 left-1/2 -translate-x-1/2 w-[1.5px] max-w-[1.5px] min-w-[1.5px] z-10"
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
                    className={` ${lang == "ar" ? "-scale-x-100 -left-1/2 translate-x-[0.75px]" : " -right-1/2 -translate-x-[0.75px]"} text-[#B4B8C0] group-hover:text-blue-400 w-full absolute  transition-colors duration-300 z-10`}
                    style={{
                      top: `${replyHeights[index] - 100}px`,
                    }} //36 is the height of the bubble of the image
                  >
                    <path
                      d="M0.75 0 V80 C0 103 11.4952 110 40.75 113"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      vectorEffect="non-scaling-stroke"
                      className="absolute w-[1.5px] max-w-[1.5px] min-w-[1.5px] z-10"
                    />
                  </svg>
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="flex-1 relative">
        {/* bubble */}
        <div
          ref={highlightRef}
          className={cn(
            ` border  rounded-2xl px-4 py-3 shadow-sm  w-full  z-20`,
            Highlight(),
          )}
        >
          {IsHighligthed && (
            <div 
              className={`absolute inset-x-30 inset-80 top-0 h-[${highlightRef?.current?.offsetHeight}px]  rounded-4xl main-gradient -z-1 opacity-20 animate-[ping_1.5s_100_100ms_forwards] `}
            />
          )}
          <div className="flex gap-2 items-center flex-wrap">
            <Link to={localizedPath(lang, `profile/${answer?.author?.id}`)} className="font-bold text-gray-900 hover:text-primary transition-colors">
              {answer?.author?.name}
            </Link>
            <Badge
              tier={answer?.author?.tier.name}
              color={answer?.author?.tier.badgeColor}
            />
            {isFirst && (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                <CheckCircle2 className="w-3 h-3" />
                {lang === "ar" ? "أفضل إجابة" : "Best Answer"}
              </span>
            )}
            <span className="mr-auto text-xs text-gray-400">
              {FormatPublishDate(answer?.createdAt)}
            </span>
            {/* Answer Votes */}
            <div className="flex gap-2 items-center">
              <button onClick={() => handleUpVote()}><ArrowBigUp size={20} fill={voted === 1 ? "green" : "transparent"} color={voted ===1? "green":"gray"} className={` hover:cursor-pointer hover:opacity-85 transition-opacity duration-300`}/></button>
                <p className={`text-lg text-gray-600 `}>{votes}</p>
              <button onClick={() => handleDownVote()}><ArrowBigDown size={20} fill={voted === -1 ? "red" : "transparent"} color={voted ===-1? "red":"gray"} className={` hover:cursor-pointer hover:opacity-85 transition-opacity duration-300`}/></button>
            </div>
          </div>

          <p className="text-sm text-gray-600 overflow-[break-word] ">
            {answer?.content}
          </p>
        </div>

        {/* actions */}
        <div className="flex gap-4 mt-2 mx-2 mb-2 text-xs">
          {/* <button
            onClick={() => {
              handleLike();
            }}
            className="flex gap-1 items-center"
          >
            <Heart
              className={`h-5 w-5 hover:cursor-pointer  hover:text-red-500 group transition-all duration-200   ${
                voted
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 group-hover:text-red-500 hover:cursor-pointer"
              }`}
            />{" "}
            {votes}
          </button> */}

          <button
            onClick={() => {
              setReplying(!replying);
            }}
            className={`flex ${lang == "ar" ? "flex-row" : "flex-row-reverse"} items-center gap-1 hover:cursor-pointer text-gray-600 hover:text-blue-500 group transition-all duration-200`}
          >
            <Reply
              className={`h-5 w-5 ${lang == "ar" ? "" : "-scale-x-100"} text-gray-600 group-hover:text-blue-500 `}
            />
            {t("answers.reply")}
          </button>
          <div className="relative inline-block">
            {(answer?.permissions?.canDelete ||
              answer?.permissions?.canReport) && (
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
              <div className="absolute right-0 bottom-full  border border-gray-200 rounded-xl mb-2 w-40 bg-white shadow-lg">
                {answer?.permissions?.canReport && (
                  <button
                    onClick={() => setOpenReportDialog(true)}
                    className="block w-full px-4 py-2  hover:bg-gray-100 hover:cursor-pointer"
                  >
                    {t("answers.report")}
                  </button>
                )}

                {answer?.permissions?.canDelete && (
                  <button
                    onClick={() => setOpenDeleteDialog(true)}
                    className="block w-full px-4 py-2 text-red-600 hover:bg-red-50 hover:cursor-pointer"
                  >
                    {t("answers.delete")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* reply input */}
        {replying && (
          <div className="flex gap-2 mt-2 mb-2 rounded-full">
            <textarea
              value={replyInputValue}
              onChange={(e) => {
                setreplyInputValue(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Enter" && {}}
              placeholder={t("answers.writeReplyPlaceholder")}
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
                t("answers.publish")
              )}
            </button>
          </div>
        )}

        {/* replies */}
        {replies && replies.length > 0 && (
          <>
            {!showReplies && answer.repliesCount > 0 && (
              <button
                onClick={() => {
                  setShowReplies(true);
                }}
                className="text-slate-600 font-semibold mt-3 mb-2"
              >
                {t("answers.viewMoreReplies", { count: answer?.repliesCount })}
              </button>
            )}

            {showReplies && (
              <div className="mt-3  ">
                {replies?.map((r, index) => {
                  return (
                    <div
                      ref={(element) => {
                        if (element) repliesRef.current[index] = element;
                      }}
                      key={r.id}
                    >
                      <ReplyItem key={r.id} reply={r} />
                    </div>
                  );
                })}
                {/* {isFetchingNextPage && <SkeletonAnswer indent={true} />} */}
                {/* <div ref={lastReplyRef} className="w-full h-2"></div> */}
                {hasMoreReplies && (
                  <>
                    {isFetching ? (
                      <div className="w-full flex justify-center my-2">
                        <LoaderIcon className="animate-spin" />
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          refetch();
                        }}
                        className="text-slate-600 font-semibold mt-3"
                      >
                        {t("answers.showMore")}
                      </button>
                    )}
                  </>
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
