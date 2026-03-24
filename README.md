<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/e09aebd2-e973-4a8b-ae5d-c54116dd2974

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Demo Mode Toggle

This prototype supports a demo bypass mode for the Quote / Your Move / Admin flows.

- `VITE_DEMO_MODE=true` (default if unset): keeps demo bypasses enabled (e.g., `ESP-12345`, admin demo password).
- `VITE_DEMO_MODE=false`: disables demo-only bypass logic so the app expects secure backend auth/API routes.

Example `.env.local`:

```
VITE_DEMO_MODE=true
```

