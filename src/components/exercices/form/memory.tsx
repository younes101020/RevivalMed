import { useForm } from '@tanstack/react-form'
import { handleForm } from "@/lib/form"
import { formOpts } from "@/lib/form-isomorphic"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

export function MemoryExercice() {
  const [score, setScore] = useState("");

  const form = useForm({
    ...formOpts,
    validators: {
      onSubmitAsync: async ({ value }) => {
        const result = await handleForm({ data: value });
        if(result.score) setScore(result.score);
        if(result.error) {
          return {
            fields: result.error
          }
        }
      }
    }
  })

  return (
    <div className='flex flex-col gap-8 max-h-[80vh] overflow-y-auto'>
        <div className='space-y-2'>
            <h3 className='scroll-m-20 text-4xl font-extrabold tracking-tight text-balance underline underline-offset-4'>Questionnaire final</h3>
            <p className='text-xs'>Le résultat de ce questionnaire permettra d'évaluer vos capacités de mémorisation.</p>
            {score &&
            <Badge variant={"default"}>
              Votre score : {score}
            </Badge>
            }
        </div>
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      className='flex flex-col gap-4 px-3'
    >

      <form.Field
        name="characterName"
      >
        {(field) => {
          return (
            <div className="space-y-2">
              <Label htmlFor="characterName">Nom du personnage</Label>
              <Input
                name="characterName"
                id="characterName"
                type="text"
                value={field.state.value}
                required={true}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error) => (
                <p className='text-red-500' key={error as unknown as string}>{error}</p>
              ))}
            </div>
          )
        }}
      </form.Field>
      <form.Field
        name="characterCountry"
      >
        {(field) => {
          return (
            <div className="space-y-2">
              <Label htmlFor="characterCountry">Pays du personnage</Label>
              <Input
                name="characterCountry"
                type="text"
                value={field.state.value}
                required={true}
                id='characterCountry'
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error) => (
                <p className='text-red-500' key={error as unknown as string}>{error}</p>
              ))}
            </div>
          )
        }}
      </form.Field>
      <form.Field
        name="seasonStore"
      >
        {(field) => {
          return (
            <div className="space-y-2">
              <Label htmlFor="seasonStore">Saison durant laquelle se déroule l'histoire</Label>
              <Select name="seasonStore">
                <SelectTrigger className='w-full'>
                    <SelectValue placeholder="..." />
                </SelectTrigger>
                <SelectContent id="seasonStore" defaultValue={field.state.value}>
                    <SelectItem value="winter">Hiver</SelectItem>
                    <SelectItem value="spring">Printemps</SelectItem>
                    <SelectItem value="summer">Été</SelectItem>
                    <SelectItem value="autumn">Automne</SelectItem>
                </SelectContent>
              </Select>
              {field.state.meta.errors.map((error) => (
                <p className='text-red-500' key={error as unknown as string}>{error}</p>
              ))}
            </div>
          )
        }}
      </form.Field>
      <form.Field
        name="weather"
      >
        {(field) => {
            return (
            <div className="space-y-2">
              <Label htmlFor="weather">Météo dans laquelle se déroule l'histoire</Label>
              <Select name="weather">
                <SelectTrigger className='w-full'>
                    <SelectValue placeholder="..." />
                </SelectTrigger>
                <SelectContent id="weather" defaultValue={field.state.value}>
                    <SelectItem value="très chaud">Très chaud</SelectItem>
                    <SelectItem value="chaud">Chaud</SelectItem>
                    <SelectItem value="tempéré">Tempéré</SelectItem>
                    <SelectItem value="froid">Froid</SelectItem>
                    <SelectItem value="très froid">Très froid</SelectItem>
                </SelectContent>
              </Select>
              {field.state.meta.errors.map((error) => (
                <p className='text-red-500' key={error as unknown as string}>{error}</p>
              ))}
            </div>
          )
        }}
      </form.Field>
      <form.Field
        name="oceanColor"
      >
        {(field) => {
          return (
            <div className="space-y-2">
              <Label htmlFor="oceanColor">Couleur de l'océan</Label>
              <Select name="oceanColor">
                <SelectTrigger className='w-full'>
                    <SelectValue placeholder="..." />
                </SelectTrigger>
                <SelectContent id="oceanColor" defaultValue={field.state.value}>
                    <SelectItem value="bleu éclatant">Bleu éclatant</SelectItem>
                    <SelectItem value="rouge éclatant">Rouge éclatant</SelectItem>
                    <SelectItem value="bleu foncé">Bleu foncé</SelectItem>
                </SelectContent>
              </Select>
              {field.state.meta.errors.map((error) => (
                  <p className='text-red-500' key={error as unknown as string}>{error}</p>
              ))}
            </div>
          )
        }}
      </form.Field>
      <form.Field
        name="inOceanPerceivedObject"
      >
        {(field) => {
          return (
            <div className="space-y-2">
              <Label htmlFor="inOceanPerceivedObject">Objet perçu dans l'océan</Label>
              <Select name="inOceanPerceivedObject">
                <SelectTrigger className='w-full'>
                    <SelectValue placeholder="..." />
                </SelectTrigger>
                <SelectContent id="inOceanPerceivedObject" defaultValue={field.state.value}>
                    <SelectItem value="algues">Algues</SelectItem>
                    <SelectItem value="poissons zébré">Poisson zébré</SelectItem>
                    <SelectItem value="cailloux">Cailloux</SelectItem>
                </SelectContent>
              </Select>
              {field.state.meta.errors.map((error) => (
                <p className='text-red-500' key={error as unknown as string}>{error}</p>
              ))}
            </div>
          )
        }}
      </form.Field>
      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit} onClick={() => form.handleSubmit()} className="mt-4">
            {isSubmitting ? '...' : 'Soumettre'}
          </Button>
        )}
      </form.Subscribe>
    </form>
    </div>
  )
}