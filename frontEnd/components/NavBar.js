import Link from "next/link";
import { useRouter } from 'next/router';

const NavBar = ({ site, corPrimaria = "#3B82F6" }) => {
  const router = useRouter();
  const slug = site || router.query.slug || '';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center text-white py-2 shadow-inner rounded-t-4xl"
      style={{ backgroundColor: corPrimaria }}
    >
      <Link href={`/loja/${slug}`} className="flex flex-col items-center hover:opacity-80">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m6-11v10a1 1 0 001 1h5" />
        </svg>
        <span>Início</span>
      </Link>

      <Link href={`/loja/${slug}/pedidos`} className="flex flex-col items-center hover:opacity-80">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V5a4 4 0 00-8 0v6M5 8h14l1 13H4L5 8z" />
        </svg>
        <span>Pedidos</span>
      </Link>

      <Link href={`/loja/${slug}/carrinho`} className="flex flex-col items-center hover:opacity-80">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.6 8m10.6-8l1.6 8M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
        <span>Carrinho</span>
      </Link>

      <Link href={`/loja/${slug}/agendamento`} className="flex flex-col items-center hover:opacity-80">
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
  <span>Agendamento</span>
</Link>

    </nav>
  );
};

export default NavBar;
