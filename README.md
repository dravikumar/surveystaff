# SurveyStaff
Full stack survey app

This is a pretty straightforward survey app that has limited functionality (Sign in, survey creation, Home page, sign out) that connects to Supabase. It's a project to learn React, Django, and Supabase from framework and db lenses. It's even more intended to learn how to use Cursor + Claude hands-on along with OpenAI APIs in a web app.
You can hit the server with an OAI call although it is not incorporated into the UI.

Thanks to @Volo for the inspiration with his YouTube video, which provided the initial idea and structure behind this project. 

On to the next.

## Project Structure

This project consists of two main components:
- `server`: Django backend with REST API
- `ui`: React frontend

## Environment Setup

### Server Environment Variables

The server uses environment variables for configuration. Create a `.env` file in the `server` directory based on the provided `.env.example` template:

```bash
# Copy the example file
cp server/.env.example server/.env

# Edit the .env file with your actual values
nano server/.env
```

Required environment variables:
- `DJANGO_SECRET_KEY`: Secret key for Django
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon key
- `OPENAI_API_KEY`: Your OpenAI API key (if using AI features)
- `FRONTEND_URL`: URL of the frontend application (for redirects)

### UI Environment Variables

The UI now uses the server API for all Supabase operations, so no direct Supabase credentials are needed in the frontend.

## Development

### Running the Server

```bash
cd server
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Running the UI

```bash
cd ui
npm install
npm start
```

## API Documentation

The server provides REST API endpoints for:
- Authentication (login, register, etc.)
- Data operations
- File storage operations

See the API documentation for more details.
