
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/// <reference types="node" />
const processENV = process.env.TEST_ENV;
const env = processENV || 'prod';
console.log('Test environment is' + " " +env)
const config = {
  apiURL: 'https://conduit-api.bondaracademy.com/api',
  userEmail: 'user1234567@test.com',
  userPassword: 'user1234567',
};

export { config };

if(env === 'qa')
{
  config.userEmail = 'user7654321@test.com'
  config.userPassword = 'user7654321'
}

if(env === 'prod')
{
  if(!process.env.prod_Username || !process.env.prod_password)
  {
    throw Error('missing require environment variables')
  }
  config.userEmail = process.env.prod_Username ,
  config.userPassword = process.env.prod_password
}
