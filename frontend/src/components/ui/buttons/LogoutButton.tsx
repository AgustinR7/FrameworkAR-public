import styled from 'styled-components';
import { useThemeMode } from '../../../context/ThemeContextProvider'; // Importamos tu hook

const LogoutButton = ({ onClick }: { onClick: () => void }) => {
  const { mode } = useThemeMode(); // Obtenemos el modo
  const text = "Cerrar Sesión";
  
  return (
    <StyledWrapper mode={mode}>
      <button className="btn-53" onClick={onClick}>
        <div className="original">{text}</div>
        <div className="letters">
          {text.split('').map((char, index) => (
            <span 
              key={index} 
              style={{ transitionDelay: `${index * 0.03}s` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      </button>
    </StyledWrapper>
  );
}

interface StyledProps {
  mode: 'light' | 'dark';
}

const StyledWrapper = styled.div<StyledProps>`
  width: 100%;
  display: flex;
  justify-content: center;

  .btn-53 {
    --bg-button: ${props => props.mode === 'dark' ? '#cccccc' : '#333333'}; 
    --bg-original: ${props => props.mode === 'dark' ? '#1e1e1e' : '#ffffff'};
    --text-color: ${props => props.mode === 'dark' ? '#cccccc' : '#333333'};
    --border-color: ${props => props.mode === 'dark' ? '#cccccc' : '#333333'};
    --hover-text: ${props => props.mode === 'dark' ? '#1e1e1e' : '#ffffff'};

    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: button;
    background-color: var(--bg-button);
    color: var(--hover-text);
    cursor: pointer;
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    font-size: 100%;
    line-height: 1.5;
    margin: 0;
    padding: 0;
    border: 2px solid var(--border-color);
    border-radius: 25px;
    box-sizing: border-box;
    display: block;
    font-weight: 900;
    overflow: hidden;
    padding: 0.5rem 2rem;
    position: relative;
    text-transform: uppercase;
    transition: all 0.3s ease;
  }

  .btn-53 .original {
    background: var(--bg-original);
    color: var(--text-color);
    display: grid;
    inset: 0;
    place-content: center;
    position: absolute;
    transition: transform 0.2s cubic-bezier(0.87, 0, 0.13, 1);
  }

  .btn-53:hover .original {
    transform: translateY(100%);
  }

  .btn-53 .letters {
    display: inline-flex;
    color: var(--hover-text);
  }

  .btn-53 span {
    opacity: 0;
    transform: translateY(-15px);
    transition: transform 0.2s cubic-bezier(0.87, 0, 0.13, 1), opacity 0.2s;
  }

  .btn-53 span:nth-child(2n) {
    transform: translateY(15px);
  }

  .btn-53:hover span {
    opacity: 1;
    transform: translateY(0);
  }

  .btn-53:hover span:nth-child(2) { transition-delay: 0.1s; }
  .btn-53:hover span:nth-child(3) { transition-delay: 0.15s; }
  .btn-53:hover span:nth-child(4) { transition-delay: 0.2s; }
  .btn-53:hover span:nth-child(5) { transition-delay: 0.25s; }
  .btn-53:hover span:nth-child(6) { transition-delay: 0.3s; }
`;

export default LogoutButton;