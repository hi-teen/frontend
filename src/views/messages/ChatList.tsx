'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchMyRooms } from '@/shared/api/message';

interface ChatRoomPreview {
  roomId: number;
  title: string;
  lastMessage: string;
}

const emojis = ['🐶','🐱','🐰','🐻','🐼','🦊','🐯','🦁','🐵','🦄','🐸','🐷','🐥','🦖','🦉','🦦'];
const getEmojiForRoom = (roomId: number) => emojis[roomId % emojis.length];

export default function ChatList() {
  const [chatRooms, setChatRooms] = useState<ChatRoomPreview[]>([]);

  useEffect(() => {
    fetchMyRooms()
      .then((rooms) => {
        setChatRooms(
          rooms.map((room: any) => ({
            roomId: room.roomId,
            title: room.boardTitle,
            lastMessage: room.lastMessage ?? '',
          }))
        );
      })
      .catch(() => setChatRooms([]));
  }, []);

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
