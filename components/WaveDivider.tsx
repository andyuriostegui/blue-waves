// src/components/WaveDivider.tsx

interface WaveDividerProps {
  color?: string; // Color del relleno (ej: #0A192F)
  flip?: boolean; // Si es true, voltea la ola (para salir de una sección)
}

export default function WaveDivider({ color = "#0A192F", flip = false }: WaveDividerProps) {
  return (
    <div 
      className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''}`}
      style={{ 
        marginTop: flip ? '-1px' : '0', 
        marginBottom: flip ? '0' : '-1px',
        backgroundColor: 'transparent' 
      }}
    >
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C49.49,24.3,105.87,46.12,159.44,53.2c49.94,6.6,101.44,11,161.95,3.24Z" 
          style={{ fill: color }}
        ></path>
      </svg>
    </div>
  );
}