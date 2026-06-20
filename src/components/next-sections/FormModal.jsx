'use client';

import { useEffect, useState } from 'react';

export default function FormModal() {
  const [form, setForm] = useState({ open: false, src: '', title: '' });

  useEffect(() => {
    function handleClick(event) {
      const trigger = event.target.closest('.form-trigger');
      if (!trigger) return;
      setForm({
        open: true,
        src: trigger.dataset.formSrc || '',
        title: trigger.dataset.formTitle || '',
      });
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (!form.open) return undefined;

    document.body.style.overflow = 'hidden';
    function handleKeydown(event) {
      if (event.key === 'Escape') close();
    }

    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [form.open]);

  function close() {
    setForm({ open: false, src: '', title: '' });
  }

  return (
    <div id="form-modal" className={form.open ? 'open' : undefined} role="dialog" aria-modal="true" aria-labelledby="form-modal-title">
      <div id="form-modal-back" onClick={close}></div>
      <div id="form-modal-box">
        <div id="form-modal-head">
          <span id="form-modal-title">{form.title}</span>
          <button id="form-modal-close" aria-label="Close" onClick={close}>✕</button>
        </div>
        {form.open && (
          <iframe id="form-modal-iframe" src={form.src} title={form.title} frameBorder="0" marginHeight="0" marginWidth="0">Loading...</iframe>
        )}
      </div>
    </div>
  );
}
