import { isStyledSelector } from './isStyledSelector';

/**
 * Convert a tagged template array and values into a single style
 * string with all function values resolved.
 */
export function getStyleText(template: TemplateStringsArray, values: unknown[], props: unknown): string {
  let styleText = template.raw
    .reduce<string[]>((acc, segment, i) => {
      acc.push(segment);

      if (i < values.length) {
        const value = values[i];

        acc.push(
          typeof value == null ? '' : typeof value === 'function' && !isStyledSelector(value) ? value(props) : value,
        );
      }

      return acc;
    }, [])
    .join('');

  // A style tagged template should always be a complete statement,
  // which means it should always end with a semicolon ";" or a
  // closing curly bracket "}". If it doesn't end with one of those
  // characters, then add a trailing semi-colon to terminate whatever
  // statement it contains. This is a fix for the most common miss
  // which where users create a helper containing one or more CSS
  // props, and don't terminate the last statement.
  //
  // Example: css`color: red`;
  //
  // Currently, there is no handling of block or quote open/close
  // imbalances. The solution would be too heavy for what should be
  // an obvious syntax errors.
  if (!/[;}]\s*$/.test(styleText)) {
    styleText += ';';
  }

  return styleText;
}
