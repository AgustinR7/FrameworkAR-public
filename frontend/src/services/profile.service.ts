import { config } from '../config';
const API_URL = `${config.apiUrl}/api/auth/profile`;

export const profileService = {
  getProfile: async () => {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al obtener el perfil');
    }

    return response.json();
  },

  updateProfile: async (profileData: any) => {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el perfil');
    }

    return response.json();
  },

  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file); 

    const response = await fetch(`${API_URL}/picture`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al subir la foto');
    }

    return response.json();
  }
};