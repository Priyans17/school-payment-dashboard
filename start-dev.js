#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting School Payment Dashboard Development Environment...\n');

// Start backend
console.log('📡 Starting Backend Server...');
const backend = spawn('npm', ['run', 'backend:dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Start frontend
console.log('🎨 Starting Frontend Server...');
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

backend.on('error', (err) => {
  console.error('❌ Backend error:', err);
});

frontend.on('error', (err) => {
  console.error('❌ Frontend error:', err);
});

console.log('✅ Both servers are starting...');
console.log('🌐 Frontend: http://localhost:3000');
console.log('🔗 Backend API: http://localhost:3002/api');
console.log('\nPress Ctrl+C to stop both servers');