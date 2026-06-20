import client from '../../tina/__generated__/client';

export async function getTinaDocument(queryName, relativePath) {
  try {
    const result = await client.queries[queryName]({ relativePath });
    return {
      data: result.data,
      query: result.query,
      variables: result.variables,
    };
  } catch {
    return null;
  }
}
