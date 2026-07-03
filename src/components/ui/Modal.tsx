import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  onClose: () => void;
  onSave?: () => void;
  saveLabel?: string;
  children: React.ReactNode;
  wide?: boolean;
}

export function Modal({ title, onClose, onSave, saveLabel = 'Save', children, wide }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-3xl' : 'max-w-2xl'} max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
        {onSave && (
          <div className="sticky bottom-0 bg-white border-t border-neutral-100 px-6 py-4 flex justify-end gap-2 rounded-b-2xl">
            <button onClick={onClose} className="px-4 py-2 text-sm border border-neutral-200 rounded-xl hover:bg-neutral-50">Cancel</button>
            <button onClick={onSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700">{saveLabel}</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:border-blue-400 outline-none bg-white ${props.className || ''}`} />;
}

export function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:border-blue-400 outline-none resize-none bg-white ${props.className || ''}`} />;
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return <select {...props} className={`w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:border-blue-400 outline-none bg-white ${props.className || ''}`}>{children}</select>;
}
