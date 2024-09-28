import type { LiteralAutoComplete, MergeIntersection, NonEmptyArray, ValueOf } from 'advanced-type-utilities'

type LocaleDeclaration = {
  required: Readonly<NonEmptyArray<string>>
  optional?: readonly string[]
}

// Use this instead of T['optional'] to get the correct type.
type OptionalLocalesOf<T extends LocaleDeclaration> = T extends { optional: readonly string[] } ? T['optional'] : []

export function declareLocales<const T extends LocaleDeclaration>(localeDeclaration: T) {
  let currentLocale: LiteralAutoComplete<T['required'][number] | OptionalLocalesOf<T>[number]> =
    localeDeclaration.required[0]

  return {
    setLocale: (locale: LiteralAutoComplete<T['required'][number] | OptionalLocalesOf<T>[number]>) => {
      currentLocale = locale
    },
    createI18nObject: <
      const Resources extends Record<
        string,
        MergeIntersection<
          Record<T['required'][number], unknown> & Partial<Record<OptionalLocalesOf<T>[number], unknown>>
        >
      >,
    >(
      resources: Resources,
    ) => {
      const result = {} as { [K in keyof Resources]: ValueOf<Resources[K]> }
      for (const key of Object.getOwnPropertyNames(resources)) {
        Object.defineProperty(result, key, {
          get: () => {
            return (resources[key] as any)[currentLocale]
          },
        })
      }
      return result
    },
  }
}
