import express from 'express';
import { getItems, parseItems } from '../controllers/ItemController';

const router = express.Router();

router.get('/', (req, res) => {
  const searchTerm = req.query.searchterm as string;
  const offsetRaw = req.query.offset;
  const offset = typeof offsetRaw === "string" ? parseInt(offsetRaw, 10) : undefined;
  const limitRaw = req.query.limit;
  const limit = typeof limitRaw === "string" ? parseInt(limitRaw, 10) : undefined;
  const paginatedItems = getItems(searchTerm, offset, limit);
  res.json(paginatedItems);
});
router.post('/parse', (req, res) => {
  const item = req.body;
  const parsedItem = parseItems(item);
  res.json(parsedItem);
});

export default router;