import { z } from 'zod'
import { StatusType } from '@prisma/client'

export const FacebookPostSchema  = z.object({
  annID: z.string().optional(),
  pageName: z.string().optional(),
  fbPostID: z.string(),
  author: z.string(),
  content: z.string(),
  url: z.string().url(),
  createdAt: z.date(),
  status: z.nativeEnum(StatusType)
})

export const AddFacebookPostSchema = FacebookPostSchema
  .superRefine((data, ctx) => {
    if(data.pageName === '')
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pageName'],
        message: "Page name cannot be empty."
    })
    if(data.fbPostID === '')
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fbPostID'],
        message: "Post id cannot be empty."
    })
    if(data.content.trim() === '')
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['content'],
        message: "Content cannot be empty."
    })
    if(data.url.trim() === '')
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['url'],
        message: "Url cannot be empty."
    })
})

export type AddFacebookPostSchemaType = z.infer<typeof AddFacebookPostSchema>

export const AddFacebookPostSchemaDefault : AddFacebookPostSchemaType = {
  annID: '',
  pageName: '',
  fbPostID: '',
  author: '',
  content: '',
  url: '',
  createdAt: new Date(),
  status: StatusType.PENDING
}

export const EditFacebookPostSchema = FacebookPostSchema.extend({
  id: z.string()
})

export type EditFacebookPostSchemaType = z.infer<typeof EditFacebookPostSchema>

export const EditFacebookPostSchemaDefault : EditFacebookPostSchemaType = {
  id: '',
  annID: '',
  pageName: '',
  fbPostID: '',
  author: '',
  content: '',
  url: '',
  createdAt: new Date(),
  status: StatusType.PENDING
}

export const DeleteFacebookPostSchema = z.object({
  id: z.string()
})

export type DeleteFacebookPostSchemaType = z.infer<typeof DeleteFacebookPostSchema>

export const DeleteFacebookPostSchemaDefault : DeleteFacebookPostSchemaType = {
  id: '',
}

