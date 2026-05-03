import styled from 'styled-components';
import { useThemeMode } from '../../../context/ThemeContextProvider';

interface BubbleButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const BubbleButton = ({ text, onClick, type = "button" }: BubbleButtonProps) => {
  const { mode } = useThemeMode();

  return (
    <StyledWrapper mode={mode}>
      <button onClick={onClick} type={type}>
        <span className="circle1" />
        <span className="circle2" />
        <span className="circle3" />
        <span className="circle4" />
        <span className="circle5" />
        <span className="text">{text}</span>
      </button>
    </StyledWrapper>
  );
}

interface StyledProps {
  mode: 'light' | 'dark';
}

const StyledWrapper = styled.div<StyledProps>`
  width: 100%;

  button {
    font-family: ui-sans-serif, system-ui, sans-serif;
    font-weight: bold;
    color: ${props => props.mode === 'dark' ? '#333333' : '#eeeeee'};
    background-color: ${props => props.mode === 'dark' ? '#e0e0e0' : '#252525'}; 
    padding: 1em 2em;
    border: none;
    border-radius: .6rem;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    width: 100%;
    font-size: 16px;
    transition: background-color 0.5s ease, color 0.5s ease;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button span:not(:nth-child(6)) {
    position: absolute;
    height: 30px;
    width: 30px;
    background-color: #0c66ed; 
    border-radius: 50%;
    transition: transform 0.4s ease-out; 
  }

  button span:nth-child(6) {
    position: relative;
    z-index: 1;
    transition: color 0.3s ease;
  }

  button span:nth-child(1) { left: -40px; top: -40px; }
  button span:nth-child(2) { left: 20%; bottom: -40px; }
  button span:nth-child(3) { left: 50%; bottom: -40px; }
  button span:nth-child(4) { right: 20%; bottom: -40px; }
  button span:nth-child(5) { right: -40px; top: -40px; }

  button:hover span:not(:nth-child(6)) {
    transform: scale(40);
    transition: transform 0.8s ease-in-out;
  }

  button:hover {
    color: #ffffff;
  }
`;

export default BubbleButton;