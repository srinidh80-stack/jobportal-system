import express from 'express';
import { semanticSearch } from '../services/vectorService.js';
const router = express.Router();

router.post('/search', async (req,res)=>{
 const { query } = req.body;
 const results = await semanticSearch(query);
 res.json(results);
});

export default router;
