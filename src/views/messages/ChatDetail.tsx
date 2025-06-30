'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchMessages, sendMessageToRoom } from '@/shared/api/message';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = Number(params.id);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!roomId) return;
    fetchMessages(roomId)
      .then((data) => setMessages(data))
      .catch(console.error);
  }, [roomId]);

  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      // senderId는 백엔드에서 자동 처리된다고 가정
      await sendMessageToRoom(roomId, message, 0); // senderId는 필요시 제거
      const newMessages = await fetchMessages(roomId);
      setMessages(newMessages);
      setMessage('');
    } catch (e) {
      console.error('메시지 전송 실패', e);
    }
  };

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
        {messages.map((msg) => (
          <div
            key={msg.messageId}
            className={`flex ${msg.isMine ? 'justify-end' : 'gap-2 items-end'}`}
          >
            {!msg.isMine && (
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mt-1">
                <Image src="/usericon.png" alt="user" width={16} height={16} />
              </div>
            )}
            <div className={msg.isMine ? 'text-right' : ''}>
              {!msg.isMine && (
                <p className="font-semibold mb-1">익명{msg.anonymousNumber ?? ''}</p>
              )}
              <div className="bg-white rounded-xl px-4 py-2 inline-block">{msg.content}</div>
              <div className="text-[10px] text-gray-400 mt-1">{msg.createdDate}</div>
            </div>
          </div>
        ))}
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
