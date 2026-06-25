/**
 * useFeedback — small adapter hook around the global toast + confirm dialog.
 *
 * Pages call:
 *   const { notify, confirm } = useFeedback();
 *   notify('Saved', 'success');
 *   const ok = await confirm({ title, message, confirmText, danger });
 *
 * It wraps the context's `toast(message, type)` and `showConfirm(...)`
 * (which resolves to `{ ok, note }`) so callers get a plain boolean back.
 * Message text is HTML-escaped here so user/server-supplied strings can't
 * inject markup into the ConfirmModal (which renders body as HTML).
 */
import { useContext } from 'react';
import { HealthsoftContext } from '../context/HealthsoftContext';

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const useFeedback = () => {
  const { toast, showConfirm } = useContext(HealthsoftContext);

  const notify = (message, type = 'info') => toast(message, type);

  const confirm = async ({ title, message, confirmText = 'Confirm', danger = false }) => {
    const safeBody = escapeHtml(message ?? '').replace(/\n/g, '<br/>');
    const res = await showConfirm(title, safeBody, confirmText, danger ? 'error' : 'success');
    return !!(res && res.ok);
  };

  return { notify, confirm };
};

export default useFeedback;
