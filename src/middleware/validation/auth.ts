"use strict"
import * as Joi from "joi"
import { apiResponse } from '../../util/index'
import { isValidObjectId } from 'mongoose'
import { Request, Response } from 'express'

const regExpEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^ <>()[\]\\., ;: \s @"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const signUp = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        email: Joi.string().lowercase().max(50).pattern(new RegExp(regExpEmail)).required(),
        password: Joi.string().min(8).max(20).required(),
        username: Joi.string().required(),
        DOB: Joi.string().lowercase().required(),
        gender: Joi.string().required(),
        location: Joi.string().lowercase().required(),
        // deviceToken: Joi.string().error(new Error('deviceToken is string!'))
    })
    schema.validateAsync(req.body).then(async (result) => {
        return next();
    }).catch(async error => {
        res.status(400).json(new apiResponse(400, error.message, {}, {}));
    })
}

export const otpVerification = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        otp: Joi.number().min(6).required(),
    })
    schema.validateAsync(req.body).then(async (result) => {
        return next();
    }).catch(async error => {
        res.status(400).json(new apiResponse(400, error.message, {}, {}));
    })
}

export const login = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        email: Joi.string().lowercase().max(50).pattern(new RegExp(regExpEmail)).required(),
        password: Joi.string().min(8).max(20).required(),
        // deviceToken: Joi.string().error(new Error('deviceToken is string!'))
    })
    schema.validateAsync(req.body).then(async (result) => {
        return next();
    }).catch(async error => {
        res.status(400).json(new apiResponse(400, error.message, {}, {}));
    })
}

export const updateDetails = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        email: Joi.string().lowercase().max(50).pattern(new RegExp(regExpEmail)),
        password: Joi.string().min(8).max(20),
        username: Joi.string(),
        DOB: Joi.string().lowercase(),
        gender: Joi.string(),
        location: Joi.string().lowercase()
        // deviceToken: Joi.string().error(new Error('deviceToken is string!'))
    })
    schema.validateAsync(req.body).then(async (result) => {
        return next();
    }).catch(async error => {
        res.status(400).json(new apiResponse(400, error.message, {}, {}));
    })
}

export const updatePassword = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
    })
    schema.validateAsync(req.body).then(async (result) => {
        return next();
    }).catch(async error => {
        res.status(400).json(new apiResponse(400, error.message, {}, {}));
    })
}

export const forgotPassword = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        email: Joi.string().lowercase().max(50).pattern(new RegExp(regExpEmail)).required()
    })
    schema.validateAsync(req.body).then(async (result) => {
        return next();
    }).catch(async error => {
        res.status(400).json(new apiResponse(400, error.message, {}, {}));
    })
}

export const resetPassword = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        resetOtp: Joi.number().min(6).required(),
        password: Joi.string().min(6).max(18).required()
    })
    schema.validateAsync(req.body).then(async (result) => {
        return next();
    }).catch(async error => {
        res.status(400).json(new apiResponse(400, error.message, {}, {}));
    })
}