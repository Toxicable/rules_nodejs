var crypto = require('crypto');
const { join } = require('path');
const fs = require('fs');
const cild_process = require('child_process');
const Report = require('c8/lib/report')

function main(args) {
  // do this here since this require.resolve fails in the child process
  const manifestFile = require.resolve(args[0]);
  const covDir = join(process.env['TEST_TMPDIR'], `${crypto.randomBytes(4).readUInt32LE(0)}`);
  
  process.env.NODE_V8_COVERAGE = covDir
  // foreground(require.resolve('./jasmine_runner.js'), () => {
  //   outputReport(argv)
  // })  
  
  const forkScript = process.env["BAZEL_TARGET"] ? "../dot_spec_test.runner_loader" : "./jasmine_runner";
  
  const runner = cild_process.fork(require.resolve(forkScript), [manifestFile]
  , { env: { ...process.env, NODE_V8_COVERAGE: covDir, }});
  runner.on('close', (code) => {
    const covDirFiles = fs.readdirSync(covDir);
    if(covDirFiles.length === 1) {
      const report = Report({
        include: undefined,
        exclude: undefined,
        reporter: ['text-summary'],
        tempDirectory: covDir,
        watermarks: undefined,
        resolve: process.cwd(),
        omitRelative: undefined,
        wrapperLength: undefined
      })
      report.run()
    }
    console.log(`child process exited with code ${code}`);
    process.exit(code);
   });
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
