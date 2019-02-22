var crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const cild_process = require('child_process');
const Report = require('c8/lib/report')

const UTF8 = {
  encoding: 'utf-8'
};

function main(args) {
  // do this here since this require.resolve fails in the child process
  const manifestFile = require.resolve(args[0]);
  // make a tmpdir inside our tmpdir to group the coverage files
  const covDir = path.join(process.env['TEST_TMPDIR'], `${crypto.randomBytes(4).readUInt32LE(0)}`);
  
  process.env.NODE_V8_COVERAGE = covDir

  // hack for running a fork process
  const target = process.env["BAZEL_TARGET"].split(':')[1];
  const forkScript = `../${target}.runner_loader`;
  
  // figure out what files to include in coverage reporting
  const files = fs.readFileSync(manifestFile, UTF8)
    .split('\n')
    .filter(l => l.length > 0)
    // filter out spec and test files here so we only get source files
    .filter(f => !(/[^a-zA-Z0-9](spec|test)\.js$/i.test(f)))
    .filter(f => !/\/node_modules\//.test(f))
    .map(f => require.resolve(f))
    // the reporting lib resolves the relative path instead of using the absolute one
    // so match it here
    .map(f => path.relative(process.cwd(), f))

  //TODO: is ther ea better way to run the forked process?
  const runner = cild_process.fork(require.resolve(forkScript), [manifestFile]
  , { env: { ...process.env }});
  runner.on('error', err => {
    console.error(err);
    //TODO: is there a better error code here?
    process.exit(1);
  })
  runner.on('close', (code) => {
    const report = Report({
      include: files,
      exclude: [],
      // only output a text-summary
      // we can output other formats when baze coverage can pick them up
      reporter: ['text-summary'],
      tempDirectory: covDir,
      watermarks: undefined,
      resolve: process.cwd(),
      omitRelative: undefined,
      wrapperLength: undefined
    })
    report.run()
    process.exit(code);
   });
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
