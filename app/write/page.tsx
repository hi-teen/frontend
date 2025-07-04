'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import BoardSelectModal from '../board/_component/BoardSelectModal';

const boards = [
  { key: 'FREE', label: '자유게시판' },
  { key: 'SECRET', label: '비밀게시판' },
  { key: 'INFORMATION', label: '정보게시판' },
  { key: 'GRADE1', label: '1학년게시판' },
  { key: 'GRADE2', label: '2학년게시판' },
  { key: 'GRADE3', label: '3학년게시판' },
];

export default function PostWritePage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState('게시판 선택');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleSubmit = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!title || !content || selectedBoard === '게시판 선택') {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const boardObj = boards.find((b) => b.label === selectedBoard || b.key === selectedBoard);
    const category = boardObj?.key ?? selectedBoard;

    try {
      const res = await fetch('https://hiteen.site/api/v1/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          category,
          disclosureStatus: isAnonymous ? 'ANONYMOUS' : 'PUBLIC',
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('[게시글 등록 실패]', errorText);
        alert('게시글 등록 실패');
        return;
      }

      alert('게시글이 등록되었습니다');
      router.push('/board');
    } catch (error) {
      console.error('[에러]', error);
      alert('오류가 발생했습니다');
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-white pb-[112px]">
      {/* 상단 고정영역 */}
      <div className="shrink-0 flex items-center justify-between px-4 py-4 border-b">
        <button onClick={() => router.back()}>
          <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
        </button>
        <h1 className="text-base font-semibold">글쓰기</h1>
        <div className="w-5 h-5" />
      </div>
      <div className="shrink-0 px-4 pt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full text-left text-sm font-medium px-4 py-3 border rounded-lg text-gray-600"
        >
          {selectedBoard}
        </button>
      </div>
      <div className="shrink-0 px-4 mt-4">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          className="w-full border-b text-sm py-2 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {/* 내용 입력/워터마크: flex-1 min-h-0 */}
      <div className="flex-1 min-h-0 flex flex-col px-4 mt-4">
        <div className="relative flex-1 min-h-0 flex flex-col">
          {/* 워터마크: 내용이 없을 때만 */}
          {(!content || content.length === 0) && (
            <div
              className="
                pointer-events-none
                absolute
                top-0 left-0 right-0 bottom-0
                flex items-end
                text-xs text-gray-300 z-10 select-none leading-relaxed
                pl-4 pb-4
              "
              style={{ userSelect: "none" }}
            >
              <ul className="space-y-1 text-left">
                <li>욕설, 비하, 차별, 혐오, 음란물 등의 게시물 금지</li>
                <li>타인의 권리를 침해하거나 불쾌감을 줄 수 있는 내용 금지</li>
                <li>타인 사칭, 허위정보, 광고 게시물 금지</li>
              </ul>
            </div>
          )}
          <textarea
            placeholder="내용을 입력하세요"
            className="
              w-full h-full text-sm p-4 border rounded-md outline-none
              bg-transparent relative z-20 placeholder-gray-400 resize-none
            "
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              height: "100%",
              minHeight: 450,
              maxHeight: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>
      {/* 하단 고정: 익명 작성 + 등록버튼 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto flex items-center px-4 pb-6 pt-3 bg-white z-50 gap-3">
        <label className="flex items-center gap-2 mr-auto select-none">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={() => setIsAnonymous((prev) => !prev)}
            className="w-4 h-4 accent-blue-500"
          />
          <span className="text-sm text-gray-700">익명</span>
        </label>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg"
        >
          등록
        </button>
      </div>
      {/* 게시판 선택 모달 */}
      <BoardSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selected={selectedBoard}
        onSelect={setSelectedBoard}
      />
    </div>
  );
}
