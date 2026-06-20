'use client';

import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { tinaField, useTina } from 'tinacms/dist/react';

export { useTina };

// Returns a tina shape that useTina can safely consume even when the dev
// server is not running — it behaves as a no-op and yields the fallback data.
export function makeSafeTina(documentKey, fallback) {
  return {
    data: { [documentKey]: fallback },
    query: `{ ${documentKey} { __typename } }`,
    variables: {},
  };
}

export function useEditableDocument(tina, documentKey, fallback) {
  const safeTina = tina ?? makeSafeTina(documentKey, fallback);
  const { data } = useTina(safeTina);
  return tina ? data[documentKey] : fallback;
}

export function EditableRichText({ document, field = 'body', fallbackHtml, style }) {
  return (
    <div data-tina-field={tinaField(document, field)} style={style}>
      {document?.[field] ? (
        <TinaMarkdown content={document[field]} />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: fallbackHtml }} />
      )}
    </div>
  );
}

export { tinaField };
