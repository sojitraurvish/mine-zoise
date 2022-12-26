"use strict"
import * as Joi from "joi"
import { apiResponse } from '../../util/index'
import { isValidObjectId } from 'mongoose'
import { Request, Response } from 'express'

const regExpEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^ <>()[\]\\., ;: \s @"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const addVideoFeed = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        description: Joi.string().required(),
        feedUrl: Joi.string().required(),
        thumbnail: Joi.string(),
        setting: Joi.object().required(),
        country: Joi.string(),
        state: Joi.string(),
        city: Joi.string(),
        suburb: Joi.string(),
        latitude: Joi.string(),
        longitude: Joi.string(),
        // categoryId: Joi.string().error(new Error('categoryId is string!')),
        // tag: Joi.array().error(new Error('tag is array!')),
    })
    schema.validateAsync(req.body).then(async result => {
        return next()
    }).catch(async error => { res.status(400).json(new apiResponse(400, error.message, {}, {})) })
}

export const likeDislikeVideo = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        likeDislikeFlag: Joi.number().required(),
    })
    schema.validateAsync(req.body).then(async result => {
        return next()
    }).catch(async error => { res.status(400).json(new apiResponse(400, error.message, {}, {})) })
}
