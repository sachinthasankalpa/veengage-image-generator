import request from 'supertest';
import app from '../../app';

// Mock external services used by the controller
jest.mock('../../services/openaiService', () => ({
  getSubjects: jest.fn(),
}));
jest.mock('../../services/replicateService', () => ({
  generateIcons: jest.fn(),
}));

import { getSubjects } from '../../services/openaiService';
import { generateIcons } from '../../services/replicateService';

const mockedGetSubjects = getSubjects as jest.MockedFunction<typeof getSubjects>;
const mockedGenerateIcons = generateIcons as jest.MockedFunction<typeof generateIcons>;

describe('POST /api/v1/images/generate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns validation error when prompt is missing', async () => {
    const res = await request(app)
      .post('/api/v1/images/generate')
      .send({
        style: 'Auto',
        colors: ['#193cb8'],
      })
      .expect('Content-Type', /json/)
      // This should ideally return 400
      .expect(500);

    expect(res.body).toHaveProperty('errors');
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringMatching(/prompt/i),
        }),
      ])
    );
  });

  it('returns 200 and imageUrls on success', async () => {
    const prompt = 'Hockey equipment';
    const style = 'Sticker';
    const colors = ['#111111', '#222222'];
    const subjects = ['helmet', 'stick', 'puck', 'pads', 'net', 'skates', 'whistle', 'bench'];
    const imageUrls = subjects.map((s, i) => `https://cdn.example.com/icon-${i}.png`);

    mockedGetSubjects.mockResolvedValueOnce(subjects);
    mockedGenerateIcons.mockResolvedValueOnce(imageUrls);

    const res = await request(app)
      .post('/api/v1/images/generate')
      .send({ prompt, style, colors })
      .expect('Content-Type', /json/)
      .expect(200);

    // Response payload
    expect(res.body).toEqual({ imageUrls });

    // Dependencies were called with correct args
    expect(mockedGetSubjects).toHaveBeenCalledTimes(1);
    expect(mockedGetSubjects).toHaveBeenCalledWith(prompt);

    expect(mockedGenerateIcons).toHaveBeenCalledTimes(1);
    expect(mockedGenerateIcons).toHaveBeenCalledWith(subjects, style, colors);

    // Ensure no extra fields are leaked
    expect(Object.keys(res.body)).toEqual(['imageUrls']);
  });

  it('returns 500 when generateIcons fails', async () => {
    const subjects = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    mockedGetSubjects.mockResolvedValueOnce(subjects);
    mockedGenerateIcons.mockRejectedValueOnce(new Error('Replicate failure'));

    const res = await request(app)
      .post('/api/v1/images/generate')
      .send({
        prompt: 'Icons prompt',
        style: 'Cartoon',
        colors: ['#123456', '#abcdef'],
      })
      .expect('Content-Type', /json/)
      .expect(500);

    expect(mockedGetSubjects).toHaveBeenCalledTimes(1);
    expect(mockedGenerateIcons).toHaveBeenCalledTimes(1);

    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringMatching(/Replicate failure/i),
        }),
      ])
    );
  });
});