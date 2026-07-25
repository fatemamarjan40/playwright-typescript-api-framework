import { test } from '../utils/fixtures';
import { expect } from '../utils/custom-expect';


[
  {
    username: 'dd',
    usernameErrorMessage: 'is too short (minimum is 3 characters)',
  },
  {
    username: 'dfgg',
    usernameErrorMessage: '',
  },
  {
    username: 'mnbvcxzlkjhgfdsaqwer',
    usernameErrorMessage: '',
  },
  {
    username: 'mnbvcxzlkjhgfdsaqwert',
    usernameErrorMessage: 'is too long (maximum is 20 characters)',
  },
].forEach(({ username, usernameErrorMessage }) => {
  test(`Error message validation for ${username}`, async ({ api }) => {
    const newUserResponse = await api
      .path('/users')
      .body({
        user: {
          email: 'test@test.com',
          password: 'password123',
          username,
        },
      })
      .clearAuth()
      .PostRequest(422);

    if (username.length >= 3 && username.length <= 20) {
      expect(newUserResponse.errors).not.toHaveProperty('username');
    } else {
      expect(newUserResponse.errors.username[0]).ShouldEqual(
        usernameErrorMessage
      );
    }
  });
});