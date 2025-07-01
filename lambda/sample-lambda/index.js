const uuidUtils = require('/opt/nodejs/index');

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    try {
        const uuid = uuidUtils.generateUUID();
        const shortUuid = uuidUtils.generateShortUUID();
        const isValid = uuidUtils.validateUUID(uuid);
        
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Sample Lambda 1 executed successfully',
                generatedUUID: uuid,
                shortUUID: shortUuid,
                isValidUUID: isValid,
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