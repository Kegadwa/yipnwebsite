import { blogService } from './firebase-services';
import { serverTimestamp } from 'firebase/firestore';

interface BlogPost {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: Date;
  tags: string[];
  category: string;
  imageUrl?: string;
  isPublished: boolean;
  slug: string;
  readTime: number;
}

const sampleBlogPosts: BlogPost[] = [
  {
    title: 'Yoga for Beginners: A Complete Guide',
    excerpt: 'Start your yoga journey with this comprehensive guide for beginners. Learn the basics, essential poses, and how to create a sustainable practice.',
    content: `
      <h2>Introduction to Yoga</h2>
      <p>Yoga is an ancient practice that combines physical postures, breathing exercises, and meditation to promote physical and mental well-being. Whether you're looking to improve flexibility, reduce stress, or find inner peace, yoga offers something for everyone.</p>
      
      <h2>Getting Started</h2>
      <p>Before you begin your yoga practice, it's important to create a comfortable space and gather the necessary equipment. You'll need a yoga mat, comfortable clothing, and an open mind.</p>
      
      <h2>Essential Poses for Beginners</h2>
      <h3>1. Mountain Pose (Tadasana)</h3>
      <p>This foundational pose teaches proper alignment and posture. Stand with your feet together, arms at your sides, and spine straight.</p>
      
      <h3>2. Downward-Facing Dog (Adho Mukha Svanasana)</h3>
      <p>A great pose for stretching the entire body. Start on your hands and knees, then lift your hips to form an inverted V shape.</p>
      
      <h3>3. Child's Pose (Balasana)</h3>
      <p>A restful pose that gently stretches the hips, thighs, and ankles. Kneel on the floor, sit back on your heels, and fold forward.</p>
      
      <h2>Building a Practice</h2>
      <p>Start with just 10-15 minutes a day and gradually increase the duration as you become more comfortable. Consistency is more important than duration.</p>
      
      <h2>Benefits of Regular Practice</h2>
      <ul>
        <li>Improved flexibility and strength</li>
        <li>Better posture and balance</li>
        <li>Reduced stress and anxiety</li>
        <li>Enhanced mental clarity</li>
        <li>Better sleep quality</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Remember, yoga is a journey, not a destination. Be patient with yourself and enjoy the process of discovery and growth.</p>
    `,
    author: 'YIPN Team',
    publishDate: new Date('2024-08-20'),
    tags: ['yoga', 'beginners', 'wellness', 'fitness'],
    category: 'Yoga & Wellness',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    isPublished: true,
    slug: 'yoga-for-beginners-complete-guide',
    readTime: 8
  },
  {
    title: 'The Power of Morning Meditation',
    excerpt: 'Discover how starting your day with meditation can transform your mindset and improve your overall well-being.',
    content: `
      <h2>Why Morning Meditation?</h2>
      <p>Starting your day with meditation sets a positive tone for the hours ahead. It helps you approach challenges with clarity and calmness.</p>
      
      <h2>Simple Morning Meditation Techniques</h2>
      <h3>1. Breath Awareness</h3>
      <p>Focus on your natural breath for 5-10 minutes. Notice the rhythm and depth of each inhale and exhale.</p>
      
      <h3>2. Body Scan</h3>
      <p>Slowly scan your body from head to toe, noticing any tension or sensations.</p>
      
      <h3>3. Gratitude Practice</h3>
      <p>Reflect on three things you're grateful for as you begin your day.</p>
      
      <h2>Creating a Morning Routine</h2>
      <p>Start with just 5 minutes and gradually increase the duration. Find a quiet space where you won't be disturbed.</p>
      
      <h2>Benefits</h2>
      <ul>
        <li>Reduced stress and anxiety</li>
        <li>Improved focus and concentration</li>
        <li>Better emotional regulation</li>
        <li>Enhanced self-awareness</li>
      </ul>
    `,
    author: 'Sarah Kamau',
    publishDate: new Date('2024-08-18'),
    tags: ['meditation', 'morning-routine', 'mindfulness', 'wellness'],
    category: 'Meditation',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    isPublished: true,
    slug: 'power-of-morning-meditation',
    readTime: 5
  },
  {
    title: 'Building a Sustainable Fitness Routine',
    excerpt: 'Learn how to create a fitness routine that fits your lifestyle and helps you achieve your health goals.',
    content: `
      <h2>Setting Realistic Goals</h2>
      <p>Start with small, achievable goals that you can build upon over time. Focus on consistency rather than intensity.</p>
      
      <h2>Finding What Works for You</h2>
      <p>Experiment with different types of exercise to discover what you enjoy most. The best workout is the one you'll actually do.</p>
      
      <h2>Creating Consistency</h2>
      <p>Schedule your workouts like important appointments and stick to them. Even 15 minutes of movement is better than nothing.</p>
      
      <h2>Building Habits</h2>
      <p>Start with just 2-3 workouts per week and gradually increase frequency. Track your progress to stay motivated.</p>
      
      <h2>Recovery and Rest</h2>
      <p>Remember that rest days are just as important as workout days. Listen to your body and don't push through pain.</p>
    `,
    author: 'Mike Johnson',
    publishDate: new Date('2024-08-15'),
    tags: ['fitness', 'routine', 'goals', 'health'],
    category: 'Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    isPublished: true,
    slug: 'building-sustainable-fitness-routine',
    readTime: 6
  }
];

export const seedBlogData = async () => {
  try {
    console.log('Starting to seed blog data...');
    
    for (const post of sampleBlogPosts) {
      const blogData = {
        ...post,
        publishDate: post.publishDate,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await blogService.create(blogData);
      console.log(`Created blog post: ${post.title}`);
    }
    
    console.log('Blog data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding blog data:', error);
  }
};

// Function to check if blog posts already exist
export const checkBlogDataExists = async (): Promise<boolean> => {
  try {
    const posts = await blogService.readAll();
    return posts.length > 0;
  } catch (error) {
    console.error('Error checking blog data:', error);
    return false;
  }
};
