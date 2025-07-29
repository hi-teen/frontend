'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ProfileLayout from '../layout';

type FAQItem = {
  q: string;
  a: React.ReactNode;
};

type FAQCategory = {
  title: string;
  items: FAQItem[];
};

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    title: '내 계정',
    items: [
      {
        q: '1. 학교가 바뀌었는데 변경할 수 없나요?',
        a: (
          <p>
            회원가입 시 선택한 학교는 가입 이후 변경할 수 없습니다.
            다른 학교로 변경을 원하실 경우 현재 사용하시는 계정을 탈퇴하신 후
            새로운 학교로 다시 회원가입을 해주시기 바랍니다.
          </p>
        ),
      },
      {
        q: '2. 해당 학생이 아닌데 이용할 수 있나요?',
        a: (
          <p>
            하이틴은 대한민국 고등학교 재학생 및 졸업생을 위한 서비스입니다.
            해당 학교 학생이 아닐 경우 이용이 불가능합니다.
          </p>
        ),
      },
      {
        q: '3. 아이디/비밀번호를 잃어버렸어요',
        a: (
          <p>
            하이틴은 개인정보처리방침과 개인정보보호법에 따라 개인정보를
            개인에게 직접 알려드릴 수 없습니다. 만약 분실로 찾기 어려우실 경우
            계정을 새로 만들어야 합니다. 탈퇴 관련은{' '}
            <a
              href="mailto:hiteen0316@gmail.com"
              className="text-blue-600 underline"
            >
              hiteen0316@gmail.com
            </a>
            로 문의주시기 바랍니다.
          </p>
        ),
      },
      {
        q: '4. 탈퇴는 어떻게 하나요?',
        a: (
          <p>
            현재 탈퇴 관련은 인스타 @hiite_en 또는 이메일{' '}
            <a
              href="mailto:hiteen0316@gmail.com"
              className="text-blue-600 underline"
            >
              hiteen0316@gmail.com
            </a>
            로 문의주시기 바랍니다.
          </p>
        ),
      },
      {
        q: '5. 탈퇴 후 재가입은 바로 가능한가요?',
        a: (
          <p>
            탈퇴 후 재가입을 반복할 경우 시스템에 의해 재가입이 제한됩니다.
          </p>
        ),
      },
    ],
  },
  {
    title: '학교 인증',
    items: [
      {
        q: '1. 학부생이 아니면 인증을 할 수 없나요?',
        a: (
          <p>
            학부 재학생 및 졸업생에 한해 가능합니다. 학부 재학생 및 졸업생이
            아닌 것으로 발견되었을 경우 인증이 취소될 수 있습니다.
          </p>
        ),
      },
    ],
  },
  {
    title: '시간표/급식표',
    items: [
      {
        q: '1. 학교 시간표/급식표는 어떤 경로를 통해 수집하나요?',
        a: (
          <p>
            학교가 제공하는 Open API, 학교 공지사항 웹사이트, 교무처·총학생회
            등 공식 기관을 통해 수집한 자료를 바탕으로 제공하고 있습니다.
          </p>
        ),
      },
      {
        q: '2. 학교 시간표/급식표가 잘못되었어요',
        a: (
          <p>
            개설 과목 및 급식 정보는 위 경로를 통해 수집한 자료와 연동되어
            제공합니다. 공식 정보가 아닐 경우 변경을 요청해주세요. 변경사항은
            주기적으로 반영되며, 반영이 지연될 경우{' '}
            <a
              href="mailto:hiteen0316@gmail.com"
              className="text-blue-600 underline"
            >
              hiteen0316@gmail.com
            </a>
            로 알려주시기 바랍니다.
          </p>
        ),
      },
      {
        q: '3. 시간표/급식표 디자인을 마음대로 변경할 수 없나요?',
        a: (
          <p>
            하이틴 시간표/급식표는 학교 및 학급에 따라 자동 조절됩니다. 현재
            테마 변경 기능은 제공되지 않습니다.
          </p>
        ),
      },
    ],
  },
  {
    title: '커뮤니티 이용',
    items: [
      {
        q: '1. 익명으로 글/댓글을 어떻게 작성하나요?',
        a: (
          <p>
            글/댓글 작성 시 하단의 “익명” 버튼을 체크하고 작성하세요. 다만,
            익명 허용이 불가한 게시판에서는 버튼이 표시되지 않습니다.
          </p>
        ),
      },
      {
        q: '2. 익명으로 쪽지를 어떻게 발송하나요?',
        a: (
          <p>
            익명으로 작성된 글/댓글 작성자에게 쪽지를 보내면 익명으로 발송됩니다.
            닉네임 작성자에게 보낼 경우 본인의 닉네임이 표시됩니다.
          </p>
        ),
      },
      {
        q: '3. 홈 화면에 게시판 목록을 추가하거나 삭제할 수 있나요?',
        a: (
          <p>
            원하는 게시판에 들어가 우측 상단의 즐겨찾기 버튼을 눌러 추가·삭제할 수
            있습니다.
          </p>
        ),
      },
      {
        q: '4. 다른 학교 커뮤니티는 들어갈 수 없나요?',
        a: (
          <p>
            하이틴은 가입 시 선택한 하나의 학교 커뮤니티만 이용 가능합니다.
          </p>
        ),
      },
      {
        q: '5. 익명으로 작성한 글/댓글 작성자를 알 수 있나요?',
        a: (
          <p>
            하이틴 익명은 일방향 암호화 처리되므로 작성자를 확인할 수 없습니다.
          </p>
        ),
      },
      {
        q: '6. 누가 공감이나 신고를 했는지 알 수 있나요?',
        a: (
          <p>
            익명 여부와 관계없이 공감·신고한 이용자 정보는 누구에게도 공개되지
            않습니다.
          </p>
        ),
      },
      {
        q: '7. 개인정보 침해, 모욕, 허위사실 유포 등을 당했어요. 법적 조치를 취하려면 어떻게 하나요?',
        a: (
          <p>
            법적 조치는 하이틴에서 처리하기 어렵습니다. 수사기관에 직접
            의뢰해주세요.
          </p>
        ),
      },
    ],
  },
  {
    title: '기타',
    items: [
      {
        q: '찾으시는 답변이 없으신가요?',
        a: (
          <p>
            문의하기를 눌러 궁금하신 점을 알려주세요. 이미 명시된 항목에 대한 문의는
            처리되지 않습니다.{' '}
            <a
              href="mailto:hiteen0316@gmail.com"
              className="text-blue-600 underline"
            >
              문의하기
            </a>
          </p>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  const router = useRouter();
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setOpenMap(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <ProfileLayout>
      <div className="p-4">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.back()}
          className="flex items-center mb-6 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-1" />
          뒤로가기
        </button>

        <h1 className="text-2xl font-bold mb-8">이용 문의(FAQ)</h1>

        {FAQ_CATEGORIES.map(category => (
          <section key={category.title} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
            <div className="space-y-4">
              {category.items.map(({ q, a }) => (
                <div key={q}>
                  <button
                    onClick={() => toggle(q)}
                    className="w-full text-left font-medium"
                  >
                    {q}
                  </button>
                  {openMap[q] && <div className="mt-2 text-gray-700">{a}</div>}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </ProfileLayout>
  );
}
