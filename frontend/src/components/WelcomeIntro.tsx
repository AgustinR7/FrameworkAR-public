import { useEffect, useRef } from 'react';
import { Timeline, createScope, stagger } from 'animejs';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { User } from '../context/AuthProvider';
import { useThemeMode } from '../context/ThemeContextProvider'; // <-- Importamos tu hook

interface WelcomeIntroProps {
  user: User | null;
  onComplete: () => void;
}

const WelcomeIntro: React.FC<WelcomeIntroProps> = ({ user, onComplete }) => {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<any>(null);
  const { mode } = useThemeMode();
  const { t } = useTranslation();

  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      new Timeline({
        defaults: { ease: 'outExpo' },
        onComplete: () => {
          if (onComplete) onComplete();
        }
      })
      .add('.letter', {
        translateY: [100, 0],
        opacity: [0, 1],
        scale: [0.5, 1],
        duration: 1200,
        delay: stagger(30)
      })
      .add(root.current!, {
        opacity: [1, 0],
        duration: 800,
        ease: 'linear',
        delay: 500
      });
    });

    return () => scope.current.revert();
  }, [onComplete]);

  const displayName = user?.firstName || user?.username || "Usuario";
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  const text = t('welcome.greeting', { name: formattedName });
  
  return (
    <Box
      ref={root}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: mode === 'light' ? '#fafafa' : '#121212', 
        zIndex: 10, 
        overflow: 'hidden',
        transition: "background-color 0.5s ease",
      }}
    >
      <Typography 
        variant="h2" 
        sx={{ 
            fontWeight: 'bold',
            color: mode === 'light' ? '#0f172a' : '#f5f5f5', 
            fontSize: { xs: '2rem', md: '3.5rem' },
            transition: "color 0.5s ease",
        }}
      >
        {text.split('').map((char, index) => (
          <span key={index} className="letter" style={{ display: 'inline-block', opacity: 0 }}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </Typography>
    </Box>
  );
};

export default WelcomeIntro;