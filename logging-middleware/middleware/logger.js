const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwYW5rYWpwYXR3YWwxMjI0QGdtYWlsLmNvbSIsImV4cCI6MTc1MjU2MTIzOCwiaWF0IjoxNzUyNTYwMzM4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZmI5MDNmNzAtNThkYS00MWVjLWE4ODktNWNjYjgzMzYzOTUxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicGFua2FqIHBhdHdhbCIsInN1YiI6ImY1NWIxYmRkLWY5OGItNGI4Ni05ZDUxLTkzMTg0N2JmMjYxMCJ9LCJlbWFpbCI6InBhbmthanBhdHdhbDEyMjRAZ21haWwuY29tIiwibmFtZSI6InBhbmthaiBwYXR3YWwiLCJyb2xsTm8iOiIyMjYxNjUxIiwiYWNjZXNzQ29kZSI6IlFBaERVciIsImNsaWVudElEIjoiZjU1YjFiZGQtZjk4Yi00Yjg2LTlkNTEtOTMxODQ3YmYyNjEwIiwiY2xpZW50U2VjcmV0IjoiUEd1Q2NHQkRDdlBkZEptWiJ9.-gNHp412Fkr77OysyZCeaeOtiwdFELHUfiEvnRpG_lA';

async function logEvent(stack, level, packageName, message) {
  try {
    const response = await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        stack,
        level,
        package: packageName,
        message
      })
    });

    const data = await response.json();
    console.log('Log sent:', data);
  } catch (error) {
    console.error('Failed to send log:', error.message);
  }
}

module.exports = logEvent;
