import Banner from '@/components/Banner';
import { auth0 } from '@/lib/auth0';

export default async function Home() {
  const session = await auth0.getSession();
  return (
    <div>
      <Banner />
      <h1>Hello World</h1>
      {/* Login link(must use <a> link to define Auth0 component) */}
      {!session && <a href="/auth/login">Login</a>}
      {/* Logout link(must use <a> link to define Auth0 component) */}
      {session && <a href="/auth/logout">Logout</a>}
      {/* conclusion: The Home component renders a simple layout with login and logout links. */}
    </div>
  );
}
