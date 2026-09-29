const API_URL = 'http://127.0.0.1:8000';

export async function askAssistant(question) {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: question,
      messages: [],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error.detail || 'Failed to connect to the AI assistant.'
    );
  }

  const data = await response.json();

  return data.answer;
}