"use strict"
import { apiResponse, image_folder } from '../../util/index'
import { Request, Response } from 'express'

export const file_type = async (req: Request, res: Response, next: any) => {
    if (!image_folder.includes(req.params.file)) return res.status(400).json(new apiResponse(400, 'invalid file type', { action: image_folder }, {}))
    next()
}