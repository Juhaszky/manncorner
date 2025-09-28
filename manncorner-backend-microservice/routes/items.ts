import express from 'express';
import { getItems, parseItems } from '../controllers/ItemController';

const router = express.Router();

router.get('/', (req, res) => {
  const searchTerm = req.query.searchterm as string;
  const paginatedItems = getItems(searchTerm);
  res.json(paginatedItems);
});
router.post('/parse', (req, res) => {
  const item = req.body;
  const parsedItem = parseItems(item);
  res.json(parsedItem);
});

export default router;