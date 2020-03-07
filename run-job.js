
const execFileSync1 = require('child_process').execFileSync;
const stdout1 = execFileSync1('node', ['test.js']);
console.log(stdout1.toString('utf8'));


const execFileSync2 = require('child_process').execFileSync;
const stdout2 = execFileSync2('node', ['test.js']);
console.log(stdout2.toString('utf8'));


const execFileSync3 = require('child_process').execFileSync;
const stdout3 = execFileSync3('node', ['test.js']);
console.log(stdout3.toString('utf8'));