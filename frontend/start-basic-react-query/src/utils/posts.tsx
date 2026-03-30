import {queryOptions} from '@tanstack/react-query'
import {notFound} from '@tanstack/react-router'
import {createServerFn} from '@tanstack/react-start'
import axios from 'redaxios'

export type PostType = {
  id: number
  title: string
  body: string
}

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'

export const fetchPosts = createServerFn({method: 'GET'}).handler(async () => {
  console.info('Fetching posts...')
  return axios.get<{items: Array<PostType>}>(BACKEND_URL + '/posts').then(r => r.data.items)
})

export const postsQueryOptions = () =>
  queryOptions({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
  })

export const fetchPost = createServerFn({method: 'GET'})
  .inputValidator((d: string) => d)
  .handler(async ({data}) => {
    console.info(`Fetching post with id ${data}...`)
    const post = await axios
      .get<PostType>(`${BACKEND_URL}/posts/${data}`)
      .then(r => r.data)
      .catch(err => {
        console.error(err)
        if (err.status === 404) {
          throw notFound()
        }
        throw err
      })

    return post
  })

export const postQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ['post', postId],
    queryFn: () => fetchPost({data: postId}),
  })
