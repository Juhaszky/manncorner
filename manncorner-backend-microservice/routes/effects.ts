import express from 'express';
import { getEffects } from '../controllers/EffectController';

const router = express.Router();

router.get('/', (req, res) => {
  const effects = getEffects();
  res.json(effects);
});

export default router;