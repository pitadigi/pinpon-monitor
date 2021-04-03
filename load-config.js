const fs = require('fs');
const path = require('path');

exports.loadConfig = function loadConfig() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'pinpon-monitor-config.json'), 'utf8'));
}
