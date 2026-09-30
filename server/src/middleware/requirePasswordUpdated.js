export function requirePasswordUpdated(req, res, next) {
  if (req.user?.mustChangePassword) {
    return res.status(403).json({ message: "Change your temporary password before using the portal." });
  }
  next();
}
