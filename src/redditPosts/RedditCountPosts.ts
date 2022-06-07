import dotenv from "dotenv"
import moment from "moment"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Reddit from 'reddit'

import { Post, Posts } from "./interfaces"

// eslint-disable-next-line jest/require-hook
dotenv.config()

export class RedditCountPosts {
  private redditConnect: Reddit

  private redditClientId: string | undefined = process.env.REDDIT_CLIENT_ID

  private redditClientSecret: string | undefined = process.env.REDDIT_CLIENT_SECRET

  private redditUsername: string | undefined = process.env.REDDIT_USERNAME

  private redditPassword: string | undefined = process.env.REDDIT_PASSWORD


  constructor() {
    this.redditConnect = new Reddit({
      username: this.redditUsername,
      password: this.redditPassword,
      appId: this.redditClientId,
      appSecret: this.redditClientSecret,
      userAgent: 'Whatever',
    })
  }

  public async getPostsCountInReddit(): Promise<number> {
    const redditPosts = await this.getPosts()
    const filteredPostsByMonth = this.getPostsInCurrentMonth(redditPosts)
    const formatPosts = this.removeDuplicatePosts(filteredPostsByMonth)
    return formatPosts.length
  }

  private removeDuplicatePosts = (posts: Array<Posts>): Array<Post> => {
    return [...new Set(posts.map(post => post.data.title ))]
  }

  private getPostsInCurrentMonth = (posts: Array<Posts>): Array<Posts> => posts.filter(post => moment().startOf('month').unix() < post.data.created_utc)

  private getPosts = async (nextPage: string | null = null): Promise<Array<Posts>> => {
    let posts: Array<Posts> = []
    const response = await this.redditConnect.get('/user/darikanur/submitted', { limit: 100, after: nextPage })
    posts = posts.concat(response.data.children)
    if (response.data.after) posts = posts.concat(await this.getPosts(response.data.after))
    return posts
  }
}
