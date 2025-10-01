/**
 * One-time script to parse affiliate_links.md and generate affiliate-links.json
 * Run with: node scripts/parse-affiliate-links.js
 */

const fs = require('fs');
const path = require('path');

// Read the markdown file
const mdPath = path.join(__dirname, '..', '.tmp', 'affiliate_links.md');
const content = fs.readFileSync(mdPath, 'utf-8');

// Parse the markdown file - handle both \n and \r\n line endings
// Format is: partner / product / stats (2 lines) / short url / destination url
const lines = content.split(/\r?\n/);

const affiliateLinks = {};

for (let i = 0; i < lines.length; i += 6) {
  const partner = lines[i]?.trim();
  const product = lines[i + 1]?.trim();
  const shortUrlLine = lines[i + 4]?.trim();
  const destinationUrl = lines[i + 5]?.trim();
  
  if (!partner || !product || !shortUrlLine || !destinationUrl) {
    continue;
  }
  
  // Extract slug from short URL
  if (shortUrlLine.startsWith('https://fitnesstestlab.com/go/')) {
    const slug = shortUrlLine
      .replace('https://fitnesstestlab.com/go/', '')
      .replace(/\/$/, '');
    
    if (slug && destinationUrl.startsWith('http')) {
      affiliateLinks[slug] = {
        url: destinationUrl,
        note: `${partner} - ${product}`
      };
    }
  }
}

// Sort alphabetically by slug for easier maintenance
const sortedLinks = Object.keys(affiliateLinks)
  .sort()
  .reduce((acc, key) => {
    acc[key] = affiliateLinks[key];
    return acc;
  }, {});

// Write to JSON file
const outputPath = path.join(__dirname, '..', 'src', 'data', 'affiliate-links.json');
const outputDir = path.dirname(outputPath);

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(sortedLinks, null, 2));

console.log(`✅ Successfully parsed ${Object.keys(sortedLinks).length} affiliate links`);
console.log(`📝 Output written to: ${outputPath}`);
console.log('\nSample entries:');
const sampleKeys = Object.keys(sortedLinks).slice(0, 3);
sampleKeys.forEach(key => {
  console.log(`  ${key}: ${sortedLinks[key].url.substring(0, 50)}...`);
  console.log(`    Note: ${sortedLinks[key].note}`);
});
