const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const fakeUser = {
  email: 'ElijahProsperie',
  password: '123',
};

const register = async (userProps = {}) => {
  const password = userProps.password ?? fakeUser.password;
  //create agent that gives ability to store cookies between test
  const agent = request.agent(app);

  //create user to sign in with
  const user = await UserService.create({ ...fakeUser, ...userProps });
  //sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });
  //POST to create a user
  it('should create a user', async () => {
    const res = await request(app).post('/api/v1/users').send(fakeUser);
    const { email } = fakeUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  //sign in
  it('Should sign in', async () => {
    const [agent, user] = await register();
    const res = await agent.post('/api/v1/users/sessions').send(fakeUser);

    expect(res.body).toEqual({
      message: 'Signed in successfully!',
    });
  });

  //sign out
  it('should sign out a user', async () => {
    const res = await request(app)
      .delete('/api/v1/users/sessions')
      .send(fakeUser);
    expect(res.body).toEqual({
      message: 'Signed Out',
      success: true,
    });
  });
});
