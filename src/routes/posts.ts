import express from 'express';
import { LeanDocument } from 'mongoose';
import { kSecretKey } from '../constants';
import Post, { IPostDocument } from '../models/Post';

const router = express.Router();

const cachingTime = 20 * 60 * 1000;
let cacheTime: number;
let cachedPosts: LeanDocument<IPostDocument>[];

router
  .get('/', (req, res, next) => {
    if (cacheTime && Date.now() - cacheTime < cachingTime) {
      return res.json(cachedPosts);
    }

    return Post.find({})
      .lean()
      .then((newPosts) => {
        cacheTime = Date.now();
        cachedPosts = newPosts;
        return res.json(newPosts);
      })
      .catch((error) => next(error));
  })
  .post('/', (req, res, next) => {
    if (req.body.secretKey !== kSecretKey) {
      res.status(401);
      return res.json({ message: 'Unauthorized access!' });
    }

    const post = new Post(req.body);
    return post.save((error) => {
      if (error) {
        if (error.name === 'ValidationError') res.status(422);
        return next(error);
      }

      return res.json(post);
    });
  });

export default router;
