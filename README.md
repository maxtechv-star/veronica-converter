```markdown
# Veronica Converter

A video to MP3 converter web application that allows users to upload videos (under 10MB) and convert them to MP3 format.

## Features

- Upload videos up to 10MB
- Drag & drop interface
- Multiple audio quality options
- Secure file handling (files deleted after conversion)
- Responsive design
- No user registration required

## Local Development

1. Install dependencies:
```bash
npm install
```

1. Install FFmpeg (required for conversion):

· Windows: Download from https://ffmpeg.org/download.html
· Mac: brew install ffmpeg
· Linux: sudo apt-get install ffmpeg

1. Start the development server:

```bash
npm run dev
```

1. Open http://localhost:3000

Deployment to Vercel

1. Push code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Install Vercel CLI:

```bash
npm i -g vercel
```

1. Deploy:

```bash
vercel
```

1. Follow the prompts to complete deployment

Environment Variables

No environment variables are required for basic functionality.

Project Structure

· server.js - Main Express server
· views/ - EJS templates
· public/ - Static assets (CSS, JS)
· api/ - API routes for upload and conversion
· uploads/ - Temporary storage for uploaded videos
· converted/ - Temporary storage for converted MP3s

Limitations

· Maximum file size: 10MB
· Supports common video formats (MP4, AVI, MOV, WMV, FLV)
· Files are deleted immediately after download

License

MIT

```

## Installation and Setup Instructions

1. **Create the project structure:**
```bash
mkdir veronica-converter
cd veronica-converter
```

1. Initialize npm project:

```bash
npm init -y
```

1. Install dependencies:

```bash
npm install express ejs multer fluent-ffmpeg fs-extra
```

1. Install FFmpeg (required for conversion):

· Windows: Download from https://ffmpeg.org/download.html
· Mac: brew install ffmpeg
· Linux: sudo apt-get install ffmpeg

1. Create all the files as shown in the structure above.
2. Run the application:

```bash
npm start
```

1. For development with auto-restart:

```bash
npm install --save-dev nodemon
npm run dev
```

1. Deploy to Vercel:
   · Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
   · Connect your repository to Vercel
   · Vercel will automatically detect the configuration and deploy

Note: For production deployment, you may need to configure FFmpeg on your Vercel deployment. Consider using a cloud-based FFmpeg service or a serverless function with FFmpeg support if you encounter issues with FFmpeg on Vercel.