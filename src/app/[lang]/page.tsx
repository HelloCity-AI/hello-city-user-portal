import Banner from '@/components/Banner';

type Props = {
  params: { lang: string };
};

export default function Home({ params }: Props) {
  const { lang } = params;

  return (
    <div>
      <Banner locale={lang} />
      <h1>Hello World - Language: {lang}</h1>
      <p>Welcome to HelloCity! This page is rendered for the {lang} locale.</p>
      {/* Login link(must use <a> link to define Auth0 component) */}
      <a href="/auth/login">Login</a>
      {/* Logout link(must use <a> link to define Auth0 component) */}
      <a href="/auth/logout">Logout</a>
    </div>
  );
}
