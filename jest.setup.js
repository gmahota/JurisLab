// jest-dom adds custom jest matchers for asserting on DOM nodes
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
import '@testing-library/jest-dom';

// Set up environment variables for testing
process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/test_db';
process.env.OPENAI_API_KEY = 'test-api-key';

// Mock OpenAI for all tests
jest.mock('openai', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      summary: "Test summary",
                      keyPoints: ["Test key point 1", "Test key point 2"],
                      citations: ["Test citation 1"],
                      recommendations: ["Test recommendation 1"]
                    })
                  }
                }
              ]
            })
          }
        }
      };
    })
  };
});