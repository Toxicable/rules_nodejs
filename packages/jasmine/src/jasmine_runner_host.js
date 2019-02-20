const { spawnSync } = require('child_process');


function main(args) {
  const output = spawnSync(process.execPath, [
    require.resolve('./jasmine_runner.js'),
    ...args
  ], { env: { ...process.env, NODE_V8_COVERAGE: '/tmp/cov'}})
  assert.strictEqual(output.status, 0);
  assert.strictEqual(output.stderr.toString(), '');
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
