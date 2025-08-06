module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader || authHeader !== `Bearer ${process.env.SERVICE_API_KEY}`) {
    return res.status(403).json({ message: 'Forbidden: Invalid Service Token' });
  }
  next();
};
