import axios from 'axios';

export class EnjiService {
  readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  async sendTotalUsersToEnji(users: number) {
    try {
      const { data } = await axios.get(this.url, { params: { count: users } });
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
