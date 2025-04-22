
const repl = require('repl');
const fs =  require('fs');
const path = require('path');

const r = repl.start({
    prompt: '>>> ',
    completer: customCompleter
  });
// Gợi ý các lệnh
function customCompleter(line) {
  const commands = ['sayHi', 'now', 'sum', '.save'];
  const hits = commands.filter(c => c.startsWith(line));
  return [hits.length ? hits : commands, line];
}

// Định nghĩa lệnh
r.context.sayHi = () => console.log('Hello repl');
r.context.now = () => console.log(new Date());
r.context.sum = (a, b) => console.log(a + b);


r.defineCommand('save', {
  help: 'Lưu lịch sử vào history.txt',
  action() {
    const history = r.history.slice().reverse().join('\n');
    fs.writeFileSync(path.join(__dirname,'/history.txt'), history, 'utf8');
    console.log('Lưu lịch sử vào history.txt thành công!');
    this.displayPrompt();
  }
});
