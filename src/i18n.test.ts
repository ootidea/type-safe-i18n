import { expect, test } from 'vitest'
import { declareLocales } from './i18n'

test('minimal example', () => {
  const { createI18nResource } = declareLocales({
    required: ['en'],
  })
  const t = createI18nResource({
    ok: { en: 'OK' },
  })
  expect(t.ok).toBe('OK')
})

test('changing current locale', () => {
  const { createI18nResource, setLocale } = declareLocales({
    required: ['en', 'ja'],
  })
  const t = createI18nResource({
    ok: { en: 'OK', ja: 'はい' },
  })
  expect(t.ok).toBe('OK')
  setLocale('ja')
  expect(t.ok).toBe('はい')
})
