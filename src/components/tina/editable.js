'use client';

import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { tinaField, useTina } from 'tinacms/dist/react';

export { useTina, tinaField };

export function makeSafeTina(documentKey, fallback) {
  return {
    data: { [documentKey]: fallback },
    query: `{ ${documentKey} { __typename } }`,
    variables: {},
  };
}

export function EditableRichText({ document, field = 'body', className, style }) {
  return (
    <div data-tina-field={tinaField(document, field)} className={className} style={style}>
      <TinaMarkdown content={document?.[field]} />
    </div>
  );
}
