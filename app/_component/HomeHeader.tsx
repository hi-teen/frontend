'use client';
import Link from "next/link";
import Image from "next/image";
import {
  MagnifyingGlassIcon,
  BellIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export default function HomeHeader() {
  return (
    <header className='px-4 pt-5 pb-3 flex justify-between items-start bg-gray-50 sticky top-0 z-50'>
      <div className='flex flex-col'>
        <Link href='/'>
          <Image src='/hiteen.svg' alt='HiTeen 로고' width={72} height={24} priority />
        </Link>
        <span className='text-xl font-bold mt-1'>한국고등학교</span>
      </div>

      <div className='flex items-center gap-4 mt-3'>
        <button>
          <PlusIcon className='w-6 h-6 text-gray-400' />
        </button>
        <button>
          <MagnifyingGlassIcon className='w-6 h-6 text-gray-400' />
        </button>
        <button className='relative'>
          <BellIcon className='w-6 h-6 text-gray-400' />
          <span className='absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center'>
            6
          </span>
        </button>
      </div>
    </header>
  );
}
