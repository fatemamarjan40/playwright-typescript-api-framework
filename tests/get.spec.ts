import { test, expect } from '@playwright/test';

test.skip('Get request', async ({ request }) => { // want skip execution for this request
  const tagsResponse =  await request.get('https://conduit-api.bondaracademy.com/api/tags')

  const tagsResponseJson = await tagsResponse.json()
  expect(tagsResponse.status()).toEqual(201);
  expect(tagsResponseJson.tags[0]).toBe("Test")
  expect(tagsResponseJson.tags.length).toBeLessThanOrEqual(10)
  console.log(tagsResponseJson);
});

test.only('Get All Articles', async({ request }) => // want to run this one 
{
 
  const articleResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=1&offset=0')
  const articleResponseJson = await articleResponse.json()
    expect(articleResponse.status()).toEqual(200);
  expect(articleResponseJson.articles.length).toBeLessThanOrEqual(1)
  expect(articleResponseJson.articlesCount).toBeLessThanOrEqual(10)
  console.log(articleResponseJson)
})