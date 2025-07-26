import axios from './axiosInstance';

// 새 쪽지방 생성 + 첫 메시지 보내기
export async function sendAnonymousMessage({
  boardId,
  commentId,
  content,
}: {
  boardId: number;
  commentId?: number;
  content: string;
}) {
  const token = localStorage.getItem('accessToken');
  const payload: any = { boardId, content };
  if (commentId) payload.commentId = commentId;

  const res = await axios.post('/api/v1/messages/send', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data; // roomId 등 반환
}

// 기존 쪽지방에 메시지 전송
export async function sendMessageToRoom(
  roomId: number,
  senderId: number,
  content: string
) {
  const token = localStorage.getItem('accessToken');
  const res = await axios.post(
    `/api/v1/messages/room/${roomId}/send`,
    { senderId, content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.data;
}

// 채팅방 메시지 전체 조회
export async function fetchMessages(roomId: number) {
  const token = localStorage.getItem('accessToken');
  const res = await axios.get(`/api/v1/messages/room/${roomId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
}

// 롱폴링 새 메시지 수신
export async function pollMessages(roomId: number, lastMessageId: number) {
  const token = localStorage.getItem('accessToken');
  const res = await axios.get(`/api/v1/messages/room/${roomId}/poll`, {
    params: { lastMessageId },
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
}

// 내 모든 쪽지방(목록) 조회 (추가)
export async function fetchMyRooms() {
  const token = localStorage.getItem('accessToken');
  const res = await axios.get('/api/v1/messages/rooms/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
}
