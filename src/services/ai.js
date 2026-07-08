const AI_BASE_URL = import.meta.env.VITE_AI_API_URL || ''
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || ''

async function fetchAi(payload) {
  if (!AI_BASE_URL || !AI_API_KEY) {
    return null
  }

  const response = await fetch(AI_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('AI request failed')
  }

  return response.json()
}

export async function getPersonalizedBookRecommendations(profile = {}, readingActivity = {}) {
  const fallback = [
    { title: 'Essentialism', author: 'Greg McKeown', reason: 'Perfect follow-up for fans of Atomic Habits and Deep Work.' },
    { title: 'The Midnight Library', author: 'Matt Haig', reason: 'A literary recommendation for contemplative readers interested in meaningful stories.' },
    { title: 'The Invisible Life of Addie LaRue', author: 'V.E. Schwab', reason: 'A character-driven novel that resonates with thoughtful book club members.' },
  ]

  if (!AI_BASE_URL || !AI_API_KEY) {
    return fallback
  }

  const payload = {
    model: 'groq:latest',
    prompt: `Generate personalized book recommendations based on this user profile and reading activity. Profile: ${JSON.stringify(profile)} Activity: ${JSON.stringify(readingActivity)}`,
    max_tokens: 250,
  }

  const data = await fetchAi(payload)
  return data?.recommendations || fallback
}

export async function getSmartSearchResults(query) {
  if (!AI_BASE_URL || !AI_API_KEY) {
    return []
  }

  const payload = {
    model: 'groq:latest',
    prompt: `Create a smart book search result list for the query: "${query}". Return short recommendations.`,
    max_tokens: 250,
  }

  const data = await fetchAi(payload)
  return data?.results || []
}

export async function getDiscussionQuestions(bookTitle) {
  const fallback = [
    `What lesson did you learn from ${bookTitle}?`,
    `Which character in ${bookTitle} did you relate to most?`,
    `How would you change the ending of ${bookTitle}?`,
  ]

  if (!AI_BASE_URL || !AI_API_KEY) {
    return fallback
  }

  const payload = {
    model: 'groq:latest',
    prompt: `Generate three discussion questions for the book titled ${bookTitle}.`,
    max_tokens: 150,
  }

  const data = await fetchAi(payload)
  return data?.questions || fallback
}

export async function getReadingInsights(activity = {}) {
  const fallback = {
    preferredGenre: 'Mystery',
    averagePages: 20,
    readingStreak: 10,
    sessionWindow: 'Night',
  }

  if (!AI_BASE_URL || !AI_API_KEY) {
    return fallback
  }

  const payload = {
    model: 'groq:latest',
    prompt: `Analyze the following reading activity and return a summary of the user\u2019s favorite genre, average pages per session, streak, and reading window: ${JSON.stringify(activity)}`,
    max_tokens: 200,
  }

  const data = await fetchAi(payload)
  return data?.insights || fallback
}
