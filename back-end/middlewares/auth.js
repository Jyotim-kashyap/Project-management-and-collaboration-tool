const admin = require("../firebase");

exports.authCheck = async (req, res, next) => {

  const authToken = req.headers.authtoken;

  if (!authToken) {
    return res.status(401).json({
      error: "Authentication token is missing",
    });
  }

  try {
    const firebaseUser = await admin.auth().verifyIdToken(authToken);
    req.user = firebaseUser;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};
