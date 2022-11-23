import { compile } from './compile.js';

describe('compile', () => {
  test('top level declarations', () => {
    const style = `
      color: red;
      margin: 1px;
    `;

    expect(compile(style)).toMatchInlineSnapshot(`
      {
        "children": [
          "color: red",
          "margin: 1px",
        ],
      }
    `);
  });

  test('quotes', () => {
    const style = `
      foo[bar="']"] {
        key: "value;notKey: notValue";
        key: 'value;notKey: notValue';
      }
      foo[bar='"]'] {
        declaration;
      }
    `;

    expect(compile(style)).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "children": [
              "key: "value;notKey: notValue"",
              "key: 'value;notKey: notValue'",
            ],
            "condition": {
              "selectors": [
                "foo[bar="']"]",
              ],
            },
          },
          {
            "children": [
              "declaration",
            ],
            "condition": {
              "selectors": [
                "foo[bar='"]']",
              ],
            },
          },
        ],
      }
    `);
  });

  test.todo('escapes');
  test.todo('brackets');

  test('parent selectors', () => {
    const style = `
      @media & {
        color: red;
      }
      & input {
        a & {
          cont&nt: "&";
        }
      }
    `;

    expect(compile(style)).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "children": [
              "color: red",
            ],
            "condition": {
              "at": "@media &",
            },
          },
          {
            "children": [
              {
                "children": [
                  "cont&nt: "&"",
                ],
                "condition": {
                  "selectors": [
                    "a  & ",
                  ],
                },
              },
            ],
            "condition": {
              "selectors": [
                " &  input",
              ],
            },
          },
        ],
      }
    `);
  });

  test.todo('omit empty blocks');
  test.todo('omit empty value declarations');
  test.todo('ignore missing semicolon');
  test.todo('throw on unclosed quotes');
  test.todo('throw on unclosed selector brackets');
  test.todo('throw on unclosed block brackets');
  test.todo('throw on extra block bracket');
});
