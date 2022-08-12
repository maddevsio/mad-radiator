import axios from 'axios';
import { EnjiService } from 'enji/EnjiService';

jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: { success: true } }));

describe('EnjiService', () => {
  let enjiService: EnjiService;

  beforeEach(() => {
    enjiService = new EnjiService('url');
  });

  it('should send total users to Enji with date', async () => {
    const users = 10;
    const date = '2022-08-10';
    const params = {
      count: users,
      date,
    };

    const response = await enjiService.sendTotalUsersToEnjiWithDate(users);

    expect(axios.get).toHaveBeenCalledWith('url', { params });
    expect(response).toEqual({ success: true });
  });
})
