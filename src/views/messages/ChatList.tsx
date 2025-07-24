'use client';

import Link from 'next/link';

interface ChatRoomPreview {
  roomId: number;
  title: string;        // 보드 제목
  lastMessage: string;  // 마지막 채팅
}

export default function ChatList() {
  // 사용할 이모지들
  const emojis = ['🐶', '🐱', '🐰', '🐻', '🐼', '🦊', '🐯', '🦁', '🐵', '🦄', '🐸', '🐷', '🐥', '🦖', '🦉', '🦦'];

  // 하드코딩 데이터
  const chatRooms: ChatRoomPreview[] = [
    {
      roomId: 1,
      title: '오늘의 점심 추천',
      lastMessage: '점심 뭐 먹을지 고민되네요 ㅎㅎ',
    },
    {
      roomId: 2,
      title: '익명고민',
      lastMessage: '정말 감사해요! 덕분에 힘이 났어요.',
    },
    {
      roomId: 3,
      title: '졸업 앨범 사진',
      lastMessage: '오늘 촬영 사진 다들 잘 나왔어요!',
    },
  ];

  // 각 채팅방마다 고유하게 랜덤 이모지 할당 (roomId 기준으로 고정)
  const getEmojiForRoom = (roomId: number) => {
    // 해시처럼 매핑 (roomId로 고정)
    return emojis[roomId % emojis.length];
  };

  return (
    <div className="px-4 py-4 space-y-4">
      {chatRooms.length === 0 && (
        <div className="text-center text-gray-400 py-12">아직 채팅방이 없습니다.</div>
      )}
      {chatRooms.map((chat) => (
        <Link
          key={chat.roomId}
          href={`/messages/${chat.roomId}`}
          className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:bg-gray-50 transition"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-gray-100 text-2xl">
            {/* 이모지 랜덤 할당 */}
            <span>{getEmojiForRoom(chat.roomId)}</span>
          </div>
          <div>
            <p className="font-semibold text-base">{chat.title}</p>
            <p className="text-sm text-gray-500 truncate max-w-[170px]">{chat.lastMessage}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
