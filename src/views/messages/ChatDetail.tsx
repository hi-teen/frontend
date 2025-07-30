'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  fetchMessages,
  sendAnonymousMessage,
  sendMessageToRoom,
  pollMessages,
  fetchMyRooms,
} from '@/shared/api/message';
import { fetchBoardDetail } from '@/shared/api/board';

interface ChatMessage {
  messageId: number;
  roomId: number;
  content: string;
  createdAt: string;
  chatNickname?: string;
  isMine: boolean;
}

interface BoardMeta {
  boardId: number;
  boardTitle: string;
  categoryLabel: string;
}

const EMOJIS = [
  '🐶','🐱','🐰','🐻','🐼','🦊','🐯','🦁',
  '🐵','🦄','🐸','🐷','🐥','🦖','🦉','🦦',
];
const pickEmoji = (roomId: number) => EMOJIS[roomId % EMOJIS.length];

export default function ChatDetailPage() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();

  const paramId = params.id;
  const queryBoardId = search.get('boardId');
  const queryIsWriter = search.get('isBoardWriter') === 'true';
  const queryAnon = search.get('anonymousNumber');

  const isNewChat = !!queryBoardId;
  const initialRoomId = isNewChat ? null : Number(paramId);

  const [roomId, setRoomId] = useState<number | null>(initialRoomId);
  const [boardMeta, setBoardMeta] = useState<BoardMeta | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');

  const endRef = useRef<HTMLDivElement>(null);
  const lastMsgRef = useRef<number>(0);

  useEffect(() => {
    if (isNewChat && queryBoardId) {
      fetchBoardDetail(Number(queryBoardId))
        .then(b => {
          setBoardMeta({
            boardId: b.id,
            boardTitle: b.title,
            categoryLabel: b.categoryLabel,
          });
        })
        .catch(() => {});
    } else if (!isNewChat && roomId != null) {
      fetchMyRooms().then((rooms: Array<{ roomId: number; boardId: number; boardTitle: string; categoryLabel?: string }>) => {
        const room = rooms.find((r) => r.roomId === roomId);
        if (room) {
          setBoardMeta({
            boardId: room.boardId,
            boardTitle: room.boardTitle,
            categoryLabel: room.categoryLabel ?? '',
          });
        }
      }).catch(() => {});
    }
  }, [isNewChat, queryBoardId, roomId]);

  useEffect(() => {
    if (roomId == null) {
      setLoading(false);
      return;
    }
    fetchMessages(roomId)
      .then((list: ChatMessage[]) => {
        setMessages(list);
        lastMsgRef.current = list.length ? list[list.length - 1].messageId : 0;
      })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [roomId]);

  useEffect(() => {
    if (roomId == null || loading) return;
    let stopped = false;
    (async function loop() {
      while (!stopped) {
        try {
          const newList = await pollMessages(roomId, lastMsgRef.current);
          const uniq = newList.filter((nm: ChatMessage) => !messages.some((m) => m.messageId === nm.messageId));
          if (uniq.length) {
            setMessages(prev => [...prev, ...uniq]);
            lastMsgRef.current = uniq[uniq.length - 1].messageId;
          }
        } catch {}
        await new Promise(r => setTimeout(r, 1000));
      }
    })();
    return () => { stopped = true; };
  }, [roomId, loading, messages]);

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();
    const txt = input.trim();
    if (!txt) return;

    if (roomId == null && isNewChat && queryBoardId) {
      const anonNum = queryAnon ? Number(queryAnon) : undefined;
      const first = await sendAnonymousMessage({
        boardId: Number(queryBoardId),
        isBoardWriter: queryIsWriter,
        content: txt,
        ...(queryIsWriter ? {} : { anonymousNumber: anonNum ?? 0 }),
      });
      setRoomId(first.roomId);
      router.replace(`/messages/${first.roomId}`);
      setMessages([first]);
      lastMsgRef.current = first.messageId;
    } else if (roomId != null) {
      await sendMessageToRoom(roomId, txt);
      setMessages(prev => [
        ...prev,
        {
          messageId: Date.now(),
          roomId,
          content: txt,
          createdAt: new Date().toISOString(),
          chatNickname: '나',
          isMine: true,
        }
      ]);
    }

    setInput('');
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const emoji = roomId != null ? pickEmoji(roomId) : '💬';

  return (
    <div className="max-w-lg mx-auto h-screen flex flex-col bg-[#f8f8f8]">
      {/* 상단 */}
      <div className="px-4 pt-4 flex items-center gap-4">
        <button onClick={() => router.push('/messages')}>
          <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* 게시물 바로가기 (수정 완료) */}
      {boardMeta && (
        <div className="mx-4 bg-white rounded-2xl border p-4 mb-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{boardMeta.categoryLabel}</span>
          <p className="font-semibold mt-2">{boardMeta.boardTitle}</p>
          <button className="mt-3 w-full py-2 bg-gray-50 rounded-xl text-gray-500" onClick={() => router.push(`/board/${boardMeta.boardId}`)}>
            게시물 바로가기
          </button>
        </div>
      )}
      
      {/* 이하 동일 */}
    </div>
  );
}
