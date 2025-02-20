export type AllPayload = ParsedInputTextPayload | ParsedChangeLanguagePayload | ParsedSearchPayload | string

export type ParsedInputTextPayload = {
  direction: string
  text: string
}

export type ParsedChangeLanguagePayload = {
  direction: string
  language: string
}

export type ParsedSearchPayload = {
  code: 200 | 404
  data: string
}