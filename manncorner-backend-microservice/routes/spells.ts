import express from 'express';
import { getSpells } from '../controllers/SpellController';

const router = express.Router();

router.get('/', (req, res) => {

  const spells = getSpells();
  res.json(spells);
});

export default router;