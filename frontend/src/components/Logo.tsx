import { useThemeMode } from '../context/ThemeContextProvider';

export default function Logo({ sx }: { sx?: any }) {
  const { mode } = useThemeMode();

  const arColor = mode === 'light' ? '#0a2342' : '#ffffff';
  const frameworkColor = '#3a86ff'; 

  return (
    <svg 
      viewBox="0 0 650 100" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ ...sx }} 
    >
      <style>
        {`
          .text-ar {
            fill: ${arColor};
            font-family: "Arial", sans-serif;
            font-weight: 900;
            transition: fill 0.5s ease; 
          }
          .text-framework {
            fill: ${frameworkColor};
            font-family: "Arial", sans-serif;
            font-weight: 800;
            animation: slideInHide 5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
          }
          @keyframes slideInHide {
            0%, 10% { transform: translateX(-450px); }
            20%, 60% { transform: translateX(0); }
            90%, 100% { transform: translateX(-450px); }
          }
        `}
      </style>

      <defs>
        <clipPath id="mask-right">
          <rect x="155" y="0" width="600" height="100" />
        </clipPath>
      </defs>

      <g clipPath="url(#mask-right)">
        <text x="165" y="75" fontSize="60" className="text-framework">
          FRAMEWORK
        </text>
      </g>

      <text x="10" y="75" fontSize="80" className="text-ar">AR</text>
    </svg>
  );
}