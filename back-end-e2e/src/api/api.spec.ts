import axios from 'axios';

describe('GET /api/v1/healthz', () => {
  it('should return health status', async () => {
    const res = await axios.get(`/api/v1/healthz`);

    expect(res.status).toBe(200);
    expect(res.data.status).toBe('ok');
  });
});
