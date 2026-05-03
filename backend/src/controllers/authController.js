const User = require('../models/User');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const newUser = await User.create({
      username,
      email,
      password
    });

    await Profile.create({
      userId: newUser.id,
      firstName: '',
      lastName: ''
    });

    res.status(201).json({
      message: 'Usuario creado con éxito',
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({
      where: { email },
      include: [{ model: Profile, as: 'profile' }]
    });

    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated. Please contact the administrator.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate Token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // En local (http) va en false, en prod (https) en true
      sameSite: 'strict',
      maxAge: 1 * 60 * 60 * 1000
    });

    res.json({
      message: 'Successful login',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.profile ? user.profile.firstName : '',
        lastName: user.profile ? user.profile.lastName : '',
        profilePictureUrl: user.profile ? user.profile.profilePictureUrl : ''
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'role', 'isActive'],
      include: [{ model: Profile, as: 'profile' }]
    });

    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

    if (!user.isActive) {
      return res.status(403).json({ message: 'Tu cuenta ha sido desactivada.' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.profile ? user.profile.firstName : '',
        lastName: user.profile ? user.profile.lastName : '',
        profilePictureUrl: user.profile ? user.profile.profilePictureUrl : ''
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al verificar token' });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }

    const newPictureUrl = `/uploads/profile-pictures/${req.file.filename}`;
    const profile = await Profile.findOne({ where: { userId: req.user.id } });

    if (!profile) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    const oldPictureUrl = profile.profilePictureUrl;

    await profile.update({ profilePictureUrl: newPictureUrl });

    if (oldPictureUrl) {
      const oldFilePath = path.join(__dirname, '../..', oldPictureUrl);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log(`Foto vieja eliminada: ${oldFilePath}`);
      }
    }

    res.json({
      message: 'Foto de perfil actualizada y anterior eliminada con éxito',
      pictureUrl: newPictureUrl
    });

  } catch (error) {
    console.error("Error en updateProfilePicture:", error);
    res.status(500).json({ message: 'Error al procesar la imagen' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: 'Sesión cerrada con éxito' });
};
