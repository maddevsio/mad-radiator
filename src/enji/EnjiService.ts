import axios from 'axios';
import { getTwoDaysAgo } from 'utils/parseRange';

export class EnjiService {
  readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async sendTotalUsersToEnjiWithDate(users: number) {
    const date = getTwoDaysAgo()
    try {
      const params = {
        count: users,
        date: date.format('YYYY-MM-DD'),
      }
      console.log(`sendTotalUsersToEnjiWithDate():\n1. params.date: ${params.date}`)
      const { data } = await axios.get(this.url, { params });
      return data;
    } catch (error: any) {
      throw new Error(`Cannot send data to Enji: ${error.message}`);
    }
  }
}
