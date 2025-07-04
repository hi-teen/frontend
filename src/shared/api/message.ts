import axios from './axiosInstance';

export async function sendAnonymousMessage({
    boardId,
    commentId,
    content,
  }: {
    boardId: number;
    commentId?: number;
    content: string;
  }) {
    const payload: any = { boardId, content };
    if (commentId) payload.commentId = commentId;
    const res = await fetch('/api/v1/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return (await res.json()).data;
  }

// 기존방 메시지 전송
export async function sendMessageToRoom(
  roomId: number,
  senderId: number,
  content: string
) {
  const res = await axios.post(`/api/v1/messages/room/${roomId}/send`, {
    senderId,
    content,
  });
  return res.data.data;
}

// 채팅방 메시지 조회
export async function fetchMessages(roomId: number) {
  const res = await axios.get(`/api/v1/messages/room/${roomId}`);
  return res.data.data;
}
