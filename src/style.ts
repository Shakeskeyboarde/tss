// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Styled } from './styled';

/**
 * Values provided as part of a {@link Styled styled} template string.
 */
type StyleTemplateValues<TProps extends {}, TArgs extends readonly unknown[] = []> = (
  | string
  | number
  | null
  | undefined
  | { toString: () => string }
  | ((props: TProps, ...args: TArgs) => string | number | null | undefined | { toString: () => string })
)[];

interface Style<TProps extends {}, TArgs extends unknown[] = []> {
  extend: <TExtendedProps extends TProps, TExtendedArgs extends TArgs>(
    style: Style<TExtendedProps, TExtendedArgs>,
  ) => Style<TExtendedProps, TExtendedArgs>;

  getString: (props: TProps, ...args: TArgs) => string;
}

function createCompoundStyle<TProps extends {}, TArgs extends unknown[] = []>(
  ...styles: Style<TProps, TArgs>[]
): Style<TProps, TArgs> {
  const style: Style<TProps, TArgs> = {
    extend: (newStyle) => createCompoundStyle(style, newStyle),
    getString: (props, ...args) => {
      let str = '';

      for (let i = styles.length - 1; i >= 0; i--) {
        str = styles[i].getString(props, ...args) + '\n' + str;
      }

      return str;
    },
  };

  return style;
}

function createStyle<TProps extends {}, TArgs extends unknown[] = []>(
  template: TemplateStringsArray,
  values: StyleTemplateValues<TProps, TArgs>,
): Style<TProps, TArgs> {
  const style: Style<TProps, TArgs> = {
    extend: (newStyle) => createCompoundStyle(style, newStyle),
    getString: (props, ...args) => {
      let styleString = '';

      for (let i = template.raw.length - 1; i >= 0; --i) {
        const value = values[i];
        styleString =
          template.raw[i] + (typeof value === 'function' ? value(props, ...args) : value ?? '') + styleString;
      }

      return styleString;
    },
  };

  return style;
}

export { type Style, type StyleTemplateValues, createStyle };
