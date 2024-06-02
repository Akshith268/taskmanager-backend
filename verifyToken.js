const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get the access token from the request headers
    const authHeader = req.headers.authorization;
    
    // Check if the access token is present
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Extract the token from the Authorization header
        const token = authHeader.split(' ')[1];
        
        // Verify the token
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if (err) {
                // If verification fails, return an error response
                return res.status(401).json({ message: 'Unauthorized access.' });
            } else {
                // If verification succeeds, extract the user ID from the decoded token
                req.user = decodedToken;
                next(); // Proceed to the next middleware
            }
        });
    } else {
        // If the access token is not present or not in the correct format, return an error response
        return res.status(401).json({ message: 'Access token is missing or invalid.' });
    }
};
