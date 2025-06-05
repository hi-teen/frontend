'use client';

import { useState } from 'react';

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function NameInput({ value, onChange }: NameInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full border-b-2 py-2 outline-none text-lg ${
          isFocused ? 'border-[#2269FF]' : 'border-gray-300'
        }`}
        placeholder="이름을 입력하세요"
      />
    </div>
  );
}
