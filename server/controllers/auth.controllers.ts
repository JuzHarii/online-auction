import type { Request, Response } from "express";
import * as authService from "../services/auth.services.ts";
import { errorResponse, successResponse } from "../utils/response.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.create(req.body);

    if (!result.success || !result.user) {
      return res.status(400).json(errorResponse(String(result.message)));
    }

    const user = result.user;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not set in environment variables");
    }
    
    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        secret,
        { expiresIn: "1h" } 
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      maxAge: 1000 * 60 * 60, 
    });

    return res.status(201).json(successResponse(
      { name: user.name, email: user.email },
      "Register successfully"
    ));

  } catch (e) {
    return res.status(500).json(errorResponse(String(e)));
  }
};


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const data = await authService.authenticateUser({email, password});
        if (!data.success || !data.user) {
        return res.status(400).json(errorResponse("Invalid email or password"));
        }

        const user = data.user;
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(400).json(errorResponse("Invalid email or password"));
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET is not set");


        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            secret,
            { expiresIn: "1h" } 
        );


        res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60,
        });

        return res.status(200).json(successResponse(
        { name: user.name, email: user.email },
        "Login successfully"
        ));

    } catch (e) {
        return res.status(500).json(errorResponse(String(e)));
    }
};
