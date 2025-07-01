const moment = require('moment');

module.exports = {
    getCurrentTime: () => moment().format(),
    formatDate: (date, format = 'YYYY-MM-DD HH:mm:ss') => moment(date).format(format),
    addDays: (date, days) => moment(date).add(days, 'days').format(),
    subtractDays: (date, days) => moment(date).subtract(days, 'days').format(),
    isValidDate: (date) => moment(date).isValid(),
    getRelativeTime: (date) => moment(date).fromNow()
};