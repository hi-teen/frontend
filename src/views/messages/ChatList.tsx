'use client';

import Link from 'next/link';
import { UserIcon } from '@heroicons/react/24/outline';

const chatRooms = [
  {
    id: 1,
    title: '오늘 축제',
    preview: '혹시 오늘 빨간 모자 쓴 분이신가요?',
  },
  {
    id: 2,
    title: '오늘 축제',
    preview: '혹시 오늘 빨간 모자 쓴 분이신가요?',
  },
  {
    id: 3,
    title: '오늘 축제',
    preview: '혹시 오늘 빨간 모자 쓴 분이신가요?',
  },
];

export default function ChatList() {
  return (
    <div className="px-4 py-4 space-y-4">
      {chatRooms.map((chat) => (
        <Link
          key={chat.id}
          href={`/messages/${chat.id}`}
          className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:bg-gray-50 transition"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="font-semibold text-sm">{chat.title}</p>
            <p className="text-sm text-gray-500">{chat.preview}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
