'use client';

import Image from "next/image";

export default function QuickMenu() {
  return (
    <div className='flex gap-3 px-4 py-6 items-center overflow-x-auto hide-scrollbar'>
      {/* 학교 홈 버튼 */}
      <button className='flex flex-col items-center gap-1 min-w-[4rem]'>
        <div className='w-[60px] h-[60px] bg-[#E9F0FF] rounded-[10px] flex items-center justify-center'>
          <Image src='/homeicon.png' alt='학교 홈' width={40} height={40} />
        </div>
        <span className='text-xs text-[#656565] font-semibold whitespace-nowrap'>학교 홈</span>
      </button>

      {/* 다음 수업 위젯 */}
    <div className='flex-1 bg-[#E9F0FF] rounded-[10px] px-4 py-3 flex flex-col justify-between h-[72px]'>
    <span className='text-xs text-[#656565] font-semibold mb-1'>다음 수업</span>
    <div className='flex justify-between items-end flex-1'>
        <span className='text-lg font-bold text-[#2269FF]'>수학</span>
        <span className='text-xs text-gray-500'>3교시 · 10:40</span>
    </div>
    </div>
    </div>
  );
}
