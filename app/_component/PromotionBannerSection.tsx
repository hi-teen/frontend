'use client';

export default function PromotionBannerSection() {
  return (
    <div className='px-4 mb-8'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>교내 홍보</h2>
        <button className='text-[#417EFF] text-sm font-semibold whitespace-nowrap'>더 보기 &gt;</button>
      </div>
      <div className='flex gap-3 overflow-x-auto hide-scrollbar'>
        {[1, 2, 3].map((_, idx) => (
          <div key={idx} className='w-[160px] h-[180px] rounded-xl bg-white flex-shrink-0' />
        ))}
      </div>
    </div>
  );
}
