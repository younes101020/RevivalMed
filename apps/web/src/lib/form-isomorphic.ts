import { formOptions } from '@tanstack/react-form'

export const formOpts = formOptions({
  defaultValues: {
    characterName: "",
    characterCountry: "",
    seasonStore: "",
    weather: "",
    oceanColor: "",
    inOceanPerceivedObject: "",
  },
})