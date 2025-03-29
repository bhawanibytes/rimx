import express from 'express';
import Organization from '../models/Organization.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const organization = new Organization({
      name: req.body.name,
      createdBy: req.user.id,
      members: [{ user: req.user.id, role: 'admin' }],
    });

    await organization.save();
    res.status(201).json(organization);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const organizations = await Organization.find({
      'members.user': req.user.id,
    });
    res.json(organizations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;