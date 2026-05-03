import { Alert, Box, Snackbar } from '@mui/material';
import AuthForm from '../components/auth/AuthForm';
import { useAuthForm } from '../hooks/login/useAuthForm';
import ThemeSwitch from '../components/ui/buttons/ThemeSwitch';

export default function LoginPage() {
  const { 
    isRegistering,
    setIsRegistering,
    formData,
    handleChange,
    handleAuth,
    feedback,
    setFeedback
  } = useAuthForm();

  return (
    <>
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 100 }}>
        <ThemeSwitch />
      </Box>
      <Snackbar 
        open={feedback.open} 
        autoHideDuration={6000} 
        onClose={() => setFeedback({ ...feedback, open: false })}
      >
        <Alert severity={feedback.severity} sx={{ width: '100%' }}>
          {feedback.message}
        </Alert>
      </Snackbar>
      
      <AuthForm 
         isRegistering={isRegistering}
         setIsRegistering={setIsRegistering}
         formData={formData}
         handleChange={handleChange}
         handleAuth={handleAuth}
      />
    </>
  );
}