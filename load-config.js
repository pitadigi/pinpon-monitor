const fs = require('fs-extra');
const path = require('path');

exports.loadConfig = function loadConfig() {
    return fs.readJSONSync(path.join(__dirname, 'pinpon-monitor-config.json'));
}
