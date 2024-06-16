document.getElementById('encryptButton').addEventListener('click', async () => {
    const plaintext = document.getElementById('plaintext').value;
    const key = await generateKey();
    const { encryptedData, iv } = await encryptData(plaintext, key);
    
    document.getElementById('ciphertext').value = `${arrayBufferToBase64(iv)}:${arrayBufferToBase64(encryptedData)}`;
    sessionStorage.setItem('encryptionKey', await exportKey(key));
});

document.getElementById('decryptButton').addEventListener('click', async () => {
    const ciphertext = document.getElementById('ciphertext').value;
    const [ivBase64, encryptedDataBase64] = ciphertext.split(':');
    const iv = base64ToArrayBuffer(ivBase64);
    const encryptedData = base64ToArrayBuffer(encryptedDataBase64);
    const key = await importKey(sessionStorage.getItem('encryptionKey'));
    
    const decryptedData = await decryptData(encryptedData, iv, key);
    document.getElementById('decryptedtext').value = decryptedData;
});

async function generateKey() {
    return await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
}

async function encryptData(data, key) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encodedData
    );

    return {
        encryptedData: new Uint8Array(encryptedData),
        iv: iv
    };
}

async function decryptData(encryptedData, iv, key) {
    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
}

async function exportKey(key) {
    const exported = await window.crypto.subtle.exportKey('raw', key);
    return arrayBufferToBase64(exported);
}

async function importKey(base64Key) {
    const rawKey = base64ToArrayBuffer(base64Key);
    return await window.crypto.subtle.importKey(
        'raw',
        rawKey,
        {
            name: 'AES-GCM',
            length: 456
        },
        true,
        ['encrypt', 'decrypt']
    );
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
