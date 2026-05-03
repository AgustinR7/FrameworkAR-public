import styled from 'styled-components';
import { useThemeMode } from '../../../context/ThemeContextProvider';

interface SkewButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  customColor?: string;
  secondaryColor?: string;
}

const SkewButton = ({ text, customColor, secondaryColor, className, style, ...props }: SkewButtonProps) => {
  const { mode } = useThemeMode();

  return (
    <StyledWrapper mode={mode} customColor={customColor} secondaryColor={secondaryColor} className={className} style={{ fontSize: '20px', ...style }}>
      <button className="btn" {...props}>
        {text}
      </button>
    </StyledWrapper>
  );
};

interface StyledProps {
  mode: 'light' | 'dark';
  customColor?: string;
  secondaryColor?: string;
}

const StyledWrapper = styled.div<StyledProps>`
  width: 100%;
  .btn {
    width: 100%;
    padding: 0.3em 0.8em;
    min-height: 2em;
    margin: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    background: ${(props) => props.customColor || (props.mode === 'dark' ? '#eeeeee' : '#252525')};
    color: ${(props) => props.customColor ? (props.secondaryColor || '#ffffff') : (props.mode === 'dark' ? '#252525' : '#eeeeee')};
    border: none;
    border-radius: 0.625em;
    font-size: inherit;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    z-index: 1;
    overflow: hidden;
    transition: color 0.5s;
  }

  button:hover {
    color: ${(props) => props.customColor || (props.mode === 'dark' ? '#eeeeee' : '#252525')};
  }

  button:after {
    content: "";
    background: ${(props) => props.customColor ? (props.secondaryColor || '#ffffff') : (props.mode === 'dark' ? '#252525' : '#eeeeee')};
    position: absolute;
    z-index: -1;
    left: -20%;
    right: -20%;
    top: 0;
    bottom: 0;
    transform: skewX(-45deg) scale(0, 1);
    transition: transform 0.5s;
  }

  button:hover:after {
    transform: skewX(-45deg) scale(1, 1);
  }
`;

export default SkewButton;
