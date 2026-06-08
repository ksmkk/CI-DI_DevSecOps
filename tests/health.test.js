const request = require('supertest');
const app = require('../src/index');

describe('API endpoints', () => {
  test('GET /health debe responder status ok', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('fail');
  });

  test('GET / debe responder mensaje Hola DevSecOps', async () => {
    const response = await request(app).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Hola DevSecOps');
  });
});