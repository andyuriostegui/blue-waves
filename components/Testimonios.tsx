'use client';

import { useEffect } from 'react';

export default function Testimonios() {
  useEffect(() => {
    // Carga el CDN oficial de Elfsight de manera asíncrona
    const script = document.createElement('script');
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Limpieza al desmontar el componente para evitar duplicados
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="w-full bg-[#FBFBFA] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado siguiendo la línea de diseño "Beyond the Horizon" */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-[#0A192F] font-semibold mb-3">
            Opiniones de nuestros clientes
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-[#0A192F] italic tracking-tight">
            Experiencias en el mar.
          </h2>
          <div className="w-12 h-[1px] bg-[#0A192F]/30 mx-auto mt-6"></div>
        </div>

        {/* Contenedor del Widget de Elfsight */}
        <div className="w-full transition-all duration-300 min-h-[300px]">
          <div 
            className="elfsight-app-e5ea9c85-64bd-4b88-b84b-5b71f9d4132d" 
            data-elfsight-app-lazy
          ></div>
        </div>

      </div>
    </section>
  );
}