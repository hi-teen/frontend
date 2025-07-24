'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

// 내 ID는 1, 상대방은 2로 목업
const MY_ID = 1;
const OTHER_ID = 2;

// 사용할 이모지 목록
const emojis = ['🐶', '🐱', '🐰', '🐻', '🐼', '🦊', '🐯', '🦁', '🐵', '🦄', '🐸', '🐷', '🐥', '🦖', '🦉', '🦦'];

// 같은 방이면 같은 이모지로(방 번호가 다르면 바뀜)
const getEmojiForRoom = (roomId: number) => emojis[roomId % emojis.length];

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  // detail 채팅방 이모지 결정
  const profileEmoji = getEmojiForRoom(id);

  const initialMessages = [
    {
      id: 1,
      senderId: OTHER_ID,
      nickname: '익명',
      content: '안녕하세요 😊',
      time: '13:11',
    },
    {
      id: 2,
      senderId: MY_ID,
      nickname: '',
      content: '안녕하세요 😊',
      time: '13:15',
    },
    {
      id: 3,
      senderId: OTHER_ID,
      nickname: '익명',
      content: '혹시 오늘 빨간 모자 쓴 분이신가요?',
      time: '13:19',
    },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      const now = new Date();
      const time =
        now.getHours().toString().padStart(2, '0') +
        ':' +
        now.getMinutes().toString().padStart(2, '0');
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          senderId: MY_ID,
          nickname: '',
          content: message,
          time,
        },
      ]);
      setMessage('');
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

      {/* 날짜 */}
      <div className="flex justify-center mb-2">
        <span className="text-xs text-white bg-gray-400 px-3 py-1 rounded-full">25.05.05</span>
      </div>

      {/* 게시글 정보 */}
      <div className="mx-4 bg-white rounded-2xl border border-gray-200 p-4 text-sm mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">비밀게시판</span>
        </div>
        <p className="font-semibold">오늘 축제</p>
        <div className="mt-3 py-2 px-4 bg-gray-50 text-center text-sm text-gray-500 rounded-xl">
          게시물 바로가기
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 text-sm">
        {messages.map((msg) =>
          msg.senderId === OTHER_ID ? (
            <div key={msg.id} className="flex gap-2 items-end">
              {/* 이모지 프로필 */}
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mt-1 text-lg">
                <span>{profileEmoji}</span>
              </div>
              <div>
                <p className="font-semibold mb-1">{msg.nickname}</p>
                <div className="bg-white rounded-xl px-4 py-2 inline-block">{msg.content}</div>
                <div className="text-[10px] text-gray-400 mt-1">{msg.time}</div>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex justify-end gap-2 items-end">
              <div className="text-right">
                <div className="bg-white rounded-xl px-4 py-2 inline-block">{msg.content}</div>
                <div className="text-[10px] text-gray-400 mt-1">{msg.time}</div>
              </div>
            </div>
          )
        )}
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
