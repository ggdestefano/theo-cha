const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const FORM_ID = 'lKoCJSy5rO0';
  const API_KEY = 'k100jb17xHTsuj9aCpmfUS4MYOTJTGGX2o1EXDiG80VYnwVJBYjLGKD9tfOHIiuz';

  try {
    const response = await fetch(`https://formcarry.com/api/form/${FORM_ID}/submissions?limit=50`, {
      headers: {
        'api_key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    // 🔧 AJUSTE 1: Verifica se submissions existe
    if (!data.submissions || !Array.isArray(data.submissions)) {
      return {
        statusCode: 200,
        body: JSON.stringify({ takenItems: [] })
      };
    }

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
        'Access-Control-Allow-Origin': '*',
        // 🔧 AJUSTE 2: Cache de 5min pra performance
        'Cache-Control': 'public, max-age=300'
      },
      body: JSON.stringify({ 
        takenItems: uniqueTaken,
        total: uniqueTaken.length  // 🔧 Bônus: conta quantos
      }),
    };
  } catch (error) {
    console.error('Erro na função:', error); // 🔧 Log no Netlify
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

