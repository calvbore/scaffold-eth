const { execSync } = require('child_process');
const fs = require('fs');

const packageSource = {
  "eth-hooks": "https://github.com/austintgriffith/eth-hooks.git"
}

let packageName = process.argv[2];

if (process.argv.length !== 3) {
  console.log("\n");
  console.log("Usage:");
  console.log("displace <PACKAGE_NAME>", "\n");
  console.log("Packages available to displace:", "\n", packageSource, "\n");
  process.exit();
}

let cwd = process.cwd();
console.log(cwd, "\n");

if (packageSource[packageName]) {
  console.log("Package source:");
  console.log(packageSource[packageName], "\n");

  process.chdir(cwd + "/../..");
  cwd = process.cwd();
  console.log(cwd, "\n");

  if (fs.existsSync(`packages/${packageName}`)) {
    console.log(`${packageName} has already been displaced`);
    process.exit();
  } else {
    console.log(`Displacing ${packageName}...`);

    try {

      execSync(
        `git submodule add ${packageSource[packageName]} packages/${packageName}`,
        { stdio: 'inherit' }
      );
      process.chdir(cwd + `/packages/${packageName}`);
      console.log(process.cwd());
      execSync(
        `yarn build`,
        { stdio: 'inherit' }
      );
      execSync(
        `yarn link`,
        { stdio: 'inherit' }
      );
      process.chdir(cwd + `/packages/react-app`);
      console.log(process.cwd());
      execSync(
        `yarn link ${packageName}`,
        { stdio: 'inherit' }
      );

    } catch (error) {
      console.log(error);
      process.exit(1)
    }
  }

} else {
  console.log(`${packageName} is not available to displace`);
  process.exit();
}
