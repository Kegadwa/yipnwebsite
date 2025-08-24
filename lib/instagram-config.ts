// Instagram Basic Display API Configuration
// Get these from: https://developers.facebook.com/docs/instagram-basic-display-api/getting-started

export const INSTAGRAM_CONFIG = {
  // Your Instagram Access Token (Long-lived token)
  accessToken: process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN || '',
  
  // Your Instagram User ID
  userId: process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID || '',
  
  // API Endpoint
  apiEndpoint: 'https://graph.instagram.com/v12.0'
};

// Instructions to get Instagram API credentials:
// 1. Go to https://developers.facebook.com/
// 2. Create a new app or use existing one
// 3. Add Instagram Basic Display product
// 4. Go to Instagram Basic Display > Basic Display
// 5. Create a new app and get your access token
// 6. Get your user ID from the API response
// 7. Add these to your .env.local file:
//    NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN=your_token_here
//    NEXT_PUBLIC_INSTAGRAM_USER_ID=your_user_id_here
