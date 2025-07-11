'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import {
  commentListAtom,
  newCommentAtom,
  replyTargetAtom,
  replyCommentAtom,
  CommentItemType,
} from '@/entities/auth/model/commentAtom';
import { fetchComments, postComment, postReply } from '@/shared/api/comment';
import {
  HeartIcon,
  PaperAirplaneIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { sendAnonymousMessage } from '@/shared/api/message';

interface CommentSectionProps {
  boardId: number;
  onCommentCountChange: (count: number) => void;
}

export default function CommentSection({ boardId, onCommentCountChange }: CommentSectionProps) {
  const [comments, setComments] = useAtom(commentListAtom);
  const [comment, setComment] = useAtom(newCommentAtom);
  const [replyTo, setReplyTo] = useAtom(replyTargetAtom);
  const [replyContent, setReplyContent] = useAtom(replyCommentAtom);
  const router = useRouter();

  useEffect(() => {
    fetchComments(boardId)
      .then((data) => {
        const parsedData: CommentItemType[] = data.map((comment: any) => ({
          ...comment,
          anonymousNumber: comment.anonymousNumber ?? 0,
          replies: (comment.replies ?? []).map((reply: any) => ({
            ...reply,
            anonymousNumber: reply.anonymousNumber ?? 0,
            createdDate: reply.createdDate ?? '',
          })),
        }));
        setComments(parsedData);
        const count =
          parsedData.length +
          parsedData.reduce((sum, c) => sum + (c.replies?.length ?? 0), 0);
        onCommentCountChange(count);
      })
      .catch(console.error);
  }, [boardId, setComments, onCommentCountChange]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const newComment = await postComment(boardId, comment);
      const updated: CommentItemType[] = [
        ...comments,
        {
          ...newComment,
          anonymousNumber: newComment.anonymousNumber ?? 0,
          replies: [],
        },
      ];
      setComments(updated);
      setComment('');
      const count =
        updated.length +
        updated.reduce((sum, c) => sum + (c.replies?.length ?? 0), 0);
      onCommentCountChange(count);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplySubmit = async (
    e: React.FormEvent,
    parentId: number
  ) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    try {
      await postReply(parentId, replyContent);
      const data = await fetchComments(boardId);
      const parsedData: CommentItemType[] = data.map((comment: any) => ({
        ...comment,
        anonymousNumber: comment.anonymousNumber ?? 0,
        replies: (comment.replies ?? []).map((reply: any) => ({
          ...reply,
          anonymousNumber: reply.anonymousNumber ?? 0,
          createdDate: reply.createdDate ?? '',
        })),
      }));
      setComments(parsedData);
      setReplyContent('');
      setReplyTo(null);
      const count =
        parsedData.length +
        parsedData.reduce((sum, c) => sum + (c.replies?.length ?? 0), 0);
      onCommentCountChange(count);
    } catch (err) {
      console.error(err);
    }
  };

  // 쪽지: 클릭 시 바로 채팅방 이동
  const handleSendMessage = async (
    commentId: number,
    anonymousNumber: number
  ) => {
    try {
      const room = await sendAnonymousMessage({
        boardId,
        commentId,
        content: ' ', 
      });
      if (!room || !room.roomId) throw new Error('roomId 없음');
      router.push(`/messages/${room.roomId}`);
    } catch (e) {
      console.error('쪽지 전송 실패', e);
      alert('쪽지를 보내는 데 실패했습니다.');
    }
  };

  return (
    <section className="bg-white">
      <div className="space-y-6">
        {comments.map((c) => (
          <div key={c.commentId} className="px-4 border-t border-gray-200 pt-4 relative">
            <div className="absolute top-2 right-4 flex gap-3 text-gray-400">
              <button>
                <HeartIcon className="w-4 h-4" />
              </button>
              <button onClick={() => setReplyTo(c.commentId)}>
                <ArrowUturnRightIcon className="w-4 h-4" />
              </button>
              {c.anonymousNumber != null && (
                <button onClick={() => handleSendMessage(c.commentId, c.anonymousNumber)}>
                  <PaperAirplaneIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-800">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <Image src="/profile.png" alt="user" width={40} height={40} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">익명{c.anonymousNumber ?? 0}</span>
                  <span className="text-xs text-gray-400">{c.createdDate ?? ''}</span>
                </div>
                <p className="mt-1 text-sm text-black">{c.content ?? ''}</p>

                {replyTo === c.commentId && (
                  <form onSubmit={(e) => handleReplySubmit(e, c.commentId)} className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="대댓글을 입력하세요"
                      className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="text-blue-500 font-semibold text-sm px-3">
                      작성
                    </button>
                  </form>
                )}

                {Array.isArray(c.replies) && c.replies.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {c.replies.map((reply) => (
                      <div
                        key={reply.replyId}
                        className="p-2 bg-gray-50 rounded-xl border border-gray-100 relative"
                      >
                        <div className="absolute top-2 right-2 flex gap-2 text-gray-400">
                          <button>
                            <HeartIcon className="w-4 h-4" />
                          </button>
                          <button>
                            <ArrowUturnRightIcon className="w-4 h-4" />
                          </button>
                          {reply.anonymousNumber != null && (
                            <button
                              onClick={() =>
                                handleSendMessage(c.commentId, reply.anonymousNumber!)
                              }
                            >
                              <PaperAirplaneIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-blue-600">
                            익명{reply.anonymousNumber ?? 0}
                          </span>
                          <span className="text-xs text-gray-400">{reply.createdDate ?? ''}</span>
                        </div>
                        <p className="text-sm text-gray-800 mt-1">{reply.content ?? ''}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleCommentSubmit}
        className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t px-4 py-3 flex gap-2 z-50"
      >
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
        />
        <button type="submit" className="text-blue-500 font-semibold text-sm px-2">
          작성
        </button>
      </form>
    </section>
  );
}
