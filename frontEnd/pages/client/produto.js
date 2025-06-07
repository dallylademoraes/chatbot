import { useEffect, useState } from "react";
import axios from "axios"; // Você ainda está usando axios aqui. Se não for mais necessário para o carrinho ou outras chamadas, pode remover.
import ExibirProduto from "@/components/ExibirProduto";
import Adicionais from "@/components/Adicionais";
import QuantidadeControl from "@/components/QuantidadeControl";
import Carrinho from "@/components/AdicionarCarrinho";
import NavBar from "@/components/NavBar";
import { Obersevacao } from "@/components/Observacao";
import { useRouter } from 'next/router';

export default function Produto() {
    const router = useRouter();
    const { id, site } = router.query;

    const [produto, setProduto] = useState(null);
    const [adicionais, setAdicionais] = useState({});
    const [quantidade, setQuantidade] = useState(1);
    const [selecionados, setSelecionados] = useState({});
    const [corPrimaria, setCorPrimaria] = useState("#3B82F6");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // REMOVA ESTE BLOCO, pois ele é para filtragem de uma lista de produtos, não para um único produto.
    // const removeAccents = (str) => {
    //     return str
    //         .normalize("NFD")
    //         .replace(/[\u0300-\u036f]/g, "");
    // };

    // REMOVA ESTA LINHA, pois ela usa 'searchTerm' que não está definido aqui.
    // const produtosFiltrados = produto ? [produto].filter((p) =>
    //     removeAccents(p.nome.toLowerCase()).includes(
    //         removeAccents(searchTerm.toLowerCase())
    //     )
    // ) : [];

    const subtotal =
        (produto?.preco || 0) * quantidade +
        Object.values(selecionados).reduce(
            (acc, item) => acc + item.count * item.price,
            0
        );

    // useEffect para buscar dados da empresa/loja (cores, etc.)
    useEffect(() => {
        console.log("DEBUG: useEffect para fetchEmpresa acionado.");
        if (!site) {
            console.log("DEBUG: site (slug) não disponível, pulando fetchEmpresa.");
            return;
        }

        async function fetchEmpresa() {
            try {
                console.log(`DEBUG: Buscando dados da empresa para slug: ${site}`);
                const url = `${process.env.NEXT_PUBLIC_EMPRESA_API}/loja/slug/${site}`;
                const response = await fetch(url);

                if (!response.ok) {
                    let errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
                    try {
                        const errorData = await response.json();
                        if (errorData.message) {
                            errorMessage += ` - ${errorData.message}`;
                        }
                    } catch (jsonError) {
                        // Não conseguiu parsear o JSON do erro
                    }
                    console.error("DEBUG: Erro na resposta da API de empresa:", errorMessage);
                    return;
                }

                const data = await response.json();
                console.log("DEBUG: Dados da loja (empresa) recebidos:", data);
                setCorPrimaria(data.cor_primaria || "#3B82F6");
            } catch (error) {
                console.error("DEBUG: Erro na requisição ao buscar empresa:", error.message || error);
            }
        }
        fetchEmpresa();
    }, [site]);


    // useEffect para buscar dados do produto individual
    useEffect(() => {
        console.log("DEBUG: useEffect para fetchProduto acionado.");
        if (!router.isReady) {
            console.log("DEBUG: Router não está pronto, pulando fetchProduto.");
            return;
        }
        if (!id) {
            console.log("DEBUG: ID do produto não disponível, pulando fetchProduto.");
            return;
        }

        async function fetchProduto() {
            try {
                console.log(`DEBUG: Iniciando fetch do produto com ID: ${id}`);
                setLoading(true);
                setError(null);

                const url = `${process.env.NEXT_PUBLIC_EMPRESA_API}/produto/${id}`;
                console.log(`DEBUG: URL da API para produto: ${url}`);

                const response = await fetch(url);
                const data = await response.json();

                console.log("DEBUG: Resposta RAW da API de produto:", response);
                console.log("DEBUG: Dados JSON da API de produto:", data);

                if (!response.ok) {
                    const errorMsg = data.message || response.statusText || 'Erro desconhecido ao carregar produto.';
                    console.error("DEBUG: Erro na resposta HTTP da API de produto:", response.status, errorMsg);
                    setError(errorMsg);
                    setProduto(null);
                } else if (!data || Object.keys(data).length === 0) {
                    console.warn("DEBUG: API de produto retornou 200 OK, mas sem dados ou dados vazios.");
                    setError("Produto não encontrado ou dados inválidos.");
                    setProduto(null);
                } else {
                    console.log("DEBUG: Produto recebido com sucesso:", data);
                    setProduto(data);
                    if (data.itens) { // Assegure-se de que 'itens' existe e é o que você espera
                        setAdicionais(data.itens.adicionais || {});
                    } else {
                        setAdicionais({}); // Garante que adicionais seja um objeto vazio se não houver 'itens'
                    }
                }
            } catch (err) {
                console.error("DEBUG: Erro no fetch do produto (catch):", err);
                setError(`Erro de rede ou processamento: ${err.message}`);
                setProduto(null);
            } finally {
                setLoading(false);
            }
        }
        fetchProduto();
    }, [id, router.isReady]);

    const toggleAdicional = (name, price, type) => {
        setSelecionados((prev) => {
            const count = prev[name]?.count || 0;
            const newCount = type === "+" ? count + 1 : Math.max(count - 1, 0);
            return {
                ...prev,
                [name]: { count: newCount, price },
            };
        });
    };

    const handleAddToCart = async () => {
        console.log("DEBUG: handleAddToCart acionado.");
        try {
            if (!produto) {
                console.warn("DEBUG: Tentativa de adicionar ao carrinho sem produto carregado.");
                alert("Produto não carregado. Por favor, tente novamente.");
                return;
            }
            if (!produto.id_loja) { // Certifique-se que o objeto produto tenha id_loja
                console.warn("DEBUG: ID da loja não disponível no objeto produto.");
                alert("Informações da loja não disponíveis. Não é possível adicionar ao carrinho.");
                return;
            }

            console.log(`DEBUG: Adicionando ao carrinho - Quantidade: ${quantidade}, Produto ID: ${produto.id}, Loja ID: ${produto.id_loja}, Slug da loja: ${site}`);

            const url = `${process.env.NEXT_PUBLIC_EMPRESA_API}/loja/${site}/carrinho`;
            console.log(`DEBUG: URL para adicionar ao carrinho: ${url}`);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    produtoId: produto.id,
                    quantidade,
                    lojaId: produto.id_loja,
                    // Adicione os adicionais selecionados aqui se o backend espera
                    // selecionados: selecionados
                }),
            });

            const data = await response.json();
            console.log("DEBUG: Resposta do servidor ao adicionar ao carrinho:", data);

            if (!response.ok) {
                console.error("DEBUG: Erro do servidor ao adicionar ao carrinho:", data.mensagem || 'Erro desconhecido');
                throw new Error(data.mensagem || 'Erro ao adicionar ao carrinho');
            }
            console.log("DEBUG: Produto adicionado ao carrinho com sucesso!");
            alert(data.mensagem || 'Produto adicionado ao carrinho com sucesso!');
        } catch (error) {
            console.error('DEBUG: Erro ao adicionar ao carrinho (catch):', error);
            alert('Erro ao adicionar ao carrinho');
        }
    };


    if (loading) {
        return <div className="p-4 text-center">Carregando...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-600">Erro: {error}</div>;
    }

    if (!produto) {
        return <div className="p-4 text-center">Produto não disponível.</div>;
    }


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-6">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">

                {/* Coluna: Produto e Observação */}
                <div className="flex-1 p-6 space-y-6 text-gray-800">
                    <ExibirProduto produto={produto}
                    corPrimaria={corPrimaria}  />

                    <QuantidadeControl
                        produto={produto}
                        quantidade={quantidade}
                        setQuantidade={setQuantidade}
                        corPrimaria={corPrimaria} 
                    />

                    <Obersevacao produto={produto} />
                </div>

                {/* Coluna: Adicionais e Carrinho */}
                <div className="flex-1 bg-gray-100 text-gray-800 p-6 space-y-6 border-t md:border-t-0 md:border-l border-gray-200">
                    <Adicionais
                        adicionais={adicionais}
                        selecionados={selecionados}
                        toggleAdicional={toggleAdicional}corPrimaria={corPrimaria} 

                    />

                    <Carrinho subtotal={subtotal} handleAddToCart={handleAddToCart} />
                </div>
            </div>

            {/* Navbar (sempre visível no final da tela) */}
            <div className="w-full max-w-5xl mt-6">
                <NavBar site={site} corPrimaria={corPrimaria} />
            </div>
        </div>
    );
}