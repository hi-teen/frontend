"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

interface ChatRoom {
  id: string;
  title: string;
  lastMessage: string;
  unreadCount: number;
  source: "post" | "comment";
  originalText: string;
  timestamp: Date;
}

export default function MessagesPage() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // 임시 채팅방 데이터
  const chatRooms: ChatRoom[] = [
    {
      id: "1",
      title: "급식 건의사항",
      lastMessage: "급식 메뉴 변경 요청드립니다.",
      unreadCount: 3,
      source: "post",
      originalText: "급식 메뉴에 대한 건의사항이 있습니다...",
      timestamp: new Date("2024-04-03T10:30:00"),
    },
    {
      id: "2",
      title: "동아리 활동",
      lastMessage: "다음 주 동아리 활동 일정입니다.",
      unreadCount: 1,
      source: "comment",
      originalText: "동아리 활동 관련 댓글입니다...",
      timestamp: new Date("2024-04-03T09:15:00"),
    },
    // ... 더 많은 채팅방 데이터 ...
  ];

  // 임시 메시지 데이터
  const messages: Record<string, Message[]> = {
    "1": [
      {
        id: "1",
        content: "안녕하세요, 급식 메뉴 변경 요청드립니다.",
        sender: "student",
        timestamp: new Date("2024-04-03T10:30:00"),
      },
      {
        id: "2",
        content: "네, 어떤 부분을 변경하고 싶으신가요?",
        sender: "admin",
        timestamp: new Date("2024-04-03T10:31:00"),
      },
      {
        id: "3",
        content: "매운 음식이 너무 많아서 조절해주시면 감사하겠습니다.",
        sender: "student",
        timestamp: new Date("2024-04-03T10:32:00"),
      },
    ],
    "2": [
      {
        id: "1",
        content: "다음 주 동아리 활동 일정 공유드립니다.",
        sender: "student",
        timestamp: new Date("2024-04-03T09:15:00"),
      },
      {
        id: "2",
        content: "네, 확인했습니다. 참석하겠습니다.",
        sender: "admin",
        timestamp: new Date("2024-04-03T09:16:00"),
      },
    ],
  };

  const selectedMessages = selectedRoom ? messages[selectedRoom] : [];
  const selectedChatRoom = chatRooms.find((room) => room.id === selectedRoom);

  return (
    <main className='pb-16 max-w-lg mx-auto min-h-screen bg-gray-50'>
      <header className='px-4 py-3 flex items-center gap-4 bg-white sticky top-0 z-50 border-b'>
        <Link href='/'>
          <ArrowLeftIcon className='w-6 h-6' />
        </Link>
        <h1 className='text-xl font-bold'>
          {selectedRoom ? selectedChatRoom?.title : "쪽지함"}
        </h1>
        {selectedRoom && (
          <button
            onClick={() => setSelectedRoom(null)}
            className='ml-auto text-sm text-gray-500 hover:text-gray-700'
          >
            목록으로
          </button>
        )}
      </header>

      <div className='p-4'>
        {!selectedRoom ? (
          // 채팅방 목록
          <div className='space-y-2'>
            {chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className='w-full bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-left'
              >
                <div className='flex justify-between items-start mb-2'>
                  <h3 className='font-medium'>{room.title}</h3>
                  <span className='text-xs text-gray-500'>
                    {format(room.timestamp, "M.d HH:mm", { locale: ko })}
                  </span>
                </div>
                <p className='text-sm text-gray-600 mb-2 line-clamp-1'>
                  {room.lastMessage}
                </p>
                <div className='flex items-center gap-2 text-xs'>
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      room.source === "post"
                        ? "bg-hiteen-pink-100 text-hiteen-pink-400"
                        : "bg-blue-100 text-blue-400"
                    }`}
                  >
                    {room.source === "post" ? "게시글" : "댓글"}
                  </span>
                  {room.unreadCount > 0 && (
                    <span className='bg-hiteen-pink-400 text-white px-2 py-0.5 rounded-full'>
                      {room.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          // 메시지 화면
          <div className='space-y-4'>
            {/* 원문 보기 */}
            <div className='bg-gray-100 p-4 rounded-lg text-sm'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-gray-500'>원문</span>
                <button className='text-hiteen-pink-400 hover:text-hiteen-pink-500'>
                  전체보기
                </button>
              </div>
              <p className='line-clamp-2'>{selectedChatRoom?.originalText}</p>
            </div>

            {/* 메시지 목록 */}
            <div className='space-y-2'>
              {selectedMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "student"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "student"
                        ? "bg-hiteen-pink-400 text-white"
                        : "bg-white"
                    }`}
                  >
                    <p className='text-sm break-words'>{message.content}</p>
                    <span
                      className={`text-xs mt-1 block text-right ${
                        message.sender === "student"
                          ? "text-hiteen-pink-100"
                          : "text-gray-400"
                      }`}
                    >
                      {format(message.timestamp, "HH:mm", { locale: ko })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 메시지 입력 */}
            <div className='fixed bottom-16 left-0 right-0 p-4 bg-white border-t max-w-lg mx-auto'>
              <div className='flex gap-2'>
                <input
                  type='text'
                  placeholder='메시지를 입력하세요'
                  className='flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-hiteen-pink-400'
                />
                <button className='px-4 py-2 bg-hiteen-pink-400 text-white rounded-lg hover:bg-hiteen-pink-500'>
                  전송
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
