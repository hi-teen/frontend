'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { fetchMessages, sendMessageToRoom, pollMessages } from '@/shared/api/message';
import { fetchMyRooms } from '@/shared/api/board';

const emojis = ['🐶','🐱','🐰','🐻','🐼','🦊','🐯','🦁','🐵','🦄','🐸','🐷','🐥','🦖','🦉','🦦'];
const getEmojiForRoom = (roomId: number) => emojis[roomId % emojis.length];

export default function ChatDetailPage() {
  const { id } = useParams();
  const roomId = Number(id);
  const router = useRouter();

  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [boardInfo, setBoardInfo] = useState<{
    boardId: number;
    boardTitle: string;
    categoryLabel: string;
  } | null>(null);

  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<number>(0);
  const stoppedRef = useRef<boolean>(false);

  // 방 메타 데이터 로드
  useEffect(() => {
    if (isNaN(roomId)) return;
    (async () => {
      try {
        const rooms = await fetchMyRooms();
        const thisRoom = rooms.find((r: any) => r.roomId === roomId);
        if (thisRoom) {
          setBoardInfo({
            boardId: thisRoom.boardId,
            boardTitle: thisRoom.boardTitle,
            categoryLabel: thisRoom.categoryLabel ?? '',
          });
        }
      } catch (e) {
        console.error('[loadRoomMeta] 메타 로드 실패:', e);
        setBoardInfo(null);
      }
    })();
  }, [roomId]);

  // 초기 메시지 로드 + 롱폴링
  useEffect(() => {
    if (isNaN(roomId)) return;
    stoppedRef.current = false;

    async function initAndPoll() {
      try {
        const initial = await fetchMessages(roomId);
        setMessages(initial);
        lastMessageIdRef.current = initial.length
          ? initial[initial.length - 1].messageId
          : 0;
      } catch (e) {
        console.error('[initAndPoll] 초기 로드 에러:', e);
      } finally {
        setLoading(false);
      }

      while (!stoppedRef.current) {
        try {
          const newMsgs = await pollMessages(roomId, lastMessageIdRef.current);
          if (newMsgs.length > 0) {
            setMessages(prev => [...prev, ...newMsgs]);
            lastMessageIdRef.current = newMsgs[newMsgs.length - 1].messageId;
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }
        } catch (e) {
          console.error('[poll] 에러:', e);
        }
        // 타입을 명시적으로 주어 'r'에 any 에러 방지
        await new Promise<void>(resolve => setTimeout(resolve, 1000));
      }
    }

    initAndPoll();
    return () => { stoppedRef.current = true; };
  }, [roomId]);

  // 메시지 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송
  const handleSend = async () => {
    if (isSending) return;
    if (!message.trim() || isNaN(roomId)) return;

    setIsSending(true);
    try {
      await sendMessageToRoom(roomId, message);
      setMessage('');
    } catch (e) {
      console.error('[handleSend] 전송 실패:', e);
      alert('메시지 전송 실패');
    } finally {
      setIsSending(false);
    }
  };

  const profileEmoji = getEmojiForRoom(roomId);

  return (
    <div className="max-w-lg mx-auto h-screen flex flex-col bg-[#f8f8f8]">
      {/* 상단 바 */}
      <div className="px-4 pt-4 flex justify-between items-center">
        <button onClick={() => router.push('/messages')}>
          <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* 원 게시물 정보 */}
      {boardInfo && (
        <div className="mx-4 bg-white rounded-2xl border border-gray-200 p-4 text-sm mb-2">
          <div className="flex items-center gap-2 mb-1">
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

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 text-sm">
        {loading ? (
          <div className="text-center text-gray-400 pt-20">로딩중...</div>
        ) : (
          messages.map((msg, idx) =>
            !msg.isMine ? (
              <div key={msg.messageId || idx} className="flex gap-2 items-end">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mt-1 text-lg">
                  {profileEmoji}
                </div>
                <div>
                  <p className="font-semibold mb-1">{msg.chatNickname || '익명'}</p>
                  <div className="bg-white rounded-xl px-4 py-2 inline-block">
                    {msg.content}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {msg.createdAt?.slice(11,16)}
                  </div>
                </div>
              </div>
            ) : (
              <div key={msg.messageId || idx} className="flex justify-end gap-2 items-end">
                <div className="text-right">
                  <div className="bg-white rounded-xl px-4 py-2 inline-block">
                    {msg.content}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {msg.createdAt?.slice(11,16)}
                  </div>
                </div>
              </div>
            )
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="border-t px-4 py-3 flex gap-2 bg-white">
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={isSending}
        />
        <button
          onClick={handleSend}
          className="text-[#2269FF] font-semibold text-sm px-2"
          disabled={isSending}
        >
          전송
        </button>
      </div>
    </div>
  );
}
