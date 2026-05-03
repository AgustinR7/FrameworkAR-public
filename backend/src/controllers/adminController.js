const User = require('../models/User');
const Profile = require('../models/Profile');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'isActive', 'createdAt'],
      include: [{ model: Profile, as: 'profile' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

exports.resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // The password will be encrypted automatically by the beforeUpdate hook of the User model
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar contraseña' });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Prevenir que un admin se desactive a sí mismo (optional, but good practice)
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot deactivate your own account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    const statusMsg = user.isActive ? 'activado' : 'desactivado';
    res.json({ message: `Usuario ${statusMsg} correctamente`, isActive: user.isActive });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al cambiar el estado del usuario' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(409).json({ message: 'El usuario ya existe' });

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) return res.status(400).json({ message: 'El email ya está registrado' });

    const newUser = await User.create({
      username,
      email,
      password,
      role
    });

    await Profile.create({
      userId: newUser.id,
      firstName: '',
      lastName: ''
    });

    res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    await Profile.destroy({ where: { userId: id } });
    await user.destroy();

    res.json({ message: 'Usuario eliminado permanentemente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};
