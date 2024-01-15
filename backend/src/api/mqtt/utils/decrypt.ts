const decrypt = (encrypted: string, key: string) => {
    let decrypted = "";
    for (let i = 0; i < encrypted.length; i++) {
        decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return decrypted;
}

export default decrypt;
