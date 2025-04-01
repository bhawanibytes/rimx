// middleware/orgAccess.js
const Membership = require('../models/Membership');

module.exports = function(req, res, next) {
  try {
    const orgId = req.params.id || req.params.orgId;
    
    if (!orgId) {
      return res.status(400).json({ msg: 'Organization ID required' });
    }
    
    // Check membership (we'll add caching later)
    const membership = Membership.findOne({
      user: req.user.id,
      organization: orgId
    });
    
    if (!membership) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    
    // Attach membership info to request
    req.membership = membership;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};