import util from 'util';
import { exec as _exec } from 'child_process';
import { copyFile,readdir,mkdir,stat } from 'fs/promises';
import { join as pathJoin } from "path";

const exec = util.promisify(_exec);

// Source and destination directories
const sourceDir = 'src'; // Change to your source directory
const destinationDir = 'build'; // Change to your destination directory



const tsc  = async() => {
	const { stdout,stderr } = await exec('tsc');
	console.log('stdout:',stdout);
	console.log('stderr:',stderr);
};






// Function to copy files while preserving directory structure
const copyFiles = async(source,destination) => {
	try {
		// Read the source directory
		const files = await readdir(source);

		// Loop through files and directories in the source directory
		for (const file of files) {
		const sourcePath = pathJoin(source, file);
		const destinationPath = pathJoin(destination, file);

		// Check if it's a file or directory
		const fileStat = await stat(sourcePath);

		if (fileStat.isDirectory()) {
			// If it's a directory, create it in the destination and recursively copy its contents
			await mkdir(destinationPath, { recursive: true });
			await copyFiles(sourcePath, destinationPath);
		} else if (file.endsWith('.svg') || file.endsWith('.scss') || file.endsWith('.css') || file.endsWith('.woff2')) {
			// If it's an .svg or .scss file, copy it to the destination directory
			await copyFile(sourcePath, destinationPath);
		}
		}
	} catch (error) {
		console.error('Error copying files:', error);
	}
}



const build = async() => {
	await copyFiles(sourceDir,destinationDir);
	console.log("copied assets");
	await tsc();
	console.log("built");
};

build();
