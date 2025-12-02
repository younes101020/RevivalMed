import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const MemorySchema = z.object({
  characterName: z.string().pipe(z.transform((val, ctx) => {
    if(val.trim().toLowerCase() !== "clara") {
      ctx.issues.push({
        code: "custom",
        message: "Mauvaise réponse, le nom du personnage est Clara.",
        input: val,
      })
    }
  })),
  characterCountry: z.string().pipe(z.transform((val, ctx) => {
    if(val.trim().toLowerCase() !== "australie") {
      ctx.issues.push({
        code: "custom",
        message: "Mauvaise réponse, le pays du personnage est l'Australie.",
        input: val,
      })
    }
  })),
  seasonStore: z.string().pipe(z.transform((val, ctx) => {
    if(val.trim().toLowerCase() !== "été") {
      ctx.issues.push({
        code: "custom",
        message: "Mauvaise réponse, l'histoire se déroule en été.",
        input: val,
      })
    }
  })),
  weather: z.string().pipe(z.transform((val, ctx) => {
    if(val.trim().toLowerCase() !== "très chaud") {
      ctx.issues.push({
        code: "custom",
        message: "Mauvaise réponse, il fait très chaud.",
        input: val,
      })
    }
  })),
  oceanColor: z.string().pipe(z.transform((val, ctx) => {
    if(val.trim().toLowerCase() !== "bleu éclatant") {
      ctx.issues.push({
        code: "custom",
        message: "Mauvaise réponse, la couleur de l'océan est bleu éclatant.",
        input: val,
      })
    }
  })),
  inOceanPerceivedObject: z.string().pipe(z.transform((val, ctx) => {
    if(val.trim().toLowerCase() !== "poissons zébrés") {
      ctx.issues.push({
        code: "custom",
        message: "Mauvaise réponse, les objets perçus dans l'océan sont des poissons zébrés.",
        input: val,
      })
    }
  })),
});

export const handleForm = createServerFn({
  method: 'POST',
})
    .inputValidator(MemorySchema)
    .handler(({ data }) => {
        return false;;
    })