import { z } from 'zod';
import { PriorityType } from '@prisma/client';

const today = new Date()

export const ToDoSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  fbID: z.string().optional(),
  dueDate: z.date(),
  priority: z.nativeEnum(PriorityType)
})

export const AddToDoSchema = ToDoSchema.superRefine((data,ctx) => {
  if(data.title === '')
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['title'],
      message: 'Title cannot be empty.'
    })
  if(data.dueDate < today )
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['dueDate'],
      message: 'Due date cannot be in the past.'
    })
})

export type AddToDoSchemaType = z.infer<typeof AddToDoSchema>

export const AddToDoSchemaDefault : AddToDoSchemaType = {
  title: '',
  description: '',
  dueDate: today,
  priority: PriorityType.IMPORTANT
}

export const EditToDoSchema = ToDoSchema.extend({
  id: z.string()
})

export type EditToDoSchemaType = z.infer<typeof EditToDoSchema>

export const EditToDoSchemaDefault : EditToDoSchemaType= {
  id: '',
  title: '',
  description: '',
  dueDate: today,
  priority: PriorityType.IMPORTANT,
}

export const DeleteToDoSchema = z.object({
  id: z.string()
}).superRefine((data, ctx) => {
    if(data.id === '')
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['id'],
        message: "To do to be removed cannot be empty."
    })
})

export type DeleteToDoSchemaType = z.infer<typeof DeleteToDoSchema>

export const DeleteToDoSchemaDefault : DeleteToDoSchemaType = {
  id: '',
}
