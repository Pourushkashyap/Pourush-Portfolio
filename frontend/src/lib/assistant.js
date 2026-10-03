const API_URL = 'https://pourush-portfolio.onrender.com';

export async function askAssistant(question, messages = []) {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: question,
      messages: messages,
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