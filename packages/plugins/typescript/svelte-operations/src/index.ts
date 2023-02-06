import { PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import { GraphQLSchema } from 'graphql';
import { create_variables, create_variables_array, get_type } from './utils';

export type SvelteOperationsPluginConfig = {
  types: string;
};

export const plugin: PluginFunction<Partial<SvelteOperationsPluginConfig>, string> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: SvelteOperationsPluginConfig
) => {
  const typesPath = config.types;
  let result = `import type * as Types from '${typesPath}';
type Query<R = object | null, V = object> = { R: R; V?: V };
type Mutation<R = object | null, V = object> = { R: R; V?: V };

export function query<Q extends Query>(variables: Q['V'] = undefined) {
return new Promise<Q['R']>((r) => r({} as Q['R']));
}

export function mutation<Q extends Query>(variables: Q['V'] = undefined) {
return new Promise<Q['R']>((r) => r({} as Q['R']));
}
`;
  if (schema.getQueryType() !== undefined && schema.getQueryType() !== null)
    Object.values(schema.getQueryType().getFields()).forEach(query => {
      const name = query.name;
      result += `
export type ${name} = Query<${get_type(query.type)}, ${create_variables(query.args)}>;
export const ${name}__variables = ${create_variables_array(query.args)};
`;
    });

  if (schema.getMutationType() !== undefined && schema.getMutationType() !== null)
    Object.values(schema.getMutationType().getFields()).forEach(mutation => {
      const name = mutation.name;
      result += `
export type ${name} = Mutation<${get_type(mutation.type)}, ${create_variables(mutation.args)}>;
export const ${name}__variables = ${create_variables_array(mutation.args)};
`;
    });

  return result;
};
