import {
  isNullableType,
  isNonNullType,
  assertNonNullType,
  isListType,
  assertListType,
  isScalarType,
  type GraphQLArgument,
  type GraphQLInputType,
  type GraphQLOutputType,
  GraphQLType,
} from 'graphql';

export function create_variables(args: readonly GraphQLArgument[]) {
  if (args.length === 0) return 'undefined';
  return (
    '{' + args.map(arg => `"${arg.name}"${isNullableType(arg.type) ? '?' : ''}: ${get_type(arg.type)}`).join(',') + '}'
  );
}

export function create_variables_array(args: readonly GraphQLArgument[]) {
  if (args.length === 0) return '{}';
  return '{' + args.map(arg => `"${arg.name}": "${arg.type}"`).join(',') + '}';
}

export function get_type(gql: GraphQLType | GraphQLInputType | GraphQLOutputType, nil = true) {
  if (nil && isNullableType(gql)) {
    return `Types.Maybe<${get_type(gql, false)}>`;
  }
  if (nil && isNonNullType(gql)) {
    return get_type(assertNonNullType(gql).ofType, false);
  }
  if (isListType(gql)) {
    return get_type(assertListType(gql).ofType) + '[]';
  }
  if (isScalarType(gql)) {
    return `Types.Scalars['${gql}']`;
  }
  return `Types.${gql}`;
}
