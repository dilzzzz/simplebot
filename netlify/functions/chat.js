const https = require('https');

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Check if API key is configured
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'OpenAI API key not configured' })
            };
        }

        // Parse request body
        const { message } = JSON.parse(event.body);
        if (!message || typeof message !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Message is required' })
            };
        }

        // Prepare OpenAI API request
        const requestData = JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant. Keep your responses concise and friendly.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 500,
            temperature: 0.7
        });

        // Make request to OpenAI API
        const response = await makeOpenAIRequest(apiKey, requestData);
        
        if (response.error) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: response.error })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ response: response.content })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

function makeOpenAIRequest(apiKey, requestData) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Content-Length': Buffer.byteLength(requestData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    
                    if (res.statusCode !== 200) {
                        resolve({ error: response.error?.message || 'OpenAI API error' });
                        return;
                    }

                    if (response.choices && response.choices[0] && response.choices[0].message) {
                        resolve({ content: response.choices[0].message.content });
                    } else {
                        resolve({ error: 'Invalid response from OpenAI API' });
                    }
                } catch (parseError) {
                    resolve({ error: 'Failed to parse OpenAI API response' });
                }
            });
        });

        req.on('error', (error) => {
            resolve({ error: 'Failed to connect to OpenAI API' });
        });

        req.write(requestData);
        req.end();
    });
}
