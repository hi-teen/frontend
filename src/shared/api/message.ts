import axios from './axiosInstance';

export interface SendAnonymousMessageParams {
  boardId: number;
  isBoardWriter: boolean;
  anonymousNumber?: number | null;
  content: string;
}

// 새 쪽지방 생성 + 첫 메시지 보내기
export async function sendAnonymousMessage({
  boardId,
  isBoardWriter,
  anonymousNumber,
  content,
}: SendAnonymousMessageParams) {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  // payload 타입도 null 허용
  const payload: {
    boardId: number;
    isBoardWriter: boolean;
    content: string;
   anonymousNumber?: number | null;
  } = { boardId, isBoardWriter, content };

  // isBoardWriter가 false이고 anonymousNumber가 null이 아닐 때만 포함
  if (!isBoardWriter && anonymousNumber != null) {
    payload.anonymousNumber = anonymousNumber;
  }

  const res = await axios.post('/api/v1/messages/send', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data; // { messageId, roomId, ... }
}

// 기존 쪽지방에 메시지 전송
export async function sendMessageToRoom(roomId: number, content: string) {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const payload = { content };
  const res = await axios.post(
    `/api/v1/messages/room/${roomId}/send`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.data;
}

// 채팅방 메시지 전체 조회
export async function fetchMessages(roomId: number) {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await axios.get(`/api/v1/messages/room/${roomId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
}

// 롱폴링 새 메시지 수신
export async function pollMessages(roomId: number, lastMessageId: number) {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await axios.get(`/api/v1/messages/room/${roomId}/poll`, {
    params: { lastMessageId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
}

// 내 모든 쪽지방(목록) 조회
export async function fetchMyRooms() {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await axios.get('/api/v1/messages/rooms', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
}
