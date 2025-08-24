# Instagram API Setup Guide

This guide will help you set up the Instagram Basic Display API to show real Instagram posts on your website.

## 🚀 Quick Setup

### 1. Create a Facebook Developer Account
- Go to [Facebook Developers](https://developers.facebook.com/)
- Sign in with your Facebook account
- Complete the developer verification process if required

### 2. Create a New App
- Click "Create App"
- Choose "Consumer" as the app type
- Fill in your app details
- Click "Create App"

### 3. Add Instagram Basic Display
- In your app dashboard, click "Add Product"
- Find "Instagram Basic Display" and click "Set Up"
- Follow the setup wizard

### 4. Configure Instagram Basic Display
- Go to Instagram Basic Display > Basic Display
- Click "Create New App"
- Fill in the required information:
  - App Name: "YIPN Website"
  - App Description: "Website integration for YIPN Instagram posts"
  - App Icon: Upload your logo
  - Privacy Policy URL: Your website's privacy policy
  - Terms of Service URL: Your website's terms
  - App Purpose: "Website integration"

### 5. Get Your Access Token
- Go to Instagram Basic Display > Basic Display
- Click "Generate Token"
- Authorize your Instagram account
- Copy the generated access token

### 6. Get Your User ID
- Use the access token to make a test API call:
  ```
  https://graph.instagram.com/me?fields=id,username&access_token=YOUR_ACCESS_TOKEN
  ```
- Copy the `id` value from the response

### 7. Configure Environment Variables
Create a `.env.local` file in your project root:
```bash
# Instagram Basic Display API Configuration
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN=your_access_token_here
NEXT_PUBLIC_INSTAGRAM_USER_ID=your_user_id_here
```

### 8. Test the Integration
- Restart your development server
- Visit your website
- Check the Instagram section for real data

## 🔧 API Features

The integration includes:
- ✅ Real Instagram posts from the last 14 days
- ✅ Actual post content and images
- ✅ Real engagement metrics (likes, comments)
- ✅ Media type detection (Image, Video, Album)
- ✅ Automatic refresh functionality
- ✅ Fallback data if API fails
- ✅ Error handling and user feedback

## 📱 What Gets Displayed

- **Post Content**: Caption text from Instagram
- **Media**: Images or video thumbnails
- **Engagement**: Real like and comment counts
- **Timestamps**: Relative time (e.g., "2h ago")
- **Media Type**: Visual indicators for different content types
- **Direct Links**: Click to view posts on Instagram

## 🚨 Important Notes

1. **Access Token Expiry**: Long-lived tokens expire after 60 days
2. **Rate Limits**: Instagram has API rate limits
3. **Privacy**: Only public posts are accessible
4. **Permissions**: Users must authorize your app

## 🔄 Token Refresh

To refresh your access token:
1. Go to Instagram Basic Display > Basic Display
2. Click "Generate Token" again
3. Update your `.env.local` file
4. Restart your development server

## 🆘 Troubleshooting

### Common Issues:

1. **"Instagram API not configured"**
   - Check your `.env.local` file
   - Ensure environment variables are set correctly

2. **"Failed to fetch Instagram data"**
   - Verify your access token is valid
   - Check if your user ID is correct
   - Ensure your Instagram account is public

3. **"No posts found"**
   - Check if you have posts in the last 14 days
   - Verify your account has public posts

4. **CORS Errors**
   - Instagram API should work from client-side
   - Check browser console for specific errors

### Debug Steps:
1. Check browser console for errors
2. Verify API credentials in `.env.local`
3. Test API endpoints manually
4. Check Instagram account privacy settings

## 📚 Additional Resources

- [Instagram Basic Display API Documentation](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Facebook Developers](https://developers.facebook.com/)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)

## 🎯 Next Steps

After setup:
1. Test with real Instagram posts
2. Customize the display styling
3. Add more error handling if needed
4. Consider caching for better performance
5. Monitor API usage and rate limits

---

**Need Help?** Check the troubleshooting section or refer to the official Instagram API documentation.
