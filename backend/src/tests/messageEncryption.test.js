const sequelize = require('../config/db');
const Message = require('../models/Message');
const User = require('../models/User');
const Conversation = require('../models/Conversation');

describe('Message Encryption', () => {
  beforeAll(async () => {
    // Synchronize models in memory
    User.hasMany(Conversation, { foreignKey: 'user1Id' });
    Conversation.belongsTo(User, { foreignKey: 'user1Id' });
    User.hasMany(Conversation, { foreignKey: 'user2Id' });
    Conversation.belongsTo(User, { foreignKey: 'user2Id' });
    
    Conversation.hasMany(Message, { foreignKey: 'conversationId' });
    Message.belongsTo(Conversation, { foreignKey: 'conversationId' });
    
    User.hasMany(Message, { foreignKey: 'senderId' });
    Message.belongsTo(User, { foreignKey: 'senderId' });

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should encrypt and decrypt content transparently', async () => {
    const user1 = await User.create({ username: 'u1', email: 'u1@test.com', password: '123' });
    const user2 = await User.create({ username: 'u2', email: 'u2@test.com', password: '123' });
    const conversation = await Conversation.create({ user1Id: user1.id, user2Id: user2.id });

    const plainText = "Este es un mensaje secreto";
    
    const message = await Message.create({
      conversationId: conversation.id,
      senderId: user1.id,
      content: plainText
    });

    const rawData = await Message.findByPk(message.id, { raw: true });
    
    expect(rawData.content).not.toBe(plainText); // Should be encrypted in raw data
    expect(rawData.content).toMatch(/^[0-9a-fA-F]+:[0-9a-fA-F]+$/); // Format iv:hash
    
    const fetchedMessage = await Message.findByPk(message.id);
    expect(fetchedMessage.content).toBe(plainText); // Should be decrypted
  });
});
