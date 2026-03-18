const request = require('supertest');

const API_URL = 'http://localhost:5000';

describe('Backend API Tests', () => {
    test('POST /api/auth/login should reject invalid credentials', async () => {
        const response = await request(API_URL)
            .post('/api/auth/login')
            .send({
                email: 'supertest@fakemail.com',
                password: 'wrongpassword123'
            });
        
        expect(response.statusCode).not.toBe(200);
        expect(response.body).toHaveProperty('message');
    });
});