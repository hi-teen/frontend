import axios from 'axios';

export async function sendAnonymousMessage({
  boardId,
  commentId,
  anonymousNumber,
  content,
}: {
  boardId: number;
  commentId?: number;
  anonymousNumber: number;
  content: string;
}) {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const saved = localStorage.getItem('signupProfile');
  const backup = saved ? JSON.parse(saved) : {};
  const senderId = backup.memberId;

  if (!senderId) {
    throw new Error('senderId가 없습니다.');
  }

  const body: Record<string, any> = {
    boardId,
    anonymousNumber,
    content,
    senderId,
  };

  if (commentId !== undefined) {
    body.commentId = commentId;
  }

  const res = await axios.post('https://hiteen.site/api/v1/messages/send', body, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return res.data?.data;
}

export async function fetchMessages(roomId: number) {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('로그인이 필요합니다.');

  const res = await axios.get(`https://hiteen.site/api/v1/messages/room/${roomId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
}

export async function pollMessages(roomId: number, lastMessageId: number) {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('로그인이 필요합니다.');

  const res = await axios.get(`https://hiteen.site/api/v1/messages/room/${roomId}/poll`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { lastMessageId },
  });

  return res.data.data;
}

export async function sendMessageToRoom(roomId: number, content: string, senderId: number) {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('로그인이 필요합니다.');

  const res = await axios.post(`https://hiteen.site/api/v1/messages/room/${roomId}/send`, {
    senderId,
    content,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return res.data.data;
}
