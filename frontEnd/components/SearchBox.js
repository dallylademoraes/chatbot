{showSearch && (
    <div className="flex items-center bg-white rounded-full px-3 py-1 w-full max-w-xl mx-auto shadow">
      <Image src="/icons/search_icon.svg" alt="Buscar" width={16} height={16} className="mr-2" />
      <input
        type="text"
        placeholder="O que você quer comprar hoje?"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 text-sm text-gray-800 outline-none"
      />
        <button
        onClick={() => {
            setSearchTerm("");  // Limpa o texto da pesquisa
            setShowSearch(false);  // Fecha a barra de pesquisa
        }}
        className="text-gray-500 hover:text-red-600"
        >
        ✕
        </button>





    </div>
  )}
  