// middleware/orgAccess.js
const Membership = require('../models/Membership');
const mongoose = require('mongoose');

const orgAccess = async (req, res, next) => {
  try {
    const { organization } = req.body;

    if (!organization || !mongoose.Types.ObjectId.isValid(organization)) {
      return res.status(400).json({ msg: 'Invalid organization ID.' });
    }

    // Check membership (we'll add caching later)
    const membership = await Membership.findOne({
      user: req.user.id,
      organization: organization
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

module.exports = orgAccess;