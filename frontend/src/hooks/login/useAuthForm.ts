import { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { authService } from '../../services/auth.service'; 

export const useAuthForm = () => {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });

  const [feedback, setFeedback] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = isRegistering
      ? { username: formData.username, email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password };

    try {
      if (isRegistering) {
        await authService.register(payload);
        
        setFeedback({
          open: true,
          message: "¡Cuenta creada! Ahora inicia sesión.",
          severity: "success"
        });
        setIsRegistering(false);
      } else {
        const data = await authService.login(payload);
        login(data.user); 
      }
    } catch (error: any) {
      console.error(error);
      setFeedback({
        open: true,
        message: error.message || "Error en la operación",
        severity: "error"
      });
    }
  };

  return {
    isRegistering,
    setIsRegistering,
    formData,
    handleChange,
    handleAuth,
    feedback,
    setFeedback
  };
};