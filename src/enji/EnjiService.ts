import axios from 'axios';
import { Moment } from 'moment';

export class EnjiService {
  readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async sendTotalUsersToEnjiWithDate(users: number, analyticsDate: Moment) {
    try {
      const params = {
        count: users,
        date: analyticsDate.format('YYYY-MM-DD'),
      }
      const { data } = await axios.get(this.url, { params });
      console.log(data);
      return data;
    } catch (error: any) {
      throw new Error(`Cannot send data to Enji: ${error.message}`);
    }
  }
}
