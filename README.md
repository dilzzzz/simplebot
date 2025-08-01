# Simple ChatBot 💬

A minimalist chatbot powered by OpenAI's ChatGPT API, built with vanilla HTML, CSS, and JavaScript for deployment on Netlify.

## Features

- Clean, responsive UI design
- Real-time chat interface with typing indicators
- Secure API key handling via Netlify Functions
- No external dependencies or frameworks
- Mobile-friendly design

## Setup

### 1. Clone and Install
```bash
npm install
```

### 2. Get OpenAI API Key
1. Visit [OpenAI API](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key for deployment

### 3. Local Development
```bash
npm run dev
```
This will start Netlify Dev server at `http://localhost:8888`

### 4. Deploy to Netlify

#### Option A: Netlify CLI
```bash
# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

#### Option B: Git Integration
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set the environment variable `OPENAI_API_KEY` in Netlify dashboard

### 5. Environment Variables
In your Netlify dashboard, add:
- **Variable name**: `OPENAI_API_KEY`
- **Value**: Your OpenAI API key

## Project Structure
```
simplebot/
├── index.html          # Main HTML file
├── style.css           # Styling
├── script.js           # Frontend JavaScript
├── netlify/
│   └── functions/
│       └── chat.js     # Netlify function for OpenAI API
├── netlify.toml        # Netlify configuration
├── package.json        # Project dependencies
└── README.md          # This file
```

## How It Works

1. User types a message in the chat interface
2. Frontend sends the message to `/netlify/functions/chat`
3. Netlify function securely calls OpenAI API using environment variable
4. Response is sent back to frontend and displayed in chat

## Security

- API key is stored as an environment variable on Netlify
- No sensitive data is exposed to the frontend
- CORS headers properly configured
- Input validation and error handling

## Customization

- Modify `style.css` for different themes
- Adjust OpenAI model parameters in `netlify/functions/chat.js`
- Update system prompt for different bot personalities

## License

MIT
