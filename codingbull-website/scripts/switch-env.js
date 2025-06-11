#!/usr/bin/env node
/**
 * Environment Switching Script
 * Automatically switches between development and production environments
 */

const fs = require('fs');
const path = require('path');

const ENVIRONMENTS = ['development', 'production', 'test'];
const ENV_DIR = path.join(__dirname, '..');
const TARGET_ENV_FILE = path.join(ENV_DIR, '.env');

function showUsage() {
  console.log('🔧 Environment Switching Tool');
  console.log('Usage: node scripts/switch-env.js <environment>');
  console.log('');
  console.log('Available environments:');
  ENVIRONMENTS.forEach(env => {
    const envFile = path.join(ENV_DIR, `.env.${env}`);
    const exists = fs.existsSync(envFile);
    console.log(`  ${env} ${exists ? '✅' : '❌'}`);
  });
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/switch-env.js development');
  console.log('  node scripts/switch-env.js production');
}

function switchEnvironment(targetEnv) {
  if (!ENVIRONMENTS.includes(targetEnv)) {
    console.error(`❌ Invalid environment: ${targetEnv}`);
    console.error(`Valid environments: ${ENVIRONMENTS.join(', ')}`);
    return false;
  }

  const sourceEnvFile = path.join(ENV_DIR, `.env.${targetEnv}`);
  
  if (!fs.existsSync(sourceEnvFile)) {
    console.error(`❌ Environment file not found: .env.${targetEnv}`);
    console.error('Please create the environment file first.');
    return false;
  }

  try {
    // Backup current .env if it exists
    if (fs.existsSync(TARGET_ENV_FILE)) {
      const backupFile = path.join(ENV_DIR, '.env.backup');
      fs.copyFileSync(TARGET_ENV_FILE, backupFile);
      console.log('📦 Backed up current .env to .env.backup');
    }

    // Copy the target environment file to .env
    fs.copyFileSync(sourceEnvFile, TARGET_ENV_FILE);
    
    console.log(`✅ Switched to ${targetEnv} environment`);
    console.log(`📁 Copied .env.${targetEnv} to .env`);
    
    // Show current configuration
    showCurrentConfig();
    
    return true;
  } catch (error) {
    console.error('❌ Error switching environment:', error.message);
    return false;
  }
}

function showCurrentConfig() {
  try {
    const envContent = fs.readFileSync(TARGET_ENV_FILE, 'utf8');
    const lines = envContent.split('\n');
    
    console.log('\n📋 Current Configuration:');
    console.log('─'.repeat(40));
    
    // Extract key configuration values
    const config = {};
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        config[key] = valueParts.join('=');
      }
    });
    
    // Show important config values
    const importantKeys = [
      'NODE_ENV',
      'REACT_APP_ENV',
      'REACT_APP_API_BASE_URL',
      'REACT_APP_ENABLE_DEBUG_MODE',
      'REACT_APP_ENABLE_ANALYTICS',
      'GENERATE_SOURCEMAP'
    ];
    
    importantKeys.forEach(key => {
      if (config[key] !== undefined) {
        console.log(`${key}: ${config[key]}`);
      }
    });
    
    console.log('─'.repeat(40));
    
  } catch (error) {
    console.error('❌ Error reading configuration:', error.message);
  }
}

function detectCurrentEnvironment() {
  if (!fs.existsSync(TARGET_ENV_FILE)) {
    return 'none';
  }
  
  try {
    const envContent = fs.readFileSync(TARGET_ENV_FILE, 'utf8');
    
    // Check for environment indicators
    if (envContent.includes('NODE_ENV=production')) {
      return 'production';
    } else if (envContent.includes('NODE_ENV=development')) {
      return 'development';
    } else if (envContent.includes('NODE_ENV=test')) {
      return 'test';
    }
    
    return 'unknown';
  } catch (error) {
    return 'error';
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    const currentEnv = detectCurrentEnvironment();
    console.log(`🔍 Current environment: ${currentEnv}`);
    console.log('');
    showUsage();
    return;
  }
  
  const targetEnv = args[0].toLowerCase();
  
  if (targetEnv === 'help' || targetEnv === '--help' || targetEnv === '-h') {
    showUsage();
    return;
  }
  
  if (targetEnv === 'status') {
    const currentEnv = detectCurrentEnvironment();
    console.log(`🔍 Current environment: ${currentEnv}`);
    if (currentEnv !== 'none' && currentEnv !== 'error') {
      showCurrentConfig();
    }
    return;
  }
  
  const success = switchEnvironment(targetEnv);
  
  if (success) {
    console.log('\n🎯 Next steps:');
    console.log('1. Restart your development server');
    console.log('2. Clear browser cache if needed');
    console.log('3. Verify the application is working correctly');
  }
}

if (require.main === module) {
  main();
}

module.exports = { switchEnvironment, detectCurrentEnvironment };
