import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useForm } from './useForm';
import { profileService } from '../../services/profile.service';
import type { ProfileFormData, UserProfileResponse } from '../../types/profile-page';
import { config } from '../../config';

export const useProfileLogic = () => {
  const { user, updateUser } = useAuth();
  const [pfpUrl, setPfpUrl] = useState<string>(
    user?.profilePictureUrl
      ? `${config.apiUrl}${user.profilePictureUrl}`
      : `${config.apiUrl}/uploads/profile-pictures/default.jpeg`
  );

  const { values, handleChange, setValue, setAllValues } = useForm<ProfileFormData>({
    name: "", surname: "", username: "", email: "", password: "",
    birthDate: "", phone: "", address: "", city: "", province: "", country: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;

        const profile: UserProfileResponse = await profileService.getProfile();

        if (profile) {
          setAllValues({
            ...values,
            username: user.username,
            email: user.email,
            name: profile.firstName || "",
            surname: profile.lastName || "",
            birthDate: profile.birthDate ? String(profile.birthDate).split("T")[0] : "",
            phone: profile.phone || "",
            address: profile.address || "",
            city: profile.city || "",
            province: profile.province || "",
            country: profile.country || ""
          });
          if (profile.profilePictureUrl) {
            setPfpUrl(`${config.apiUrl}${profile.profilePictureUrl}`);
          }
        }
      } catch (error) {
        console.error("Error cargando perfil", error);
        // Fallback using user basic data
        if (user) {
          setValue("username", user.username);
          setValue("email", user.email);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    try {
      if (!values.name || !values.surname || !values.email) {
        alert("El Nombre, Apellido y Email son obligatorios.");
        return;
      }

      const payload = {
        firstName: values.name,
        lastName: values.surname,
        email: values.email,
        birthDate: values.birthDate,
        phone: values.phone,
        address: values.address,
        city: values.city,
        province: values.province,
        country: values.country,
      };

      await profileService.updateProfile(payload);

      updateUser({
        firstName: values.name,
        lastName: values.surname,
        email: values.email,
      });

      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el perfil");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await profileService.uploadProfilePicture(file);

      setPfpUrl(`${config.apiUrl}${response.pictureUrl}`);
      updateUser({
        profilePictureUrl: response.pictureUrl
      });
      alert("Foto de perfil actualizada");
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert("Error al subir la foto");
    }
  };

  return {
    values,
    handleChange,
    handleSave,
    pfpUrl,
    handleImageUpload
  };
};