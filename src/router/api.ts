import express, { Router } from "express";

const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

export default router;