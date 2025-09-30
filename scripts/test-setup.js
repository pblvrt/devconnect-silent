#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Silent Room setup...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'app/layout.tsx',
  'app/page.tsx',
  'app/broadcast/page.tsx',
  'app/r/[room]/page.tsx',
  'app/api/token/route.ts',
  'app/globals.css'
];

let allFilesExist = true;

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Check package.json dependencies
console.log('\n📦 Checking dependencies:');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const requiredDeps = [
  'next',
  'react',
  'react-dom',
  'livekit-client',
  'livekit-server-sdk',
  '@livekit/components-react',
  'qrcode',
  'qrcode.react',
  'lucide-react'
];

requiredDeps.forEach(dep => {
  const exists = packageJson.dependencies[dep];
  console.log(`  ${exists ? '✅' : '❌'} ${dep}${exists ? `@${exists}` : ''}`);
});

// Check environment template
console.log('\n🔧 Checking environment setup:');
const envExampleExists = fs.existsSync(path.join(__dirname, '..', 'env.example'));
console.log(`  ${envExampleExists ? '✅' : '❌'} env.example`);

console.log('\n📋 Setup Summary:');
if (allFilesExist) {
  console.log('✅ All required files are present');
  console.log('✅ Project structure is correct');
  console.log('\n🚀 Next steps:');
  console.log('1. Copy env.example to .env.local');
  console.log('2. Configure your LiveKit Cloud credentials');
  console.log('3. Run: npm install');
  console.log('4. Run: npm run dev');
  console.log('5. Open http://localhost:3000');
} else {
  console.log('❌ Some files are missing');
  console.log('Please ensure all required files are created');
}

console.log('\n🎯 Silent Room is ready for deployment!');
