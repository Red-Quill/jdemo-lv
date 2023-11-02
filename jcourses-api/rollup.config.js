import typescript from "rollup-plugin-typescript2";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import copyPackageJson from "./utils/copy-package-json.js";


// This code is injected in the beginning of the bundle
// for compatibility with commonJS
const compatibilityCode = `
import pathx from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathx.dirname(__filename);
`;

// rollup.config.js
const config = {
	input: 'src/app.js',
	output: {
		file: 'build/bin/jcoursesapi.js',
		format: 'esm',
		banner: compatibilityCode,
		sourcemap : true,
		globals : { crypto:"crypto" }, // ?? maybe not needed
	},
	external : [
		"node:os", "os",
		"node:fs/promises", "fs/promises",
		"node:path", "path",
		"node:readline", "readline",
		"node:crypto", "crypto",
		// AWS
		"@aws-sdk/client-ssm",
		"@aws-sdk/credential-providers",
		"mock-aws-s3",
		"aws-sdk",
		"nock",
		"mongoose",
		//"joi",
	    "google-auth-library",
	    "googleapis",
		"bcrypt",
	],
	plugins : [
		typescript(),
		nodeResolve({
			exportConditions : ["node"], // without this crypto.getRandomValues doesn't work
			preferBuiltins : true,
		}),
		json(),
		commonjs(),
		terser(),
		copyPackageJson(),
	],
};



export default config;
