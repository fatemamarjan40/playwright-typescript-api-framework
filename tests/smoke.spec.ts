import { test } from '../utils/fixtures'
import { expect } from '../utils/custom-expect';
import { APIlogger } from '../utils/logger';
import { createToken } from '../helper/createToken';
import { validateSchema } from '../utils/schema-validator';
import articleRequestPayload from '../request-objects/Post-articles.json'



test('Get Articles', async ({ api }) => {

  const response = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  console.log(response)
  await expect(response).shouldMatchSchema('articles', 'Get_articles')

  expect(response.articles.length).toBeLessThanOrEqual(11)
  expect(response.articlesCount).ShouldEqual(12)
})

test('Get Tags', async ({ api }) => {
  const response = await api
    .path('/tags')
    .getRequest(200)
  await expect(response).shouldMatchSchema('tags', 'Get_tags')
  // await validateSchema('tags', 'Get_tags', response)
  expect(response.tags[0]).ShouldEqual("Test")
  expect(response.tags.length).toBeLessThanOrEqual(11)
})

test('Create and Delete Article', async ({ api }) => {
  const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload))
  articleRequest.article.title = "updated title"
  const createArticleResponse = await api
    .path('/articles')
    .body(articleRequest)
    .PostRequest(201)
    await expect(createArticleResponse).shouldMatchSchema('articles', 'Post_articles')

    expect(createArticleResponse.article.title).ShouldEqual('updated title');

  const slugId = createArticleResponse.article.slug;

  const updateArticleResponse = await api
    .path(`/articles/${slugId}`)
        .body({ "article": { "title": 'testing15', "description": 'hijibiji', "body": 'hijibiji 2', "tagList": [], }, })
    .PutRequest(200)
  expect(updateArticleResponse.article.title).ShouldEqual('testing15');

  const newSlugId = updateArticleResponse.article.slug;

  const getresponse = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(getresponse.articles[0].title).ShouldEqual('testing15');


  await api
    .path(`/articles/${newSlugId}`)
    .DeletetRequest(204)

  const getresponse2 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  expect(getresponse2.articles[0].title).not.ShouldEqual('testing15');

})