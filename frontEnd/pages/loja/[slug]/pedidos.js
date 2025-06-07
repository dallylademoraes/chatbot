import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import CancelarPedidoModal from '@/components/CancelarPedidoModal';

export default function Pedidos() {
  const router = useRouter();
  const { slug } = router.query;

  const [pedidos, setPedidos] = useState([]);
  const [corPrimaria, setCorPrimaria] = useState("#3B82F6"); // Valor padrão
  const [corSecundaria, setCorSecundaria] = useState("#F3F4F6"); // Valor padrão
  const [nome_fantasia, setNomeFantasia] = useState("");
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  const fetchPedidos = async () => {
    try {
      const res = await fetch(`http://localhost:4000/loja/${slug}/pedidos`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  useEffect(() => {
    if (!slug) return;

    async function fetchLoja() {
      try {
        const url = `http://localhost:4000/loja/slug/${slug}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao buscar loja");
        const data = await response.json();
        setCorPrimaria(data.cor_primaria || "#3B82F6");
        setCorSecundaria(data.cor_secundaria || "#F3F4F6");
        setNomeFantasia(data.nome_fantasia || slug);
      } catch (error) {
        console.error("Erro ao buscar loja:", error);
        setCorPrimaria("#3B82F6");
      }
    }

    fetchLoja();
    fetchPedidos();
  }, [slug]);

  const traduzirStatus = (status) => {
    switch (status) {
      case '0':
      case 0:
        return 'Aguardando confirmação';
      case '1':
      case 1:
        return 'Confirmado';
      case '2':
      case 2:
        return 'Em preparação';
      case '3':
      case 3:
        return 'Pronto para entrega';
      case '4':
      case 4:
        return 'Finalizado';
      case '5':
      case 5:
        return 'Cancelado';
      default:
        return 'Status desconhecido';
    }

  }


  const abrirModalCancelamento = (pedido) => {
    setPedidoSelecionado(pedido); // passa o pedido inteiro
    setShowModal(true);
  };


  if (!slug) return <p className="text-black text-center mt-10">Carregando...</p>;

  const textColor = getContrastColor(corPrimaria);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Barra superior */}
      <header
        className="px-4 py-3 flex items-center justify-center shadow"
        style={{ backgroundColor: corPrimaria, color: textColor }}
      >
        <h1 className="text-xl font-bold" style={{ color: textColor }}>
          Seus pedidos em {nome_fantasia || slug}
        </h1>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 p-4 pb-28 flex flex-col items-center">
        {pedidos.length === 0 ? (
          <p className="text-black text-center text-lg mt-10">Você ainda não fez pedidos.</p>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            {pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className="bg-white border border-gray-300 rounded-md p-4 w-full text-black shadow"
              >
                <p><strong>ID do pedido:</strong> {pedido.id}</p>
                <p><strong>Data:</strong> {pedido.data}</p>
                <p><strong>Total:</strong> R$ {(Number(pedido.total) || 0).toFixed(2)}</p>
                <p><strong>Status:</strong> {traduzirStatus(pedido.status)}</p>
                <p><strong>Observações:</strong> {pedido.observacoes || 'Nenhuma'}</p>

                {(['0', '1', '2'].includes(String(pedido.status))) && (
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => abrirModalCancelamento(pedido)}
                      className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 border"
                      style={{
                        backgroundColor: corSecundaria,
                        color: getContrastColor(corSecundaria),
                        borderColor: corSecundaria
                      }}
                    >
                      Cancelar pedido
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <CancelarPedidoModal
            pedidoId={pedidoSelecionado.id}
            clienteId={pedidoSelecionado.cliente_id}
            onClose={() => {
              setShowModal(false);
              fetchPedidos(); // Atualiza a lista de pedidos após cancelamento
            }}
          />


        )}
      </main>

      <NavBar site={slug} corPrimaria={corPrimaria} />
    </div>
  );
}
