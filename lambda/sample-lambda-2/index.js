const momentUtils = require('/opt/nodejs/index');

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    try {
        const currentTime = momentUtils.getCurrentTime();
        const formattedDate = momentUtils.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
        const tomorrow = momentUtils.addDays(new Date(), 1);
        const yesterday = momentUtils.subtractDays(new Date(), 1);
        const relativeTime = momentUtils.getRelativeTime(new Date());
        
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Sample Lambda 2 executed successfully',
                currentTime: currentTime,
                formattedDate: formattedDate,
                tomorrow: tomorrow,
                yesterday: yesterday,
                relativeTime: relativeTime,
                timestamp: new Date().toISOString()
            })
        };
        
        console.log('Response:', JSON.stringify(response, null, 2));
        return response;
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal server error',
                error: error.message
            })
        };
    }
};