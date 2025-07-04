'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { sendAnonymousMessage, sendMessageToRoom, fetchMessages } from '@/shared/api/message';
import { useUserId } from '@/entities/auth/hooks/useUserId';

export default function ChatDetailPage() {
  // URL 파라미터 (roomId는 [id], 그 외는 쿼리스트링)
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // /messages/[id] 라우트면 roomId, /messages/chat?receiverId=... 면 roomId 없음
  const roomId = params.id ? Number(params.id) : undefined;

  // 쿼리스트링에서 받는 값들
  const receiverId = Number(searchParams.get('receiverId'));
  const boardId = Number(searchParams.get('boardId'));
  const commentId = searchParams.get('commentId')
    ? Number(searchParams.get('commentId'))
    : undefined;

  // 로그인 유저(memberId) 가져오기(커스텀 훅, 예시)
  const senderId = useUserId() || 0;

  // 채팅 상태
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // roomId 있을 때 메시지 불러오기
  useEffect(() => {
    if (roomId) {
      fetchMessages(roomId)
        .then(setMessages)
        .catch(console.error);
    } else {
      setMessages([]); // 임시방(처음 진입)일 땐 빈 배열
    }
  }, [roomId]);

  // 채팅 전송
  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      if (!roomId) {
        // 첫 메시지: 방 생성 + 메시지 전송
        const res = await sendAnonymousMessage({
          boardId,
          content: message,
          commentId,
        });
        const { roomId: newRoomId } = res;
        // 첫 메시지 후에는 새 roomId로 교체(리로드)
        router.replace(`/messages/${newRoomId}`);
      } else {
        // 기존방: 메시지만 전송
        await sendMessageToRoom(roomId, senderId, message);
        const newMessages = await fetchMessages(roomId);
        setMessages(newMessages);
      }
      setMessage('');
    } catch (e) {
      alert('메시지 전송 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto h-screen flex flex-col bg-[#f8f8f8]">
      {/* 상단바(뒤로가기 등, 필요시 추가) */}
      <div className="px-4 pt-4 flex justify-between items-center mb-2">
        <button onClick={() => router.back()}>
          <span className="text-gray-400">{'<'} 뒤로</span>
        </button>
        <span className="font-bold text-base">
          {roomId ? `쪽지방 #${roomId}` : '새 쪽지'}
        </span>
        <span></span>
      </div>
      {/* 채팅 메시지 리스트 */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 text-sm">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-8">아직 메시지가 없습니다.</div>
        )}
        {messages.map((msg) => (
          <div key={msg.messageId} className={`flex ${msg.senderId === senderId ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`bg-white rounded-xl px-4 py-2 mb-1 max-w-xs ${
                msg.senderId === senderId ? 'bg-blue-50' : ''
              }`}
            >
              <span>{msg.content}</span>
            </div>
          </div>
        ))}
      </div>
      {/* 입력창 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t px-4 py-3 flex gap-2">
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={message}
          disabled={loading}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
        />
        <button
          onClick={handleSend}
          disabled={loading || !message.trim()}
          className="text-[#2269FF] font-semibold text-sm px-2"
        >
          전송
        </button>
      </div>
    </div>
  );
}
