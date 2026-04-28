//запуск в папке lab08 командой 
// node checksum.js

function checksum(bytes){
    sum = 0
    for (let i = 0; i < bytes.length; i+=2) {
        word = (bytes[i] << 8) + (bytes[i + 1] ?? 0)
        sum += word
    }
    sum = (sum & 0xffff) + (sum >> 16)
    return ~sum & 0xffff
}

function verify_checksum(bytes, checksum_val) {
    if ((~checksum(bytes)& 0xffff) + checksum_val == 0xffff){
        return true
    } 
    return false
}

const data = [0x12, 0x34, 0xab, 0xcd];
const cs = checksum(data);
console.log(verify_checksum(data, cs)===true? "first test passed": "first test failed");

const data2 = [0x12, 0x34, 0xab, 0xcd];
const cs2 = checksum(data2) + 1;
console.log(verify_checksum(data2, cs2)===false? "second test passed": "second test failed");

const data3 = [0x12, 0x34, 0xab];
const cs3 = checksum(data3);
console.log(verify_checksum(data3, cs3)===true? "third test passed": "third test failed");
