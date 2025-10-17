const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Método só POST' };

    const { presente, nome } = JSON.parse(event.body);
    const FORM_ID = 'lKoCJSy5rO0';
    const API_KEY = 'k100jb17xHTsuj9aCpmfUS4MYOTJTGGX2o1EXDiG80VYnwVJBYjLGKD9tfOHIiuz';

    try {
        const response = await fetch(`https://formcarry.com/api/form/${FORM_ID}/submissions`, {
            method: 'POST',
            headers: { 'api_key': API_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fields: [
                    { name: 'presente', value: presente },
                    { name: 'nome', value: nome }
                ]
            })
        });

        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
