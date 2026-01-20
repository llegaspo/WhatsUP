import { z } from 'zod';


export const UserSchema = z.object({
  fname: z.string(),
  mname: z.string(),
  lname: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export type UserSchemaType = z.infer<typeof UserSchema>;

export const UserSchemaDefaults : UserSchemaType = {
  fname: "",
  mname: "",
  lname: "",
  username: '',
  email: "",
  password: ""
}

export const RegisterSchema = UserSchema.extend({
  password: z.string().min(8, "Password must be atleast 8 characters").max(25, "Password must not be more than 25 characters"),
  confirmPassword: z.string().min(8, "Password must be atleast 8 characters").max(25, "Password must not be more than 25 characters"),
  confirmEmail: z.string().email()
}).superRefine((data, ctx) => {
  if(data.fname === '')
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["fname"],
      message: "First name cannot be empty."
    })
  if(data.lname === '')
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["lname"],
      message: "Last name cannot be empty."
  })
  if(data.username === '')
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['lname'],
      message: "Username cannot be empty."
    })
  if(data.email === '')
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["email"],
      message: "Email cannot be empty."
    })
  if(data.confirmEmail === '')
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["confirmEmail"],
      message: "Please confirm your email."
    })
  if(data.password === '')
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["password"],
      message: "Password cannot be empty."
    })
  if(data.confirmPassword === '')
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["confirmPassword"],
      message: "Please confirm your password."
    })
})


export type RegisterSchemaType = z.infer<typeof RegisterSchema>

export const RegisterSchemaDefault : RegisterSchemaType = {
  fname: '',
  mname: '',
  lname: '',
  username: '',
  email: '',
  confirmEmail: '',
  password: '',
  confirmPassword: ''
}

export const EditUserSchema = UserSchema.extend({
  id: z.string()
})

export type EditUserSchemaType = z.infer<typeof EditUserSchema>

export const EditUserSchemaDefault : EditUserSchemaType = {
  id: '',
  fname: '',
  mname: '',
  lname: '',
  username: '',
  email: '',
  password: '',
}

export const DeleteUserSchema = z.object({
  id: z.string(),
})

export type DeleteUserSchemaType = z.infer<typeof DeleteUserSchema>

export const DeleteUserSchemaDefault : DeleteUserSchemaType = {
  id: ''
}

export const FetchUserSchema = z.object({
  id: z.string()
})

export type FetchUserSchemaType = z.infer<typeof FetchUserSchema>

export const FetchUserSchemaDefault : FetchUserSchemaType = {
  id: '',
}
