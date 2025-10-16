const fetch = require('node-fetch'); // Já incluso no Netlify

exports.handler = async (event, context) => {
  const FORM_ID = 'lKoCJSy5rO0';
  const API_KEY = 'k100jb17xHTsuj9aCpmfUS4MYOTJTGGX2o1EXDiG80VYnwVJBYjLGKD9tfOHIiuz'; // Sua key

  try {
    const response = await fetch(`https://formcarry.com/api/form/${FORM_ID}/submissions?limit=50`, {
      headers: {
        'api_key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    const takenItems = data.submissions
      .flatMap(sub => sub.fields || [])
      .filter(field => field.name === 'presente')
      .map(field => field.value)
      .filter(value => value);

    const uniqueTaken = [...new Set(takenItems)];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Permite CORS pro browser
      },
      body: JSON.stringify({ takenItems: uniqueTaken }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
