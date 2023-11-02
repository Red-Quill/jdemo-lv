import fs from 'node:fs/promises';



const copyPackageJson = (options={}) => {
	const plugin = {
		name : 'copy-package-json',
		buildEnd : async() => {
			const packageJSON = await fs.readFile("./package.json","utf-8");
			const _package = JSON.parse(packageJSON);
			//console.log(_package);
			const {
				name,
				version,
				description,
				type,
				engines,
				author,
				license,
				dependencies,
				scripts:{ start }
			} = _package;
			const prodPackage = {
				name,
				version,
				description,
				type,
				engines,
				author,
				license,
				dependencies,
				main : "jcoursesapi.js",
				scripts : { start },
			};
			const prodPackageJson = JSON.stringify(prodPackage,null,2);
			await fs.writeFile("./build/package.json",prodPackageJson,"utf-8");
			await fs.copyFile("./package-lock.json","./build/package-lock.json");
		},
	};
	return plugin;
};



export default copyPackageJson;
