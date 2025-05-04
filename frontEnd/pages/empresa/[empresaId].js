import ClienteHome from "@/pages/client/ClienteHome";
import { useRouter } from "next/router";

export default function EmpresaPage() {
  const router = useRouter();
  const { empresaId } = router.query;

  if (!empresaId) {
    return <p>Carregando...</p>;
  }

  return <ClienteHome empresaId={empresaId} />;
}
