import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const defaultTarget = path.resolve(projectRoot, ".deploy", "loyal_academy");
const targetDir = process.argv[2]
  ? path.resolve(projectRoot, process.argv[2])
  : defaultTarget;

const standaloneRoot = path.join(projectRoot, ".next", "standalone");
const staticRoot = path.join(projectRoot, ".next", "static");
const publicRoot = path.join(projectRoot, "public");
const packageJsonPath = path.join(projectRoot, "package.json");

function ensureExists(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required ${label}: ${filePath}`);
  }
}

function copyDirectory(source, destination) {
  fs.cpSync(source, destination, {
    recursive: true,
    force: true,
    dereference: false,
    verbatimSymlinks: true,
  });
}

function copyFile(source, destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

try {
  ensureExists(packageJsonPath, "package manifest");
  ensureExists(standaloneRoot, "standalone build output");
  ensureExists(
    path.join(standaloneRoot, "server.js"),
    "standalone server entry",
  );

  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.mkdirSync(targetDir, { recursive: true });

  copyDirectory(standaloneRoot, targetDir);

  const outputNextDir = path.join(targetDir, ".next");
  fs.mkdirSync(outputNextDir, { recursive: true });

  if (fs.existsSync(staticRoot)) {
    copyDirectory(staticRoot, path.join(outputNextDir, "static"));
  } else {
    throw new Error(`Missing required static assets: ${staticRoot}`);
  }

  if (fs.existsSync(publicRoot)) {
    copyDirectory(publicRoot, path.join(targetDir, "public"));
  }

  const sourcePackage = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const deploymentPackage = {
    name: sourcePackage.name,
    version: sourcePackage.version,
    private: true,
    packageManager: sourcePackage.packageManager,
    scripts: {
      start: "NODE_ENV=production node server.js",
    },
  };

  fs.writeFileSync(
    path.join(targetDir, "package.json"),
    `${JSON.stringify(deploymentPackage, null, 2)}\n`,
  );

  const serverEntryPath = path.join(targetDir, "server.js");
  ensureExists(serverEntryPath, "startup script");

  const requiredMarkers = [
    path.join(targetDir, "server.js"),
    path.join(targetDir, ".next", "static"),
    path.join(targetDir, "node_modules"),
  ];

  for (const marker of requiredMarkers) {
    ensureExists(marker, "deployment artifact");
  }

  console.log("Deployment package prepared successfully.");
  console.log(`Destination: ${targetDir}`);
  console.log(
    `Included: ${requiredMarkers.map((entry) => path.relative(projectRoot, entry)).join(", ")}`,
  );
  console.log("Next.js standalone build is ready for Namecheap deployment.");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Failed to prepare deployment package: ${message}`);
  process.exit(1);
}
