import styled from 'styled-components';

interface AnimatedButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const AnimatedButton = ({ text, onClick, type = "button" }: AnimatedButtonProps) => {
  return (
    <StyledWrapper>
      <button className="btn2" onClick={onClick} type={type}>
        <span className="spn2">{text}</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn2 {
    position: relative;
    display: inline-block;
    padding: 15px 30px;
    border: 2px solid #212121;
    text-transform: uppercase;
    color: #212121;
    text-decoration: none;
    font-weight: 600;
    font-size: 20px;
    transition: 0.3s;
    background-color: transparent;
    cursor: pointer;
  }

  .btn2::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    width: calc(100% + 6px);
    height: calc(100% + 2px);
    background-color: #ffffff;
    transition: 0.3s ease-out;
    transform: scaleY(1);
  }

  .btn2::after {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    width: calc(100% + 4px);
    height: calc(100% - 50px);
    background-color: #ffffff;
    transition: 0.3s ease-out;
    transform: scaleY(1);
  }


  .btn2:hover::before {
    transform: translateY(-25px);
    height: 0;
  }

  .btn2:hover::after {
    transform: scaleX(0);
    transition-delay: 0.15s;
  }

  .btn2:hover {
    border: 2px solid #212121;
  }

  .btn2 .spn2 {
    position: relative;
    z-index: 3;
    text-decoration: none;
    border: none;
    background-color: transparent;
  }
`;

export default AnimatedButton;