const User = require('../models/User');
const Profile = require('../models/Profile');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { Op } = require('sequelize');

exports.getUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const users = await User.findAll({
      where: { id: { [Op.ne]: currentUserId } },
      attributes: ['id', 'username', 'email'],
      include: [{ model: Profile, as: 'profile', attributes: ['firstName', 'lastName'] }]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error getting users' });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { targetUserId } = req.params;

    let conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { user1Id: currentUserId, user2Id: targetUserId },
          { user1Id: targetUserId, user2Id: currentUserId }
        ]
      }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        user1Id: currentUserId,
        user2Id: targetUserId
      });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo conversacion' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.findAll({
      where: { conversationId },
      order: [['createdAt', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo mensajes' });
  }
};
