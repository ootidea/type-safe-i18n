import type { LiteralAutoComplete, MergeIntersection, NonEmptyArray, ValueOf } from 'advanced-type-utilities'

type LocaleDeclaration = {
  required: Readonly<NonEmptyArray<string>>
  optional?: readonly string[]
}

// Use this instead of T['optional'] to get the correct type.
type OptionalLocalesOf<T extends LocaleDeclaration> = T extends { optional: readonly string[] } ? T['optional'] : []

export function declareLocales<const T extends LocaleDeclaration>(localeDeclaration: T) {
  type Locale = LiteralAutoComplete<T['required'][number] | OptionalLocalesOf<T>[number]>
  let currentLocale: Locale = localeDeclaration.required[0]

  return {
    setLocale: (locale: Locale) => {
      currentLocale = locale
    },
    createI18nObject: <
      const Resources extends Record<
        keyof any,
        MergeIntersection<
          Record<T['required'][number], unknown> & Partial<Record<OptionalLocalesOf<T>[number], unknown>>
        >
      >,
    >(
      resources: Resources,
    ) => {
      const result = {} as { [K in keyof Resources]: ValueOf<Resources[K]> }
      for (const ownKey of Reflect.ownKeys(resources)) {
        Object.defineProperty(result, ownKey, {
          get: () => {
            return (resources[ownKey] as any)[currentLocale]
          },
        })
      }
      return result
    },
  }
}
