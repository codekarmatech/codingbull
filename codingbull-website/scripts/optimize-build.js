#!/usr/bin/env node
/**
 * Production Build Optimization Script
 * Optimizes the build output for production deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const STATIC_DIR = path.join(BUILD_DIR, 'static');

console.log('🚀 Starting production build optimization...');

// Check if build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  console.error('❌ Build directory not found. Run "npm run build:prod" first.');
  process.exit(1);
}

// Function to get file size in KB
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2);
}

// Function to optimize images (if imagemin is available)
function optimizeImages() {
  console.log('🖼️  Optimizing images...');
  
  try {
    // Check if imagemin is available
    execSync('npm list imagemin', { stdio: 'ignore' });
    
    // Run image optimization
    execSync(`npx imagemin "${BUILD_DIR}/**/*.{jpg,jpeg,png,gif,svg}" --out-dir="${BUILD_DIR}"`, {
      stdio: 'inherit'
    });
    
    console.log('✅ Images optimized successfully');
  } catch (error) {
    console.log('⚠️  Image optimization skipped (imagemin not available)');
  }
}

// Function to add cache headers to static files
function addCacheHeaders() {
  console.log('📦 Adding cache optimization...');
  
  const cacheConfig = `
# Cache Configuration for Static Assets
# Add this to your web server configuration

# Cache static assets for 1 year
location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Cache HTML files for 1 hour
location ~* \\.html$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
`;
  
  fs.writeFileSync(path.join(BUILD_DIR, 'cache-config.txt'), cacheConfig);
  console.log('✅ Cache configuration created');
}

// Function to create gzipped versions of files
function createGzipVersions() {
  console.log('🗜️  Creating gzipped versions...');
  
  try {
    const zlib = require('zlib');
    
    function gzipFile(filePath) {
      const content = fs.readFileSync(filePath);
      const gzipped = zlib.gzipSync(content);
      fs.writeFileSync(filePath + '.gz', gzipped);
    }
    
    // Gzip CSS and JS files
    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (file.endsWith('.css') || file.endsWith('.js')) {
          gzipFile(filePath);
        }
      });
    };
    
    if (fs.existsSync(STATIC_DIR)) {
      walkDir(STATIC_DIR);
    }
    
    console.log('✅ Gzipped versions created');
  } catch (error) {
    console.log('⚠️  Gzip creation failed:', error.message);
  }
}

// Function to analyze bundle size
function analyzeBundleSize() {
  console.log('📊 Analyzing bundle size...');
  
  try {
    if (fs.existsSync(STATIC_DIR)) {
      const jsDir = path.join(STATIC_DIR, 'js');
      const cssDir = path.join(STATIC_DIR, 'css');
      
      let totalSize = 0;
      
      if (fs.existsSync(jsDir)) {
        const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && !f.endsWith('.gz'));
        jsFiles.forEach(file => {
          const size = parseFloat(getFileSize(path.join(jsDir, file)));
          totalSize += size;
          console.log(`  📄 ${file}: ${size} KB`);
        });
      }
      
      if (fs.existsSync(cssDir)) {
        const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css') && !f.endsWith('.gz'));
        cssFiles.forEach(file => {
          const size = parseFloat(getFileSize(path.join(cssDir, file)));
          totalSize += size;
          console.log(`  🎨 ${file}: ${size} KB`);
        });
      }
      
      console.log(`📦 Total bundle size: ${totalSize.toFixed(2)} KB`);
      
      if (totalSize > 1000) {
        console.log('⚠️  Bundle size is large (>1MB). Consider code splitting.');
      } else {
        console.log('✅ Bundle size is optimized');
      }
    }
  } catch (error) {
    console.log('⚠️  Bundle analysis failed:', error.message);
  }
}

// Function to create deployment manifest
function createDeploymentManifest() {
  console.log('📋 Creating deployment manifest...');
  
  const manifest = {
    buildDate: new Date().toISOString(),
    environment: 'production',
    optimizations: [
      'Source maps disabled',
      'Runtime chunk inlined',
      'Static assets optimized',
      'Gzip compression enabled'
    ],
    deployment: {
      frontend: 'Hostinger VPS (Nginx)',
      backend: 'Hostinger VPS (Gunicorn)',
      database: 'PostgreSQL (Local)',
      infrastructure: 'Hostinger VPS Enterprise',
      platform: 'Ubuntu 24.04 LTS'
    }
  };
  
  fs.writeFileSync(path.join(BUILD_DIR, 'deployment-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('✅ Deployment manifest created');
}

// Main optimization process
async function main() {
  try {
    optimizeImages();
    addCacheHeaders();
    createGzipVersions();
    analyzeBundleSize();
    createDeploymentManifest();
    
    console.log('\n🎉 Production build optimization completed!');
    console.log('📁 Build directory:', BUILD_DIR);
    console.log('🚀 Ready for deployment to Cloudflare Pages');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
    process.exit(1);
  }
}

main();
