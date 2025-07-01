const { v4: uuidv4 } = require('uuid');

module.exports = {
    generateUUID: () => uuidv4(),
    generateShortUUID: () => uuidv4().split('-')[0],
    validateUUID: (uuid) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
};