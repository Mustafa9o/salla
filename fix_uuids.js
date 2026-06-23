const fs = require('fs');
const crypto = require('crypto');

const data = JSON.parse(fs.readFileSync('twilight.json', 'utf8'));

data.components.forEach(comp => {
    if (comp.key && comp.key.endsWith('-123')) {
        comp.key = crypto.randomUUID();
    }
});

fs.writeFileSync('twilight.json', JSON.stringify(data, null, 4));
console.log('Fixed UUIDs in twilight.json');
