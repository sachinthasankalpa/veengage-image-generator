// Mock Replicate SDK constructor and its run method
const runMock = jest.fn();
const ReplicateMock = jest.fn(() => ({ run: runMock }));
jest.mock('replicate', () => ({
  __esModule: true,
  default: ReplicateMock,
}));

import { generateIcons } from '../replicateService';

describe('replicateService.generateIcons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns URLs when all predictions succeed and calls Replicate with expected inputs', async () => {
    const subjects = ['helmet', 'stick', 'puck'];
    const style = 'Sticker';
    const colors = ['#111111', '#222222'];

    runMock
      .mockResolvedValueOnce([{ url: () => 'https://cdn.example.com/icon-0.png' }])
      .mockResolvedValueOnce([{ url: () => 'https://cdn.example.com/icon-1.png' }])
      .mockResolvedValueOnce([{ url: () => 'https://cdn.example.com/icon-2.png' }]);

    const urls = await generateIcons(subjects, style, colors);

    expect(urls).toEqual([
      'https://cdn.example.com/icon-0.png',
      'https://cdn.example.com/icon-1.png',
      'https://cdn.example.com/icon-2.png',
    ]);

    expect(runMock).toHaveBeenCalledTimes(3);

    // Validate each call’s arguments
    const calls = runMock.mock.calls;
    calls.forEach((call, i) => {
      const [model, options] = call;
      expect(model).toBe('black-forest-labs/flux-schnell');
      expect(options).toEqual(
        expect.objectContaining({
          input: expect.objectContaining({
            prompt: expect.any(String),
            num_outputs: 1,
            output_format: 'png',
            num_inference_steps: 4,
          }),
        }),
      );

      const prompt: string = options.input.prompt;
      expect(prompt).toContain(`A centered image of ${subjects[i]}`);
    });
  });

  it('throws when all predictions fail', async () => {
    const subjects = ['one', 'two'];
    const style = 'Auto';
    const colors = ['#111111'];

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    runMock.mockRejectedValue(new Error('Prediction failed'));

    await expect(generateIcons(subjects, style, colors)).rejects.toThrow(
      'No icons were successfully generated.',
    );

    expect(runMock).toHaveBeenCalledTimes(subjects.length);
    errorSpy.mockRestore();
  });
});