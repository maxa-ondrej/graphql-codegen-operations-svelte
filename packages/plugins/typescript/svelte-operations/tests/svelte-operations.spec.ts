import '@graphql-codegen/testing';
import { buildSchema } from 'graphql';
import { plugin } from '../src/index.js';

describe('svelte-operations', () => {
  const schema = buildSchema(/* GraphQL */ `
    type Query {
      foo: String!
    }
  `);

  it('Should greet', async () => {
    const result = await plugin(schema, [], {
      types: './types',
    });

    expect(result).toBe(`import type * as Types from './types';
type Query<R = object | null, V = object> = { R: R; V?: V };
type Mutation<R = object | null, V = object> = { R: R; V?: V };

export function query<Q extends Query>(variables: Q['V'] = undefined) {
return new Promise<Q['R']>((r) => r({} as Q['R']));
}

export function mutation<Q extends Query>(variables: Q['V'] = undefined) {
return new Promise<Q['R']>((r) => r({} as Q['R']));
}

export type foo = Query<Types.Scalars['String'], undefined>;
export const foo__variables = {};
`);
  });
});
