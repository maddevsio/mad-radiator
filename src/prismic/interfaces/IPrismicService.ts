import { Client } from "@prismicio/client";

interface Embed {
  embed?: {
    type?: string
    html?: string
    thumbnail_url?: string
  }
}

interface TechAndTools {
  title?: string
  description?: string
}

interface OrderedList {
  list_item?: {
    text?: string
  }
}

interface Repeatable extends Embed, TechAndTools, OrderedList {}

interface BlogPost {
  data?: {
    body?: {
      slice_type?: string
      slice_variation?: string
      primary: {
        text?: string
        quote?: string
        tableRich?: string
      }
      items?: Repeatable[]
    }[]
    featured_image?: object
    title?: string
    date?: string
    header_plate_background_color?: string
    header_plate_button_text?: string
    header_plate_link?: string
    header_plate_text?: string
    introduction_paragraph?: string
    meta_description?: string
    meta_title?: string
    post_with_form?: boolean
    subtitle?: string
    updated_date?: string
  }
  uid: string | null
  first_publication_date?: string
  last_publication_date?: string
  id: string
  tags: string[]
  type: string
  isBroken?: boolean | undefined
  description?: string
  formattedDate?: string
  readTime?: string
  recommendedPosts?: any[]
  chapter_name?: any[]
  title?: string
  articleLink?: string
}
export interface BlogQueryResponse {
  page: number
  results_per_page: number
  results_size: number
  total_results_size: number
  total_pages: number
  next_page: string | null,
  prev_page: string | null,
  results: BlogPost[],
}

export interface IPrismicService {
  client: Client
  getBlogPagesForMonth(): Promise<BlogQueryResponse>
  getBlogPagesForWeek(): Promise<BlogQueryResponse>
}
