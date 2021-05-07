import { Integration } from 'enums'

export const list = (items: Array<string>, integration: Integration): string => {
  let joinString: string

  if (integration === Integration.slack) joinString = '\n\n'
  else joinString = '\n'

  return [...items].join(joinString)
}
