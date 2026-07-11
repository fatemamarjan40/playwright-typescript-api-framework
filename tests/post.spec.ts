import { test, expect } from '@playwright/test';

let authToken: string;

test.beforeAll(async ({ request }) => {
  const tokenResponse = await request.post(
    'https://conduit-api.bondaracademy.com/api/users/login',
    {
      data: {
        user: {
          email: 'user1234567@test.com',
          password: 'user1234567',
        },
      },
    }
  );

  expect(tokenResponse.status()).toBe(200);

  const tokenResponseJson = await tokenResponse.json();
  authToken = `Token ${tokenResponseJson.user.token}`;
});

test('create, update, get and delete article', async ({ request }) => {
  // Create Article
  const articleResponse = await request.post(
    'https://conduit-api.bondaracademy.com/api/articles/',
    {
      headers: {
        Authorization: authToken,
      },
      data: {
        article: {
          title: 'test10',
          description: 'hijibiji',
          body: 'hijibiji 2',
          tagList: [],
        },
      },
    }
  );

  expect(articleResponse.status()).toBe(201);

  const articleResponseJson = await articleResponse.json();

  expect(articleResponseJson.article.title).toBe('test10');

  const slugId = articleResponseJson.article.slug;

  console.log('Created Article:', articleResponseJson);

  // Update Article
  const updateArticleResponse = await request.put(
    `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
    {
      headers: {
        Authorization: authToken,
      },
      data: {
        article: {
          title: 'test modified3',
          description: 'hijibiji',
          body: 'hijibiji 2',
          tagList: [],
        },
      },
    }
  );

  expect(updateArticleResponse.status()).toBe(200);

  const updateArticleResponseJson = await updateArticleResponse.json();

  expect(updateArticleResponseJson.article.title).toBe(
    'test modified3'
  );

  const newSlugId = updateArticleResponseJson.article.slug;

  console.log('Updated Article:', updateArticleResponseJson);

  // Get Articles
  const getArticleResponse = await request.get(
    'https://conduit-api.bondaracademy.com/api/articles?limit=1&offset=0',
    {
      headers: {
        Authorization: authToken,
      },
    }
  );

  expect(getArticleResponse.status()).toBe(200);

  const getArticleResponseJson = await getArticleResponse.json();

  console.log('Fetched Articles:', getArticleResponseJson);

  expect(getArticleResponseJson.articles[0].title).toBe(
    'test modified3'
  );

  // Delete Article
  const deleteArticleResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${newSlugId}`,
    {
      headers: {
        Authorization: authToken,
      },
    }
  );

  expect(deleteArticleResponse.status()).toBe(204);
});