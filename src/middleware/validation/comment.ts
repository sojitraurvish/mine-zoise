"use strict"
import * as Joi from "joi"
import { apiResponse } from '../../util/index'
import { isValidObjectId } from 'mongoose'
import { Request, Response } from 'express'

const regExpEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^ <>()[\]\\., ;: \s @"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const addComment = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        message: Joi.string().required(),
        feedId: Joi.string().required()
    })
    schema.validateAsync(req.body).then(async (result) => {
        return next();
    }).catch(async error => {
        res.status(400).json(new apiResponse(400, error.message, {}, {}));
    })
}