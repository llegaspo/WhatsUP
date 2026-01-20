import { z } from 'zod';

export const AnnouncementSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.date(),
  source: z.string(),
  sourceLink: z.string().url().optional(),
  imageLink: z.string(),
  fbPostID: z.string().optional(),
})

export const AddAnnouncementSchema = AnnouncementSchema
  .superRefine((data, ctx) => {
    if(data.title.trim() === '')
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['title'],
        message: "Title cannot be empty."
    })
    if(data.source !== 'CUSTOM' && (!data.sourceLink || data.sourceLink.trim() === ''))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['sourceLink'],
        message: 'Source URL cannot be empty for non-custom sources.'
    })
})

export type AddAnnouncementSchemaType = z.infer<typeof AddAnnouncementSchema>

export const AddAnnouncementSchemaDefault : AddAnnouncementSchemaType = {
  title: '',
  description: '',
  createdBy: '',
  createdAt: new Date(),
  source: '',
  sourceLink: '',
  imageLink: ''
}

export const EditAnnouncementSchema = AnnouncementSchema.extend({
  id: z.string().cuid()
})

export type EditAnnouncementSchemaType = z.infer<typeof EditAnnouncementSchema>

export const  EditAnnouncementSchemaDefault : EditAnnouncementSchemaType = {
  id: '',
  title: '',
  createdBy: '',
  createdAt: new Date(),
  description: '',
  source: '',
  sourceLink: '',
  imageLink: ''
}

export const DeleteAnnouncementSchema = z.object({
  id: z.string().cuid()
})

export type DeleteAnnouncementSchemaType = z.infer<typeof DeleteAnnouncementSchema>

export const DeleteAnnouncementSchemaDefaults : DeleteAnnouncementSchemaType = {
  id: '',
}
