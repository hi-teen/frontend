import { BoardItem } from './board';

export const fetchMyPosts = async (): Promise<BoardItem[]> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await fetch('https://hiteen.site/api/v1/boards/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('내 게시글 불러오기 실패');
  }

  return res.json();
};

// 내가 작성한 댓글 목록 조회
interface MyCommentItem {
    commentId: number;
    content: string;
    boardId: number;
    boardTitle: string;
    createdDate: string;
  }
  
  export const fetchMyComments = async (): Promise<MyCommentItem[]> => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('토큰 없음');
  
    const res = await fetch('https://hiteen.site/api/v1/comments/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error('내 댓글 불러오기 실패');
    }
  
    return res.json();
  };
  
  // 내가 스크랩한 글 조회
export const fetchMyScraps = async (): Promise<BoardItem[]> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await fetch('https://hiteen.site/api/v1/scraps/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('스크랩 글 불러오기 실패');
  }

  return res.json();
};

export const fetchMyLikes = async (): Promise<BoardItem[]> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await fetch('https://hiteen.site/api/v1/loves/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('좋아요한 글 불러오기 실패');
  }

  return res.json(); // BoardItem[]
};
