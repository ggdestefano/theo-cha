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
