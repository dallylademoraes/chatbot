import Image from "next/image";

const Produto = ({ produto , corPrimaria }) => (
  <div className="space-y-4">

    <div className="relative ">
    <button
        onClick={() => window.history.back()}
        className="absolute w-9  -top-8 left-0 font-bold text-2xl bg-blue-300 text-white rounded-full  hover:bg-blue-500 z-10"
        
      >
        {"<"}
      </button>
      <Image
        className="w-full mt-3 h-[270px] rounded-4xl shadow-lg"
        src={produto.image}
        alt="Produto"
        width={500}
        height={500}
      />



      
    </div>
    <div className=" ">
            <h2 className="font-bold text-xl">{produto.nome}</h2>
            <p className="text-sm italic ">
              {produto.descricao || "Descrição não disponível."}
            </p>  
        </div>
  </div>
);

export default Produto;
