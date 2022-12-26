"use strict"
import * as Joi from "joi"
import { apiResponse } from '../../util/index'
import { isValidObjectId } from 'mongoose'
import { Request, Response } from 'express'

const regExpEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^ <>()[\]\\., ;: \s @"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const addFeed = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        description: Joi.string().error(new Error('description is string!')),
        feedUrl: Joi.string().error(new Error('url is string!')),
        country: Joi.string().error(new Error('country is string!')),
        state: Joi.string().error(new Error('state is string!')),
        city: Joi.string().error(new Error('city is string!')),
        suburb: Joi.string().error(new Error('suburb is string!')),
        latitude: Joi.number().error(new Error('latitude is number!')),
        longitude: Joi.number().error(new Error('longitude is number!')),
        setting: Joi.object().error(new Error('setting is object!')),
        // categoryId: Joi.string().error(new Error('categoryId is string!')),
        // tag: Joi.array().error(new Error('tag is array!')),
    })
    schema.validateAsync(req.body).then(async result => {
        return next()
    }).catch(async error => { res.status(400).json(new apiResponse(400, error.message, {}, {})) })
}

export const likeDislikeFeed = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        likeDislikeFlag: Joi.number().required(),
    })
    schema.validateAsync(req.body).then(async result => {
        return next()
    }).catch(async error => { res.status(400).json(new apiResponse(400, error.message, {}, {})) })
}