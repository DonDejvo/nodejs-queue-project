# Setup dev

1. Run `npm install`
2. Create .env file and fill in
  - `REDIS_URL` - Connection URL to your Redis database
3. Run `npm run dev`


# Use

## Send email

1. Open tool like Postman or Insomnia
2. Create new POST request
3. Set endpoint to `http://localhost:7890/send-email`
4. Set body type to JSON and  fill in
  - `from` - sender email
  - `to` - receiver email
  - `subject` - email subject
  - `text` - email content
