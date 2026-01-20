import { z } from 'zod'
import { PageType } from '@prisma/client'

export const FacebookPageSchema = z.object({
  pageName: z.string(),
  url: z.string().url(),
  type: z.nativeEnum(PageType)
})

export const AddFacebookPageSchema = FacebookPageSchema
.superRefine((data, ctx) => {
  if(data.pageName.trim() === '')
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['pageName'],
      message: 'Page name cannot be empty.'
    })
  if(data.url === '')
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['url'],
      message: 'Url cannot be empty.'
    })
})

export type AddFacebookPageSchemaType = z.infer<typeof AddFacebookPageSchema>

export const AddFacebookPageSchemaDefault : AddFacebookPageSchemaType = {
  pageName: '',
  url: '',
  type: PageType.INTEREST
}

export const EditFacebookPageSchema = FacebookPageSchema

export type EditFacebookPageSchemaType = z.infer<typeof EditFacebookPageSchema>

export const EditFacebookPageSchemaDefault : EditFacebookPageSchemaType = {
  pageName: '',
  url: '',
  type: PageType.INTEREST
}

export const DeleteFacebookPageSchema = z.object({
  pageName: z.string()
})

export type DeleteFacebookPageSchemaType = z.infer<typeof DeleteFacebookPageSchema>

export const DeleteFacebookPageDefault : DeleteFacebookPageSchemaType = {
  pageName: '',
}
