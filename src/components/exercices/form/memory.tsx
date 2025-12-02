import { useForm } from '@tanstack/react-form'
import { useStore } from '@tanstack/react-store'
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

export function MemoryExercice() {

  const form = useForm({
    ...formOpts,
    /*onSubmit: async (data) => {
      const formData = new FormData()
      Object.entries(data.value).forEach(([question, answer]) => {
        formData.append(question, answer as string)
      })
      await handleForm({ data: formData })
    },*/
    validators: {
      onSubmitAsync: async ({ value }) => {
        const hasErrors = await handleForm({ data: value })
        if(hasErrors) {
          return {
            fields: {

            }
          }
        }
      }
    }
  })

  const formErrors = useStore(form.store, (formState) => formState.errors)

  return (
    <div className='flex flex-col gap-8'>
        <div className='space-y-2'>
            <h3 className='scroll-m-20 text-4xl font-extrabold tracking-tight text-balance underline underline-offset-4'>Questionnaire final</h3>
            <p className='text-xs'>Le résultat de ce questionnaire permettra d'évaluer vos capacités de mémorisation.</p>
        </div>
    <Separator />
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      className='flex flex-col gap-4'
    >
      {formErrors.map((error) => (
        <p key={error as never as string}>{error}</p>
      ))}

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
                <p key={error as unknown as string}>{error}</p>
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
                <p key={error as unknown as string}>{error}</p>
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
                    <SelectValue placeholder="Saison" />
                </SelectTrigger>
                <SelectContent id="seasonStore" defaultValue={field.state.value}>
                    <SelectItem value="winter">Hiver</SelectItem>
                    <SelectItem value="spring">Printemps</SelectItem>
                    <SelectItem value="summer">Été</SelectItem>
                    <SelectItem value="autumn">Automne</SelectItem>
                </SelectContent>
              </Select>
              {field.state.meta.errors.map((error) => (
                <p key={error as unknown as string}>{error}</p>
              ))}
            </div>
          )
        }}
      </form.Field>
      <Separator />
      <form.Field
        name="weather"
      >
        {(field) => {
            return (
            <div className="space-y-2">
              <Label htmlFor="weather">Météo</Label>
              <Input
                name="weather"
                type="text"
                value={field.state.value}
                required={true}
                id='weather'
                onChange={(e) => field.handleChange(e.target.value)}
                />
              {field.state.meta.errors.map((error) => (
                <p key={error as unknown as string}>{error}</p>
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
              <Input
                name="oceanColor"
                type="text"
                value={field.state.value}
                required={true}
                id='oceanColor'
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error) => (
                  <p key={error as unknown as string}>{error}</p>
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
              <Input
                name="inOceanPerceivedObject"
                type="text"
                value={field.state.value}
                required={true}
                id='inOceanPerceivedObject'
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error as unknown as string}>{error}</p>
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