/// <reference types="node" />
const processENV = process.env.TEST_ENV;
const env = processENV || 'qa';
console.log('Test environment is' + " " +env)
const config = {
  apiURL: 'https://conduit-api.bondaracademy.com/api',
  userEmail: 'user1234567@test.com',
  userPassword: 'user1234567',
};

export { config };

if(env === 'qa')
{
  config.userEmail = 'user1234567@test.com'
  config.userPassword = 'user1234567'
}

if(env === 'prod')
{
  config.userEmail = 'user7654321@test.com'
  config.userPassword = 'user7654321'
}
