import Banner from '@/components/Banner';

export default function Home() {
  return (
    <div>
      <Banner />
      <h1>Hello World</h1>
      {/* Login link(must use <a> link to define Auth0 component) */}
      <a href="/auth/login">Login</a>
      {/* Logout link(must use <a> link to define Auth0 component) */}
      <a href="/auth/logout">Logout</a>
      {/* conclusion: The Home component renders a simple layout with login and logout links. */}
    </div>
  );
}
