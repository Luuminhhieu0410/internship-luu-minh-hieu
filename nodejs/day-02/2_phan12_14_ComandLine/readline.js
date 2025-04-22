const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('input: ', (answer) => {
  console.log(`Hello ${answer}`);
  rl.close();
});
