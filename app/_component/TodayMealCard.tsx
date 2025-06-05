'use client';
import Image from "next/image";

interface TodayMealCardProps {
  formattedDate: string;
  todayMeals: {
    lunch: string[];
    dinner: string[];
  };
}

export default function TodayMealCard({ formattedDate, todayMeals }: TodayMealCardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 mt-4 px-4">
      <div className="w-full bg-white border-[1.5px] border-[#E9F0FF] p-4 rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Image src='/lunchbox.png' alt='급식 아이콘' width={40} height={40} />
            <div>
              <h3 className='text-lg font-bold'>오늘의 급식</h3>
              <p className='text-xs text-gray-500 mt-0.5'>{formattedDate}</p>
            </div>
          </div>
          <span className='text-sm text-[#525252] font-semibold translate-y-2.5 -translate-x-2 block'>
            이번달 급식표
          </span>
        </div>
        <div className='space-y-3 pl-4'>
          <div>
            <span className='text-xs font-semibold text-[#2E71FF] border border-[#2E71FF] bg-white px-3 py-1 rounded-md inline-block mb-1'>중식</span>
            <p className='text-sm text-gray-800 mt-1 font-semibold'>{todayMeals.lunch.join(", ")}</p>
          </div>
          <div>
            <span className='text-xs font-semibold text-[#2E71FF] border border-[#2E71FF] bg-white px-3 py-1 rounded-md inline-block mb-1 mt-1'>석식</span>
            <p className='text-sm text-gray-800 mt-1 font-semibold'>{todayMeals.dinner.join(", ")}</p>
          </div>
        </div>
        <div className='flex justify-center gap-1 mt-4'>
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#5A8FFF] opacity-60' : 'bg-[#D9D9D9]'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
