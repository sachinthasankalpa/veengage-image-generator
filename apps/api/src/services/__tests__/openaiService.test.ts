// Mock OpenAI SDK and expose the create function for assertions
const createMock = jest.fn();
const mockInstance = { responses: { create: createMock } };
const OpenAIMock = jest.fn(() => mockInstance);

jest.mock('openai', () => ({
  __esModule: true,
  default: OpenAIMock,
}));

import { getSubjects } from '../openaiService';

describe('openaiService.getSubjects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('parses subjects from JSON (handles code fences and trims items)', async () => {
    const theme = 'Hockey equipment';
    const json = `{
      "subjects": ["  helmet  ", "stick", "puck", "pads", "net", "skates", " whistle ", "bench" ]
    }`;

    createMock.mockResolvedValueOnce({
      output_text: '```json\n' + json + '\n```',
    });

    const result = await getSubjects(theme);

    expect(result).toEqual([
      'helmet',
      'stick',
      'puck',
      'pads',
      'net',
      'skates',
      'whistle',
      'bench',
    ]);
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it('uses the first valid string array when "subjects" is missing/invalid', async () => {
    const theme = 'Science';
    const payload = {
      subjects: ['', '   '], // invalid
      icons: ['atom', 'microscope', 'satellite', 'rocket', 'telescope', 'dna', 'planet', 'comet'],
    };

    createMock.mockResolvedValueOnce({
      output_text: JSON.stringify(payload),
    });

    const result = await getSubjects(theme);

    expect(result).toEqual(payload.icons);
  });

  it('falls back to dummy subjects when JSON is invalid', async () => {
    const theme = 'Gardening';

    createMock.mockResolvedValueOnce({
      output_text: 'this is not json',
    });

    const result = await getSubjects(theme);

    expect(result).toHaveLength(8);
    // Fallback pattern: "<theme> item <n>"
    result.forEach((s, i) => {
      expect(s).toBe(`${theme} item ${i + 1}`);
    });
  });

  it('falls back to dummy subjects when OpenAI call throws', async () => {
    const theme = 'Music';

    createMock.mockRejectedValueOnce(new Error('OpenAI unavailable'));

    const result = await getSubjects(theme);

    expect(result).toHaveLength(8);
    result.forEach((s, i) => {
      expect(s).toBe(`${theme} item ${i + 1}`);
    });
  });
});