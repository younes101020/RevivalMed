import { createServerFn } from '@tanstack/react-start'

export const handleForm = createServerFn({
  method: 'POST',
})
    .inputValidator((data: unknown) => {
        if (!(data instanceof FormData)) {
          throw new Error('Invalid form data')
        }
        return data
    })
    .handler(async () => {
        return 'Form has validated successfully'
    })