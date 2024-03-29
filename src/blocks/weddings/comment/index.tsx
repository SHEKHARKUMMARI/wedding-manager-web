/* eslint-disable react-hooks/exhaustive-deps */
import CommentBox from "@/components/comment-box";
import { formatCommentDate } from "@/stores/comments";
import { fetchComments, saveComment } from "@/stores/weddings";
import { MyWeddingData, Comment } from "@/types/weddings";
import { CloseCircle, Messages2, Send } from "iconsax-react";
import React, { useEffect, useState } from "react";
import { Mention, MentionsInput } from "react-mentions";
import Popup from "reactjs-popup";
import Comments from "./comment";
import { isLogedIn } from "@/utils/run-time";

function CommentsBox(props: { wedding: MyWeddingData }) {
  const { wedding } = props;
  const [comments, setComments] = useState<Comment[]>();
  const [newComment, setNewComment] = useState<Comment>();

  const totalComments = comments?.reduce(
    (totalCount, comment) => totalCount + 1 + (comment?.replies?.length || 0),
    0
  );

  const handleCommentChange = (newValue: any, mentions: any) => {
    setNewComment((comment) => ({
      ...comment,
      message: newValue,
      mentions: mentions,
    }));
  };

  const handleSaveComment = async (params: {
    weddingId?: string;
    payload: Comment;
  }) => {
    if (!isLogedIn()) return;
    const { payload } = params;
    try {
      await saveComment({ weddingId: wedding?._id, payload });
      updateComments();
    } catch (err) {
      console.log("ERROR", err);
    }
  };

  const updateComments = async () => {
    try {
      const comments = await fetchComments({ weddingId: wedding?._id });
      setComments(comments);
    } catch (err) {
      console.log("ERROR", err);
    }
  };
  useEffect(() => {
    updateComments();
  }, []);

  return (
    <div>
      <Popup
        trigger={
          <div className="flex items-center gap-2">
            <Messages2 size="32" color={"black"} variant={"Outline"} />
            <div>{totalComments}</div>
          </div>
        }
        contentStyle={{
          width: "100%",
          height: "100%",
          marginTop: "8%",
        }}
        overlayStyle={{
          background: "rgba(0, 0, 0, 0.5)", // Add overlay blur effect
        }}
        nested
        offsetX={100}
        offsetY={500}
        lockScroll
        modal
      >
        {/* @ts-ignore */}
        {(close: any) => {
          return (
            <div className=" bg-white w-[80%] h-[80%] overflow-auto m-auto py-10 px-2 rounded-lg shadow-lg">
              <div className="w-full flex justify-end mr-4 ">
                <CloseCircle
                  size="32"
                  color={"black"}
                  onClick={close}
                  className={`cursor-pointer`}
                />
              </div>
              <div className="w-full text-center py-5 text-2xl font-bold text-gray-800">
                {wedding?.title}
              </div>
              <div className="border min-h-[200px] w-full p-6">
                {comments?.map((comment) => (
                  <div key={comment?._id} className="mb-4">
                    <Comments
                      comment={comment}
                      handleSave={handleSaveComment}
                    />
                  </div>
                ))}
              </div>
              <div className="w-full flex items-center">
                <div className="w-[90%]">
                  <CommentBox
                    message={newComment!}
                    handleCommentChange={handleCommentChange}
                    placeholder="Add comment"
                    style={{ height: "100px" }}
                    disabled={!isLogedIn()}
                  />
                </div>
                <Send
                  size="32"
                  color="#3B82F6"
                  variant="Bold"
                  onClick={() => {
                    handleSaveComment({
                      payload: newComment!,
                    });
                    setNewComment(undefined);
                  }}
                />
              </div>
            </div>
          );
        }}
      </Popup>
    </div>
  );
}

export default CommentsBox;
