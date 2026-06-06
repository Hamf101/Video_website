const fs = require('fs');
const path = require('path');

const url = process.argv[2];
if (!url) {
  console.error('Usage: npm run add-video <youtube_url> [category] [featured]');
  console.error('Example: npm run add-video https://www.youtube.com/watch?v=LXvv6CbGg8A voices true');
  process.exit(1);
}

const category = process.argv[3] || 'stories';
const featured = process.argv[4] === 'true';

async function fetchYoutubeMetadata(videoUrl) {
  try {
    const res = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await res.text();
    
    // Extract video ID
    let videoId = '';
    const urlObj = new URL(videoUrl);
    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v');
    } else if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1);
    }
    
    // Extract title
    let title = 'Unknown Title';
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    if (titleMatch) {
      title = titleMatch[1].replace(' - YouTube', '').trim();
      // Unescape some basic HTML entities
      title = title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    }
    
    // Extract duration
    let duration = '0:00';
    const lengthMatch = html.match(/"lengthSeconds":"(\d+)"/);
    if (lengthMatch) {
      const secs = parseInt(lengthMatch[1], 10);
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      duration = `${m}:${s.toString().padStart(2, '0')}`;
    }
    
    return { title, duration, videoId };
  } catch (err) {
    console.error('Failed to fetch metadata:', err.message);
    process.exit(1);
  }
}

async function addVideo() {
  console.log(`Fetching metadata for ${url}...`);
  const meta = await fetchYoutubeMetadata(url);
  if (!meta.videoId) {
    console.error('Could not extract video ID from URL');
    process.exit(1);
  }
  
  const slug = meta.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const newVideoStr = `  {
    slug: '${slug}',
    title: '${meta.title.replace(/'/g, "\\'")}',
    description: '',
    category: '${category}',
    duration: '${meta.duration}',
    source: 'youtube',
    videoId: '${meta.videoId}',
    poster: 'https://img.youtube.com/vi/${meta.videoId}/hqdefault.jpg',
    featured: ${featured},
  },
];`;

  const videoDataPath = path.join(__dirname, '../src/lib/videoData.ts');
  let content = fs.readFileSync(videoDataPath, 'utf8');
  
  // Replace the closing bracket of VIDEOS array
  content = content.replace(/^\];/m, newVideoStr);
  
  fs.writeFileSync(videoDataPath, content);
  console.log(`Success! Added "${meta.title}" (${meta.duration}) to videoData.ts.`);
}

addVideo();
