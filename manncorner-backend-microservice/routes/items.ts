import express from 'express';
import { getItems, parseItem } from '../controllers/ItemController';

const router = express.Router();

router.get('/', (req, res) => {
  const searchTerm = req.query.searchTerm as string;

  const paginatedItems = getItems(searchTerm);
  res.json(paginatedItems);
});
router.post('/parse', (req, res) => {
  console.log(req);
  const item = req.body;
  const parsedItem = parseItem(item);
  res.json(parsedItem);
});

export default router;