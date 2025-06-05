'use client';
import Image from "next/image";

const menus = [
  { src: '/homeicon.png', label: '학교 홈' },
  { src: '/announcement.png', label: '학사공지' },
  { src: '/library.png', label: '도서관' },
  { src: '/bus.png', label: '셔틀버스' },
  { src: '/schedule.png', label: '학사일정' },
];

export default function QuickMenu() {
  return (
    <div className='grid grid-cols-5 gap-2 px-4 py-6 overflow-x-auto hide-scrollbar'>
      {menus.map(({ src, label }) => (
        <button key={label} className='flex flex-col items-center gap-1 min-w-[4rem]'>
          <div className='w-[72px] h-[72px] bg-[#E9F0FF] rounded-[10px] flex items-center justify-center'>
            <Image src={src} alt={label} width={44} height={44} />
          </div>
          <span className='text-xs text-[#656565] font-semibold whitespace-nowrap'>{label}</span>
        </button>
      ))}
    </div>
  );
}
