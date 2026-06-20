'use client';

import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { tinaField, useTina } from 'tinacms/dist/react';

export function useEditableDocument(tina, documentKey) {
  const { data } = useTina(tina);
  return data[documentKey];
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
