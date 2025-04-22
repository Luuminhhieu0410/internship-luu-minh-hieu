#!/usr/bin/env node
const toSlug = require('../lib/slugify');

const input = process.argv.slice(2).join(' ');

if (!input) {
  console.log('⚠️ Vui lòng nhập chuỗi cần slug!');
  process.exit(1);
}

console.log(toSlug(input));
