'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { fetchMessages, sendMessageToRoom, pollMessages } from '@/shared/api/message';

const emojis = ['🐶','🐱','🐰','🐻','🐼','🦊','🐯','🦁','🐵','🦄','🐸','🐷','🐥','🦖','🦉','🦦'];
const getEmojiForRoom = (roomId: number) => emojis[roomId % emojis.length];

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = Number(params.id);

  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 임시: 내 id 가져오기 (토큰에서 파싱하거나 context에서)
  const myId = 1; // TODO: 실제 사용자 id로 교체 필요

  useEffect(() => {
    // 채팅방 메시지 불러오기
    fetchMessages(roomId)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [roomId]);

  // 롱폴링 새 메시지 수신
  useEffect(() => {
    if (!messages.length) return;
    let stopped = false;

    async function longPoll() {
      while (!stopped) {
        try {
          const lastId = messages[messages.length - 1]?.messageId || 0;
          const newMsgs = await pollMessages(roomId, lastId);
          if (Array.isArray(newMsgs) && newMsgs.length > 0) {
            setMessages(prev => [...prev, ...newMsgs]);
          }
        } catch (e) {
          // 에러 무시 후 재시도
        }
        await new Promise(res => setTimeout(res, 1000));
      }
    }

    longPoll();
    return () => { stopped = true; };
  }, [roomId, messages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      // TODO: 내 id 불러오기
      await sendMessageToRoom(roomId, myId, message);
      setMessages(prev => [
        ...prev,
        {
          messageId: Date.now(), // 임시
          senderId: myId,
          content: message,
          createdAt: new Date().toISOString(),
          chatNickname: '나',
        }
      ]);
      setMessage('');
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 10);
    } catch (err) {
      alert('메시지 전송 실패');
    }
  };

  // 메시지 스크롤 항상 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const profileEmoji = getEmojiForRoom(roomId);

  return (
    <div className="max-w-lg mx-auto h-screen flex flex-col bg-[#f8f8f8]">
      {/* 상단 바 */}
      <div className="px-4 pt-4 flex justify-between items-center mb-2">
        <button onClick={() => router.push('/messages')}>
          <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 text-sm">
        {loading ? (
          <div className="text-center text-gray-400 pt-20">로딩중...</div>
        ) : (
          messages.map((msg, idx) =>
            msg.senderId !== myId ? (
              <div key={msg.messageId || idx} className="flex gap-2 items-end">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mt-1 text-lg">
                  <span>{profileEmoji}</span>
                </div>
                <div>
                  <p className="font-semibold mb-1">{msg.chatNickname ?? '익명'}</p>
                  <div className="bg-white rounded-xl px-4 py-2 inline-block">{msg.content}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{msg.createdAt?.slice(11,16) ?? ''}</div>
                </div>
              </div>
            ) : (
              <div key={msg.messageId || idx} className="flex justify-end gap-2 items-end">
                <div className="text-right">
                  <div className="bg-white rounded-xl px-4 py-2 inline-block">{msg.content}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{msg.createdAt?.slice(11,16) ?? ''}</div>
                </div>
              </div>
            )
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="fixed bottom-[88px] left-0 right-0 max-w-lg mx-auto bg-white border-t px-4 py-3 flex gap-2">
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="text-[#2269FF] font-semibold text-sm px-2"
        >
          전송
        </button>
      </div>
    </div>
  );
}
