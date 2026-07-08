export async function activateMembershipCode(code, accessToken) {
  const response = await fetch('http://localhost:8080/activate-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ code: String(code || '').trim().toUpperCase() }),
  })

  const result = await response.json()
  if (!response.ok) {
    throw result
  }
  return result.membership
}
