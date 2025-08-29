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
import {
  fetchComments,
  postComment,
  postReply,
  toggleCommentLike,
} from '@/shared/api/comment';
import {
  HeartIcon,
  PaperAirplaneIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { sendAnonymousMessage } from '@/shared/api/message';

interface CommentSectionProps {
  boardId: number;
  onCommentCountChange: (count: number) => void;
}

// 댓글·대댓글 아바타 대신 사용할 이모지 목록
const emojis = [
  '🐶','🐱','🐰','🐻','🐼','🦊','🐯','🦁',
  '🐵','🦄','🐸','🐷','🐥','🦖','🦉','🦦'
];

// "YY/MM/DD HH:MM" 형태로 포맷팅
function formatDateTime(datetime?: string) {
  if (!datetime) return '';
  const [date, time] = datetime.split(/[ T]/);
  if (!date || !time) return datetime;
  const [year, month, day] = date.split('-');
  const [hh, mm] = time.split(':');
  return `${year.slice(2)}/${month}/${day} ${hh}:${mm}`;
}

export default function CommentSection({
  boardId,
  onCommentCountChange,
}: CommentSectionProps) {
  const router = useRouter();
  const [comments, setComments] = useAtom(commentListAtom);
  const [comment, setComment] = useAtom(newCommentAtom);
  const [replyTo, setReplyTo] = useAtom(replyTargetAtom);
  const [replyContent, setReplyContent] = useAtom(replyCommentAtom);

  // 댓글 + 대댓글 불러오기
  useEffect(() => {
    fetchComments(boardId)
      .then((response) => {
        console.log('댓글 API 응답:', response); // 디버깅용 로그
        
        // API 응답 구조에 따라 data 필드에서 댓글 배열 추출
        const commentData = response.data || response;
        
        // 배열인지 확인
        if (!Array.isArray(commentData)) {
          console.error('댓글 데이터가 배열이 아님:', commentData);
          setComments([]);
          onCommentCountChange(0);
          return;
        }
        
        const parsed: CommentItemType[] = commentData.map((c: any) => ({
          ...c,
          anonymousNumber: c.anonymousNumber ?? 0,
          likedByMe: c.likedByMe ?? false,
          likeCount: c.likeCount ?? 0,
          idBoardWriter: c.idBoardWriter ?? false,
          replies: (c.replies ?? []).map((r: any) => ({
            ...r,
            anonymousNumber: r.anonymousNumber ?? 0,
            createdAt: r.createdAt ?? '',
            likedByMe: r.likedByMe ?? false,
            likeCount: r.likeCount ?? 0,
            idBoardWriter: r.idBoardWriter ?? false,
          })),
        }));
        
        console.log('파싱된 댓글:', parsed); // 디버깅용 로그
        
        setComments(parsed);
        const totalCount =
          parsed.length +
          parsed.reduce((sum, c) => sum + (c.replies?.length ?? 0), 0);
        onCommentCountChange(totalCount);
      })
      .catch((error) => {
        console.error('댓글 목록 조회 실패:', error);
        setComments([]);
        onCommentCountChange(0);
      });
  }, [boardId, setComments, onCommentCountChange]);

  // 댓글 좋아요 토글
  const handleToggleCommentLike = async (commentId: number) => {
    try {
      const response = await toggleCommentLike(commentId);
      console.log('댓글 좋아요 토글 응답:', response); // 디버깅용 로그
      
      // API 응답 구조에 따라 data 필드에서 데이터 추출
      const data = response.data || response;
      
      setComments((prev) =>
        prev.map((c) =>
          c.commentId === commentId
            ? { ...c, likedByMe: data.liked, likeCount: data.likeCount }
            : c
        )
      );
    } catch (error) {
      console.error('댓글 좋아요 실패:', error);
      alert('댓글 좋아요 실패');
    }
  };

  // 대댓글 좋아요 토글
  const handleToggleReplyLike = async (replyId: number) => {
    try {
      const response = await toggleCommentLike(replyId);
      console.log('대댓글 좋아요 토글 응답:', response); // 디버깅용 로그
      
      // API 응답 구조에 따라 data 필드에서 데이터 추출
      const data = response.data || response;
      
      setComments((prev) =>
        prev.map((c) => ({
          ...c,
          replies: c.replies?.map((r) =>
            r.replyId === replyId
              ? { ...r, likedByMe: data.liked, likeCount: data.likeCount }
              : r
          ) ?? [],
        }))
      );
    } catch (error) {
      console.error('대댓글 좋아요 실패:', error);
      alert('대댓글 좋아요 실패');
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const response = await postComment(boardId, comment);
      console.log('댓글 작성 응답:', response); // 디버깅용 로그
      
      // API 응답 구조에 따라 data 필드에서 댓글 데이터 추출
      const newC = response.data || response;
      
      const updated = [
        ...comments,
        {
          ...newC,
          anonymousNumber: newC.anonymousNumber ?? 0,
          likedByMe: newC.likedByMe ?? false,
          likeCount: newC.likeCount ?? 0,
          idBoardWriter: newC.idBoardWriter ?? false,
          replies: [],
        },
      ];
      setComments(updated);
      setComment('');
      const totalCount =
        updated.length +
        updated.reduce((sum, c) => sum + (c.replies?.length ?? 0), 0);
      onCommentCountChange(totalCount);
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    }
  };

  // 대댓글 작성
  const handleReplySubmit = async (
    e: React.FormEvent,
    parentId: number
  ) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    try {
      await postReply(parentId, replyContent);
      // 전체 다시 불러오기
      const response = await fetchComments(boardId);
      console.log('대댓글 작성 후 댓글 목록 응답:', response); // 디버깅용 로그
      
      // API 응답 구조에 따라 data 필드에서 댓글 배열 추출
      const commentData = response.data || response;
      
      // 배열인지 확인
      if (!Array.isArray(commentData)) {
        console.error('댓글 데이터가 배열이 아님:', commentData);
        setComments([]);
        onCommentCountChange(0);
        return;
      }
      
      const parsed: CommentItemType[] = commentData.map((c: any) => ({
        ...c,
        anonymousNumber: c.anonymousNumber ?? 0,
        likedByMe: c.likedByMe ?? false,
        likeCount: c.likeCount ?? 0,
        idBoardWriter: c.idBoardWriter ?? false,
        replies: (c.replies ?? []).map((r: any) => ({
          ...r,
          anonymousNumber: r.anonymousNumber ?? 0,
          createdAt: r.createdAt ?? '',
          likedByMe: r.likedByMe ?? false,
          likeCount: r.likeCount ?? 0,
          idBoardWriter: r.idBoardWriter ?? false,
        })),
      }));
      setComments(parsed);
      setReplyContent('');
      setReplyTo(null);
      const totalCount =
        parsed.length +
        parsed.reduce((sum, c) => sum + (c.replies?.length ?? 0), 0);
      onCommentCountChange(totalCount);
    } catch (err) {
      console.error('대댓글 작성 실패:', err);
    }
  };

  // 쪽지 보내기
  const handleSendMessage = async (
    commentId: number,
    anonymousNumber: number
  ) => {
    try {
      // 채팅방 생성하지 않고 ChatDetail 페이지로 이동
      router.push(`/messages/new?boardId=${boardId}&isBoardWriter=false&anonymousNumber=${anonymousNumber}`);
    } catch (e) {
      console.error('쪽지 전송 실패', e);
      alert('쪽지를 보내는 데 실패했습니다.');
    }
  };

  return (
    <section className="bg-white">
      <div className="space-y-4">
        {comments.map((c) => {
          const avatar = c.idBoardWriter ? emojis[0] : emojis[c.commentId % emojis.length];
          return (
            <div
              key={c.commentId}
              className="px-4 border-t border-gray-200 pt-4 relative"
            >
              <div className="absolute top-4 right-4 flex items-center gap-2 text-gray-400">
                <button onClick={() => handleToggleCommentLike(c.commentId)}>
                  <HeartIcon
                    className={`w-3.5 h-3.5 ${
                      c.likedByMe ? 'text-red-500' : 'text-gray-400'
                    }`}
                  />
                </button>
                <span className="text-xs">{c.likeCount}</span>
                <button onClick={() => {
                  // 토글 기능: 이미 열려있으면 닫기, 닫혀있으면 열기
                  if (replyTo === c.commentId) {
                    setReplyTo(null);
                    setReplyContent(''); // 입력 내용도 초기화
                  } else {
                    setReplyTo(c.commentId);
                  }
                }}>
                  <ArrowUturnRightIcon className={`w-3.5 h-3.5 ${
                    replyTo === c.commentId ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                </button>
                {c.anonymousNumber != null && (
                  <button
                    onClick={() =>
                      handleSendMessage(c.commentId, c.anonymousNumber)
                    }
                  >
                    <PaperAirplaneIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-start gap-2 text-sm text-gray-800">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                  {avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {c.idBoardWriter ? '작성자' : `익명${c.anonymousNumber}`}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDateTime(c.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-black">{c.content}</p>

                  {replyTo === c.commentId && (
                    <form
                      onSubmit={(e) => handleReplySubmit(e, c.commentId)}
                      className="mt-2 flex gap-2"
                    >
                      <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="대댓글을 입력하세요"
                        className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="text-blue-500 font-semibold text-sm px-3"
                      >
                        작성
                      </button>
                    </form>
                  )}

                  {c.replies.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {c.replies.map((r) => {
                        const replyAvatar =
                          r.idBoardWriter ? emojis[0] : emojis[r.replyId % emojis.length];
                        return (
                          <div
                            key={r.replyId}
                            className="p-2 bg-gray-50 rounded-xl border border-gray-100 relative"
                          >
                            <div className="absolute top-2 right-2 flex gap-2 text-gray-400 items-center">
                              <button onClick={() => handleToggleReplyLike(r.replyId)}>
                                <HeartIcon
                                  className={`w-3.5 h-3.5 ${
                                    r.likedByMe
                                      ? 'text-red-500'
                                      : 'text-gray-400'
                                  }`}
                                />
                              </button>
                              <span className="text-xs">{r.likeCount}</span>
                              <button>
                                <ArrowUturnRightIcon className="w-3.5 h-3.5" />
                              </button>
                              {r.anonymousNumber != null && (
                                <button
                                  onClick={() =>
                                    handleSendMessage(
                                      c.commentId,
                                      r.anonymousNumber
                                    )
                                  }
                                >
                                  <PaperAirplaneIcon className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                                {replyAvatar}
                              </div>
                              <span className="font-semibold text-sm text-blue-600">
                                {r.idBoardWriter
                                  ? '작성자'
                                  : `익명${r.anonymousNumber}`}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatDateTime(r.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 mt-1">
                              {r.content}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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
