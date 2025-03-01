import React, { useState, useEffect } from "react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // Restablecer el estado isOpen cuando la pantalla cambia de tamaño
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false); // Cierra el menú desplegable en pantallas grandes
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className=" sticky top-0 left-0 w-full bg-white p-4 shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div>
          <img
            src="src/assets/jupyter-logo.png"
            alt="jupyter-logo"
            className="h-10"
          />
        </div>

        {/* Botón del menú hamburguesa (solo visible en móviles) */}
        <button
          onClick={toggleDrawer}
          className=" block md:hidden text-white focus:outline-none hover:text-gray-600 button"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Menú único (se comporta diferente en móviles y desktop) */}
        <div
          className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:relative md:w-auto md:h-auto md:bg-transparent md:shadow-none md:translate-x-0 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 md:p-0">
            <ul className="flex flex-col space-y-6 mt-16 md:mt-0 md:flex-row md:space-y-0 md:space-x-8">
              <li>
                <a
                  href="#"
                  className="jupyter-color hover:font-semibold transition-all duration-300 hover-underline-animation"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="jupyter-color hover:font-semibold transition-all duration-300 hover-underline-animation"
                >
                  Material
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="jupyter-color hover:font-semibold transition-all duration-300 hover-underline-animation"
                >
                  Sobre mí
                </a>
              </li>
            </ul>
          </div>

          {/* Botón para cerrar el menú (solo visible en móviles) */}
          <button
            onClick={toggleDrawer}
            className="absolute top-4 right-4 text-white hover:text-gray-800 md:hidden button"
          >
            X
          </button>
        </div>
      </div>

      {/* Fondo oscuro al abrir el menú (solo visible en móviles) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 md:hidden"
          onClick={toggleDrawer}
        />
      )}
    </div>
  );
};

export default Navbar;
