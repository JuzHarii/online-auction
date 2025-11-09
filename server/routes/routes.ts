import { Router } from "express";
import * as authController from "../controllers/auth.controllers.ts";
import { celebrate, Joi, Segments } from "celebrate";

const router = Router();

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/;

const createUserSchema = {
    [Segments.BODY]: Joi.object({
        name: Joi.string().required().min(3).max(8),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8).max(30).regex(strongPasswordRegex),
    })
}

router.post("/auth/register", celebrate(createUserSchema), authController.register);

router.post("/auth/signin", authController.login);

export default router;