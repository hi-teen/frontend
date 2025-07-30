'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function YouthProtectionPolicyPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white">
      {/* 상단 바 */}
      <header className="sticky top-0 z-50 bg-white flex items-center px-4 py-3 border-b">
        <button onClick={() => router.back()} className="mr-2">
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold">청소년 보호 정책</h1>
      </header>

      <main className="prose max-w-none p-6">
        <p>
          청소년 보호 정책은 하이틴(이하 “회사”라 합니다)가 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에
          근거하여 유해정보 및 유해환경으로부터 청소년을 보호하기 위함을 목적으로 합니다.
        </p>

        <h3>1. 청소년 보호를 위한 목표 및 기본원칙</h3>
        <p>
          회사는 청소년이 안전한 환경에서 서비스를 이용하며 건전한 인격체로 성장할 수 있도록 최선의 노력을 다하고
          있습니다.
        </p>

        <h3>2. 유해정보에 대한 청소년 접근제한 및 관리조치</h3>
        <p>
          회사는 청소년이 아무런 제한장치 없이 청소년 유해정보에 노출되지 않도록 게시물 검수/신고 시스템과 게시물
          신고센터를 운영하고 있습니다. 또한 불법촬영물, 청소년유해매체물 등 성적 도의관념에 반하는 행위를 커뮤니티
          이용규칙에 의거하여 엄격하게 금지하고 있습니다.
        </p>

        <h3>3. 청소년 보호를 위한 교육</h3>
        <p>
          회사는 관련된 임직원을 대상으로 청소년 보호 관련 법령 및 보호정책, 유해정보 발견 시 대처방법, 위반사항
          처리에 대한 보고 절차 등을 교육하고 있습니다.
        </p>

        <h3>4. 유해정보로 인한 피해상담 및 고충처리</h3>
        <p>
          회사는 청소년 유해정보로 인한 피해상담 및 고충처리를 위한 전문인력을 배치하여 그 피해가 확산되지 않도록
          하고 있습니다. 이용자는 ‘청소년보호 책임자 및 담당자의 지정 현황’을 참고하여 피해상담 및 고충처리를
          요청할 수 있습니다.
        </p>

        <h3>5. 청소년보호 책임자 및 담당자의 지정 현황</h3>
        <ul>
          <li>이메일: hiteen0316@gmail.com</li>
        </ul>

        <h3>6. 피해구제를 위한 관련 기관 안내</h3>
        <ul>
          <li>하이틴 권리침해신고센터: hiteen0316@gmail.com</li>
          <li>
            방송통신심의위원회:{' '}
            <a
              href="http://www.kocsc.or.kr/mainPage.do"
              target="_blank"
              rel="noopener noreferrer"
            >
              http://www.kocsc.or.kr/mainPage.do
            </a>
          </li>
          <li>
            사이버범죄 신고시스템:{' '}
            <a
              href="https://ecrm.police.go.kr"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ecrm.police.go.kr
            </a>
          </li>
        </ul>
      </main>
    </div>
  );
}
