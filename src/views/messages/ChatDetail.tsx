'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState, FormEvent } from 'react';
import {
  fetchMessages,
  sendAnonymousMessage,
  sendMessageToRoom,
  pollMessages,
  fetchMyRooms,
} from '@/shared/api/message';

interface ChatMessage {
  messageId: number;
  roomId: number;
  content: string;
  createdAt: string;
  chatNickname?: string;
  isMine: boolean;
}

const EMOJIS = [
  '🐶','🐱','🐰','🐻','🐼','🦊','🐯','🦁',
  '🐵','🦄','🐸','🐷','🐥','🦖','🦉','🦦',
];
const getEmojiFor = (roomId: number) => EMOJIS[roomId % EMOJIS.length];

export default function ChatDetailPage() {
  const { id } = useParams();
  const search = useSearchParams();
  const router = useRouter();

  // 신규 대화 여부 판단
  const boardIdParam = search.get('boardId');
  const isNew = boardIdParam !== null;
  const boardId = isNew ? Number(boardIdParam) : undefined;
  const isBoardWriter = isNew ? search.get('isBoardWriter') === 'true' : undefined;
  const anonymousNumber =
    isNew && search.get('anonymousNumber')
      ? Number(search.get('anonymousNumber'))
      : undefined;

  // 실제 방 ID (신규면 null)
  const [roomId, setRoomId] = useState<number | null>(
    isNew ? null : Number(id)
  );

  // 원 게시물 메타
  const [boardInfo, setBoardInfo] = useState<{
    boardId: number;
    boardTitle: string;
    categoryLabel: string;
  } | null>(null);

  // 채팅 메시지 목록
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');

  const endRef = useRef<HTMLDivElement>(null);
  const lastIdRef = useRef<number>(0);

  // — 원 게시물 메타 로드
useEffect(() => {
  if (roomId == null) return;
  fetchMyRooms()
    .then((rooms: {
      roomId: number;
      boardId: number;
      boardTitle: string;
      categoryLabel?: string;
    }[]) => {
      const rm = rooms.find((r) => r.roomId === roomId);
      if (rm) {
        setBoardInfo({
          boardId: rm.boardId,
          boardTitle: rm.boardTitle,
          categoryLabel: rm.categoryLabel ?? '',
        });
      }
    })
    .catch(() => {});
}, [roomId]);


  // — 기존 방 메시지 최초 로드
  useEffect(() => {
    if (roomId == null) {
      setLoading(false);
      return;
    }
    fetchMessages(roomId)
      .then(list => {
        setMessages(list);
        lastIdRef.current = list.length
          ? list[list.length - 1].messageId
          : 0;
      })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [roomId]);

  // — 롱폴링 (messages deps 제거)
  useEffect(() => {
    if (roomId == null || loading) return;
    let stopped = false;

    (async function pollLoop() {
      while (!stopped) {
        try {
          const newMsgs = (await pollMessages(roomId, lastIdRef.current)) as ChatMessage[];
          if (newMsgs.length) {
            setMessages(prev => {
              const uniq = newMsgs.filter((nm: ChatMessage) =>
                !prev.some(m => m.messageId === nm.messageId)
              );
              if (uniq.length) {
                lastIdRef.current = uniq[uniq.length - 1].messageId;
                return [...prev, ...uniq];
              }
              return prev;
            });
          }
        } catch {
          // ignore
        }
        // r의 타입을 void로 명시
        await new Promise<void>((r: () => void) => setTimeout(r, 1000));
      }
    })();

    return () => {
      stopped = true;
    };
  }, [roomId, loading]);

  // — 메시지 바뀔 때마다 스크롤 맨 아래
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // — 메시지 전송 처리
  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();
    const txt = input.trim();
    if (!txt) return;

    if (roomId == null && isNew) {
      const result = await sendAnonymousMessage({
        boardId: boardId!,
        isBoardWriter: isBoardWriter!,
        content: txt,
        ...(isBoardWriter! ? {} : { anonymousNumber: anonymousNumber! }),
      });
      setRoomId(result.roomId);
      router.replace(`/messages/${result.roomId}`);
      setMessages([result]);
      lastIdRef.current = result.messageId;
    } else if (roomId != null) {
      await sendMessageToRoom(roomId, txt);
    }

    setInput('');
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const emoji = roomId != null ? getEmojiFor(roomId) : '💬';

  return (
    <div className="max-w-lg mx-auto h-screen flex flex-col bg-[#f8f8f8]">
      {/* 상단바 */}
      <div className="px-4 pt-4 flex items-center gap-4">
        <button onClick={() => router.push('/messages')}>
          <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* 원 게시물 보기 */}
      {boardInfo && (
        <div className="mx-4 bg-white rounded-2xl border border-gray-200 p-4 text-sm mb-2">
          <div className="flex items-center mb-1">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              {boardInfo.categoryLabel || '게시판'}
            </span>
          </div>
          <p className="font-semibold">{boardInfo.boardTitle}</p>
          <div
            className="mt-3 py-2 px-4 bg-gray-50 text-center text-sm text-gray-500 rounded-xl cursor-pointer"
            onClick={() => router.push(`/board/${boardInfo.boardId}`)}
          >
            게시물 바로가기
          </div>
        </div>
      )}

      {/* 메시지 리스트 */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 text-sm">
        {loading ? (
          <div className="text-center text-gray-400 pt-20">로딩중…</div>
        ) : (
          messages.map((m, idx) =>
            m.isMine ? (
              <div
                key={m.messageId ?? idx}
                className="flex justify-end gap-2 items-end"
              >
                <div className="text-right">
                  <div className="bg-white rounded-xl px-4 py-2 inline-block whitespace-pre-wrap">
                    {m.content}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {m.createdAt.slice(11, 16)}
                  </div>
                </div>
              </div>
            ) : (
              <div key={m.messageId ?? idx} className="flex gap-2 items-end">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mt-1 text-lg">
                  {emoji}
                </div>
                <div>
                  <p className="font-semibold mb-1">
                    {m.chatNickname ?? '익명'}
                  </p>
                  <div className="bg-white rounded-xl px-4 py-2 inline-block whitespace-pre-wrap">
                    {m.content}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {m.createdAt.slice(11, 16)}
                  </div>
                </div>
              </div>
            )
          )
        )}
        <div ref={endRef} />
      </div>

      {/* 입력창 */}
      <form
        onSubmit={handleSend}
        className="border-t px-4 py-3 flex gap-2 bg-white"
      >
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="text-[#2269FF] font-semibold text-sm px-2"
        >
          전송
        </button>
      </form>
    </div>
  );
}
