import crypto from 'node:crypto';
const algorithm = 'aes-256-ctr';



const static_hash = (x,outputLength) => {
	const salt = crypto.createHash('md5').update(x).digest("hex");
	const key_iv = crypto.pbkdf2Sync(x, salt, 100000, outputLength, 'sha512');
	return key_iv;
}

const generate_from = (password) => {
	const key_iv = static_hash(password, 32 + 16);
	const key = {
		key: key_iv.subarray(0, 32),
		iv: key_iv.subarray(32),
		//salt: key_iv.subarray(16) // not needed here
	};
	return key;
};

const encryptWithPassword = (passwd,plain_text) => {
	const { key,iv } = generate_from(passwd)
	const encrypted_text = _encrypt(key,iv,plain_text)
	return encrypted_text
};

const decryptWithPassword = (passwd,ciphertext) => {
	const { key,iv } = generate_from(passwd)
	const decrypted_text = _decrypt(key,iv,ciphertext)
	return decrypted_text;
};

const encrypt = (encryption_key,plain_text) => {
	const key = Buffer.from(encryption_key.slice(0,64),"hex");
	const iv = Buffer.from(encryption_key.slice(64),"hex");
	const encrypted_text = _encrypt(key,iv,plain_text)
	return encrypted_text
};

const decrypt = (encryption_key,ciphertext) => {
	const key = Buffer.from(encryption_key.slice(0,64),"hex");
	const iv = Buffer.from(encryption_key.slice(64),"hex");
	const decrypted_text = _decrypt(key,iv,ciphertext)
	return decrypted_text;
};

const _encrypt = (key,iv,plain_text) => {
	const cipher = crypto.createCipheriv(algorithm, Buffer.from(key,'hex'),iv);
	const encrypted_i = cipher.update(plain_text);
	const encrypted_ii = Buffer.concat([encrypted_i, cipher.final()]);
	const encrypted_text = encrypted_ii.toString('hex');
	return encrypted_text
};

const _decrypt = (key,iv,ciphertext) => {
	const encryptedText = Buffer.from(ciphertext, 'hex')
	const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);
	const decrypted_i = decipher.update(encryptedText);
	const decrypted_ii = Buffer.concat([decrypted_i, decipher.final()]);
	const decrypted_text = decrypted_ii.toString();
	return decrypted_text;
};

const randomKey = () => crypto.randomBytes(48).toString("hex");



export { encrypt,decrypt,encryptWithPassword,decryptWithPassword,randomKey };




// crypto.randombytes(48) for new random buffer
