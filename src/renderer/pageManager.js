const fs = require('fs');

const loadPages = () => {
    const files = fs.readdirSync('./pages');
    console.log('>>>>>>>>', files);
}

module.exports = {
    loadPages
}