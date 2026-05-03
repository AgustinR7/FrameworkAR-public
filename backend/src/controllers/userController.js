const User = require('../models/User');
const Profile = require('../models/Profile');

exports.getProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const profile = await Profile.findOne({ where: { userId: id } });

    if (!profile) return res.status(404).json({ message: 'Perfil no encontrado' });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const { firstName, lastName, email, birthDate, phone, address, city, province, country } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'Nombre, apellido y email son obligatorios.' });
    }

    const profile = await Profile.findOne({ where: { userId: id } });
    const parsedBirthDate = birthDate ? birthDate : null;

    if (!profile) {
      await Profile.create({
        userId: id, firstName, lastName, birthDate: parsedBirthDate, phone, address, city, province, country
      });
    } else {
      await profile.update({
        firstName, lastName, birthDate: parsedBirthDate, phone, address, city, province, country
      });
    }

    const user = await User.findByPk(id);
    if (user && user.email !== email) {
      await user.update({ email });
    }

    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};