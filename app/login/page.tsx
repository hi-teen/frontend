import dynamic from 'next/dynamic';

const LoginPage = dynamic(() => import('@/views/login/LoginPage'), { ssr: false });

export default function LoginRoute() {
  return <LoginPage />;
}
