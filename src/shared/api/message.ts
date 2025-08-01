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

  // 백엔드 API 스웨거에 맞게 요청 데이터 구성
  const payload: any = {
    boardId,
    isBoardWriter,
    content,
  };

  // isBoardWriter가 false일 때만 anonymousNumber 포함
  if (!isBoardWriter && anonymousNumber != null) {
    payload.anonymousNumber = anonymousNumber;
  }

  console.log('sendAnonymousMessage 요청 데이터:', payload);

  try {
    const res = await axios.post('/api/v1/messages/send', payload, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    console.log('sendAnonymousMessage 응답:', res.data);
    return res.data.data; // { messageId, roomId, ... }
  } catch (error: any) {
    console.error('sendAnonymousMessage 에러:', error);
    console.error('에러 응답:', error.response?.data);
    console.error('에러 헤더:', error.response?.headers);
    throw new Error(error.response?.data?.header?.message || error.response?.data?.message || '채팅방 생성에 실패했습니다.');
  }
}

// 기존 쪽지방에 메시지 전송
export async function sendMessageToRoom(roomId: number, content: string) {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  // content 역시 빈 문자열이 아닌 문자열이어야 합니다.
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
