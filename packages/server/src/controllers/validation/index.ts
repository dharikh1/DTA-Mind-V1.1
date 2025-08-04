import { Request, Response, NextFunction } from 'express'
import validationService from '../../services/validation'
import { InternalDtamindError } from '../../errors/internalDtamindError'
import { StatusCodes } from 'http-status-codes'

const checkFlowValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const flowId = req.params?.id as string | undefined
        if (!flowId) {
            throw new InternalDtamindError(
                StatusCodes.PRECONDITION_FAILED,
                `Error: validationController.checkFlowValidation - id not provided!`
            )
        }
        const workspaceId = req.user?.activeWorkspaceId
        const apiResponse = await validationService.checkFlowValidation(flowId, workspaceId)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

export default {
    checkFlowValidation
}
