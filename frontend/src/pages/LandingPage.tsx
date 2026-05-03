
import { Box } from '@mui/material';
import { useAuth } from '../context/AuthProvider';
import WelcomeIntro from '../components/WelcomeIntro';
import Home from './Home';

export default function LandingPage() {
  const { user, hasSeenIntro, markIntroAsSeen } = useAuth();
  if (!hasSeenIntro) {
    return (
      <WelcomeIntro
        user={user}
        onComplete={() => {
          markIntroAsSeen();
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        opacity: 0,
        animation: 'fadeIn 0.8s ease-out forwards',
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Home />
    </Box>
  );
}