export interface BoardItem {
    id: number;
    title: string;
    content: string;
    writer: string;
    category: string;   
    categoryLabel: string;
    loveCount: number;
    scrapCount: number;
    createdDate: string;
  }
  
  // 전체 게시글 목록 조회
  export const fetchBoards = async (): Promise<BoardItem[]> => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('토큰 없음');
  
    const res = await fetch('https://hiteen.site/api/v1/boards', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error('게시글 불러오기 실패');
    }
  
    return res.json();
  };
  
  // 게시글 상세 조회
  export const fetchBoardDetail = async (boardId: number): Promise<BoardItem> => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('토큰 없음');
  
    const res = await fetch(`https://hiteen.site/api/v1/boards/${boardId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error('상세 게시글 조회 실패');
  
    return res.json();
  };
  
  export const toggleLove = async (boardId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('토큰 없음');
  
    const res = await fetch(`https://hiteen.site/api/v1/loves?boardId=${boardId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error('좋아요 요청 실패');
    }
  
    return res.text();
  };
  
  export const toggleScrap = async (boardId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('토큰 없음');
  
    const res = await fetch(`https://hiteen.site/api/v1/scraps?boardId=${boardId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error('스크랩 실패');
  };
  
  // 내가 작성한 게시글 목록 조회
  export const fetchMyPosts = async (): Promise<BoardItem[]> => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('토큰 없음');
  
    const res = await fetch(`https://hiteen.site/api/v1/boards/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error('내 글 목록 불러오기 실패');
    }
  
    return res.json();
  };
  