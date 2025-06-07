/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['cufzswdymzevdeonjgan.supabase.co'],
  },
  

  async rewrites() {
    return [

      {
        source: '/loja/produto/:site/:id', // URL personalizada
        destination: '/client/produto', // Arquivo de destino
      },
      {
        source: '/loja/:slug/agendamento', // URL personalizada
        destination: '/client/agendamento', // Arquivo de destino
      },
      {
        source: '/:slug/carrinho',
        destination: '/client/carrinho', 
      },
      {
        source: '/loja/:site' ,
        destination: '/client/ClienteHome', 
      },
      {
        source: '/cadastro', 
        destination: '/client/cadastrar_cliente', 
      },
      {
        source: '/login', 
        destination: '/client/loginCliente', 
      },



      {
        source: '/empresa/personalizar', 
        destination: '/empresa/personalizacao-loja', 
      },
      {
        source: '/loginEmpresa', 
        destination: '/empresa/LoginEmpresa', 
      },
      {
        source: '/cadastroEmpresa', 
        destination: '/empresa/CadastroEmpresa', 
      },
      {
        source: '/empresa/adicionarProduto', 
        destination: '/empresa/AdicionarProduto', 
      },
      
    ];
  },
};

export default nextConfig;
