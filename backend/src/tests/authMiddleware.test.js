const authMiddleware = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');

describe('Auth Middleware', () => {
  it('should return 401 if no token is provided', () => {
    const req = { cookies: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Acceso denegado. No hay token.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if token is invalid', () => {
    const req = { cookies: { token: 'invalid_token' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    // Mock process.env.JWT_SECRET
    process.env.JWT_SECRET = 'secret';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido o expirado.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if token is valid', () => {
    process.env.JWT_SECRET = 'secret';
    const validToken = jwt.sign({ id: '123', role: 'admin' }, process.env.JWT_SECRET);
    
    const req = { cookies: { token: validToken } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(req.user.id).toBe('123');
    expect(req.user.role).toBe('admin');
    expect(next).toHaveBeenCalled();
  });
});
