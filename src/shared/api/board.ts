export interface BoardItem {
    id: number;
    title: string;
    content: string;
    board: string; // 게시판 구분을 위한 필드
    loveCount: number;
    scrapCount: number;
    createdDate: string;
  }
  
  //게시글 전체 조회
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
export const fetchBoardDetail = async (boardId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('토큰 없음');
  
    const res = await fetch(`https://hiteen.site/api/v1/boards/${boardId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error('상세 게시글 조회 실패');
  
    return res.json(); // { id, title, content, loveCount, scrapCount, createdDate }
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
  