import { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Chip, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import axios from 'axios';
import { config } from '../../config';
import DialogWrapper from '../ui/DialogWrapper';
import SkewButton from '../ui/buttons/SkewButton';
import { useTranslation } from 'react-i18next';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  profile?: {
    firstName: string;
    lastName: string;
  };
}

export default function UserControlTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  // Modal state for reset password
  const [openModal, setOpenModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  // Create User State
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openCreateSuccessModal, setOpenCreateSuccessModal] = useState(false);
  const [createData, setCreateData] = useState({ username: '', email: '', role: 'user' });
  const [createdPassword, setCreatedPassword] = useState('');

  // Delete User State
  const [openDeleteModal1, setOpenDeleteModal1] = useState(false);
  const [openDeleteModal2, setOpenDeleteModal2] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteEmailConfirm, setDeleteEmailConfirm] = useState('');

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/admin/users`, { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      await axios.put(`${config.apiUrl}/api/admin/users/${id}/status`, {}, { withCredentials: true });
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Error toggling status', error);
      alert('Error al cambiar el estado del usuario');
    }
  };

  const handleResetPasswordClick = (id: string) => {
    setSelectedUserId(id);
    setNewPassword(generateRandomPassword());
    setOpenModal(true);
  };

  const submitResetPassword = async () => {
    if (!selectedUserId || newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    try {
      await axios.put(`${config.apiUrl}/api/admin/users/${selectedUserId}/password`,
        { newPassword },
        { withCredentials: true }
      );
      alert('Contraseña actualizada correctamente');
      setOpenModal(false);
    } catch (error) {
      console.error('Error resetting password', error);
      alert('Error al reiniciar contraseña');
    }
  };

  const handleCreateUser = async () => {
    if (!createData.username || !createData.email) {
      alert('Debes completar el usuario y el email');
      return;
    }
    const generatedPwd = generateRandomPassword();
    try {
      await axios.post(`${config.apiUrl}/api/admin/users`,
        { ...createData, password: generatedPwd },
        { withCredentials: true }
      );
      setCreatedPassword(generatedPwd);
      setOpenCreateModal(false);
      setOpenCreateSuccessModal(true);
      setCreateData({ username: '', email: '', role: 'user' });
      fetchUsers();
    } catch (error: any) {
      console.error('Error creating user', error);
      alert(error.response?.data?.message || 'Error al crear usuario');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdPassword);
    alert('Contraseña copiada al portapapeles');
  };

  const handleDeleteStep1 = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteModal1(true);
  };

  const handleDeleteStep2 = () => {
    setOpenDeleteModal1(false);
    setDeleteEmailConfirm('');
    setOpenDeleteModal2(true);
  };

  const submitDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await axios.delete(`${config.apiUrl}/api/admin/users/${userToDelete.id}`, { withCredentials: true });
      alert('Usuario eliminado permanentemente');
      setOpenDeleteModal2(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user', error);
      alert('Error al eliminar usuario');
    }
  };

  if (loading) return <Typography>{t("userControl.alerts.loading")}</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">{t("userControl.title")}</Typography>
        <Box sx={{ width: '200px' }}>
          <SkewButton 
            text={t("userControl.addUser")} 
            customColor="var(--color-pastel-green)" 
            secondaryColor="#252525"
            onClick={() => setOpenCreateModal(true)} 
            style={{ fontSize: '1rem' }}
          />
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("userControl.table.username")}</TableCell>
              <TableCell>{t("userControl.table.name")}</TableCell>
              <TableCell>{t("userControl.table.email")}</TableCell>
              <TableCell>{t("userControl.table.role")}</TableCell>
              <TableCell>{t("userControl.table.status")}</TableCell>
              <TableCell align="right">{t("userControl.table.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.profile?.firstName} {user.profile?.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === 'admin' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive ? t("userControl.table.active") : t("userControl.table.blocked")}
                    color={user.isActive ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, minWidth: '400px' }}>
                    <SkewButton
                      text={t("userControl.actions.resetPassword")}
                      customColor="var(--color-pastel-cyan)"
                      secondaryColor="#252525"
                      onClick={() => handleResetPasswordClick(user.id)}
                      style={{ fontSize: '0.9rem' }}
                    />
                    <SkewButton
                      text={user.isActive ? t("userControl.actions.block") : t("userControl.actions.activate")}
                      customColor={user.isActive ? 'var(--color-pastel-orange)' : 'var(--color-pastel-green)'}
                      secondaryColor="#252525"
                      onClick={() => handleToggleStatus(user.id)}
                      style={{ fontSize: '0.9rem' }}
                    />
                    <SkewButton
                      text={t("userControl.actions.delete")}
                      customColor="var(--color-pastel-red)"
                      secondaryColor="#252525"
                      onClick={() => handleDeleteStep1(user)}
                      style={{ fontSize: '0.9rem' }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DialogWrapper
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Reiniciar Contraseña"
        maxWidth="sm"
        actions={
          <>
            <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
            <Button onClick={submitResetPassword} variant="contained" color="primary">Confirmar Reinicio</Button>
          </>
        }
      >
        <Typography variant="body1" sx={{ mb: 2 }}>
          Se ha generado la siguiente contraseña aleatoria para el usuario seleccionado.
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Por favor, cópiala y compártela con el usuario antes de confirmar.
        </Typography>
        <TextField
          fullWidth
          type="text"
          label="Nueva Contraseña Generada"
          value={newPassword}
          InputProps={{
            readOnly: true,
          }}
        />
      </DialogWrapper>

      <DialogWrapper
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        title="Agregar Nuevo Usuario"
        maxWidth="sm"
        actions={
          <>
            <Button onClick={() => setOpenCreateModal(false)}>Cancelar</Button>
            <Button onClick={handleCreateUser} variant="contained" color="primary">Crear y Generar Clave</Button>
          </>
        }
      >
        <TextField fullWidth label="Nombre de Usuario" margin="normal" value={createData.username} onChange={(e) => setCreateData({ ...createData, username: e.target.value })} />
        <TextField fullWidth label="Email" margin="normal" type="email" value={createData.email} onChange={(e) => setCreateData({ ...createData, email: e.target.value })} />
        <FormControl fullWidth margin="normal">
          <InputLabel>Rol</InputLabel>
          <Select value={createData.role} label="Rol" onChange={(e) => setCreateData({ ...createData, role: e.target.value })}>
            <MenuItem value="user">Usuario normal (user)</MenuItem>
            <MenuItem value="admin">Administrador (admin)</MenuItem>
          </Select>
        </FormControl>
      </DialogWrapper>

      <DialogWrapper
        open={openCreateSuccessModal}
        onClose={() => setOpenCreateSuccessModal(false)}
        title="Usuario Creado"
        maxWidth="xs"
        actions={<Button onClick={() => setOpenCreateSuccessModal(false)} variant="contained">Cerrar</Button>}
      >
        <Typography variant="body1" sx={{ mb: 2 }}>El usuario ha sido creado correctamente.</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>Esta es su contraseña temporal generada al azar:</Typography>
        <TextField fullWidth value={createdPassword} InputProps={{ readOnly: true }} sx={{ mb: 2 }} />
        <Button variant="outlined" fullWidth onClick={copyToClipboard}>Copiar al portapapeles</Button>
      </DialogWrapper>

      <DialogWrapper
        open={openDeleteModal1}
        onClose={() => setOpenDeleteModal1(false)}
        title="Eliminar Usuario"
        maxWidth="sm"
        actions={
          <>
            <Button onClick={() => setOpenDeleteModal1(false)}>Cancelar</Button>
            <Button onClick={handleDeleteStep2} variant="contained" color="error">Eliminar</Button>
          </>
        }
      >
        <Typography>¿Estás seguro de que deseas eliminar permanentemente a <b>{userToDelete?.username}</b>? Esta acción borrará todos sus datos y perfil.</Typography>
      </DialogWrapper>

      <DialogWrapper
        open={openDeleteModal2}
        onClose={() => setOpenDeleteModal2(false)}
        title="Confirmación Final"
        maxWidth="xs"
        actions={
          <>
            <Button onClick={() => setOpenDeleteModal2(false)}>Cancelar</Button>
            <Button
              onClick={submitDeleteUser}
              variant="contained"
              color="error"
              disabled={deleteEmailConfirm !== userToDelete?.email}
            >
              Borrar Definitivamente
            </Button>
          </>
        }
      >
        <Typography sx={{ mb: 2 }}>Para confirmar, escribe exactamente el correo del usuario: <b>{userToDelete?.email}</b></Typography>
        <TextField fullWidth value={deleteEmailConfirm} onChange={(e) => setDeleteEmailConfirm(e.target.value)} label="Escribe el email aquí" />
      </DialogWrapper>

    </Box>
  );
}
