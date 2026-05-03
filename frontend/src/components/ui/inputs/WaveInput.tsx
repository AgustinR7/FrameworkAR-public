import styled from 'styled-components';
import { useThemeMode } from '../../../context/ThemeContextProvider';

interface WaveInputProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const WaveInput: React.FC<WaveInputProps> = ({ label, type = "text", name, value, onChange, required = true }) => {
  const { mode } = useThemeMode();

  return (
    <StyledWrapper mode={mode}>
      <div className="form-control">
        <input 
            type={type} 
            name={name}
            value={value} 
            onChange={onChange}
            required={required}
            placeholder=" "
        />
        <label>
            {label.split('').map((char, index) => (
                <span key={index} style={{ transitionDelay: `${index * 40}ms` }}>
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </label>
      </div>
    </StyledWrapper>
  );
}

interface StyledProps {
  mode: 'light' | 'dark';
}

const StyledWrapper = styled.div<StyledProps>`
  width: 100%;

  .form-control {
    position: relative;
    margin: 20px 0 20px;
    width: 100%;
  }

  .form-control input {
    background-color: transparent;
    border: 0;
    border-bottom: 2px ${props => props.mode === 'dark' ? '#555' : '#ccc'} solid;
    display: block;
    width: 100%;
    padding: 20px 0 5px 0;
    font-size: 18px;
    color: ${props => props.mode === 'dark' ? '#ffffff' : '#212121'};
    transition: border-color 0.3s ease;
  }

  .form-control input:-webkit-autofill,
  .form-control input:-webkit-autofill:hover, 
  .form-control input:-webkit-autofill:focus, 
  .form-control input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${props => props.mode === 'dark' ? '#121212' : 'white'} inset !important;
    -webkit-text-fill-color: ${props => props.mode === 'dark' ? '#fff' : '#000'} !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  .form-control input:focus,
  .form-control input:valid {
    outline: 0;
    border-bottom-color: ${props => props.mode === 'dark' ? '#3a86ff' : '#0f172a'};
  }

  .form-control input:not(:placeholder-shown) {
    border-bottom-color: ${props => props.mode === 'dark' ? '#3a86ff' : '#0f172a'};
  }

  .form-control label {
    position: absolute;
    top: 20px;
    left: 0;
    pointer-events: none;
  }

  .form-control label span {
    display: inline-block;
    font-size: 18px;
    min-width: 5px;
    color: ${props => props.mode === 'dark' ? '#bbb' : '#444'};
    transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .form-control input:focus + label span,
  .form-control input:not(:placeholder-shown) + label span {
    color: #3a86ff; 
    transform: translateY(-30px);
    font-size: 14px;
  }
`;

export default WaveInput;