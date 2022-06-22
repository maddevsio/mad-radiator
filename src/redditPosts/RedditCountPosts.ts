import moment from "moment"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Reddit from 'reddit'

import { IRedditParams, Post, Posts } from "./interfaces"

export class RedditCountPosts {
  private redditConnect: Reddit

  constructor({
    redditClientId,
    redditClientSecret,
    redditUsername,
    redditPassword
  }: IRedditParams) {
    this.redditConnect = new Reddit({
      username: redditUsername,
      password: redditPassword,
      appId: redditClientId,
      appSecret: redditClientSecret,
      userAgent: 'Whatever',
    })
  }

  public async getPostsCountInReddit(): Promise<number> {
    try {
      const redditPosts = await this.getPosts()
      const filteredPostsByMonth = this.getPostsInCurrentMonth(redditPosts)
      const formatPosts = this.removeDuplicatePosts(filteredPostsByMonth)
      return formatPosts.length
    } catch (error: any) {
      throw new Error(error)
    }
  }

  private removeDuplicatePosts = (posts: Array<Posts>): Array<Post> => {
    return [...new Set(posts.map(post => post.data.title))]
  }

  private getPostsInCurrentMonth = (posts: Array<Posts>): Array<Posts> => posts.filter(post => moment().startOf('month').unix() < post.data.created_utc)

  private getPosts = async (nextPage: string | null = null): Promise<Array<Posts>> => {
    let posts: Array<Posts> = []
    try {
      const response = await this.redditConnect.get('/user/darikanur/submitted', { limit: 100, after: nextPage })
      posts = posts.concat(response.data.children)
      if (response.data.after) posts = posts.concat(await this.getPosts(response.data.after))
    } catch (error: any) {
      throw new Error(error)
    }
    return posts
  }
}
