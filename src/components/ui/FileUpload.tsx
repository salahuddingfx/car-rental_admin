import { useState, useRef } from 'react';
import { Upload, X, Image, Loader2 } from 'lucide-react';
import { uploadApi, type UploadResult } from '../../lib/api';

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: 'images' | 'videos' | 'documents' | 'avatars';
  accept?: string;
  label?: string;
  className?: string;
  previewClass?: string;
}

export function FileUpload({ value, onChange, folder = 'images', accept = 'image/*', label, className = '', previewClass = '' }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const result: UploadResult = await uploadApi.single(file, folder);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium">{label}</label>}

      {value ? (
        <div className={`relative group ${previewClass}`}>
          <img src={value} alt="" className="w-full h-40 object-cover rounded-xl" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 text-xs bg-white text-neutral-700 rounded-lg hover:bg-neutral-100"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-neutral-200 hover:border-blue-300 hover:bg-neutral-50'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="text-blue-500 animate-spin" />
              <p className="text-xs text-neutral-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                <Upload size={18} className="text-neutral-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-600">Click to upload or drag and drop</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">PNG, JPG, GIF up to 50MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}

interface MultiFileUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: 'images' | 'videos' | 'documents' | 'avatars';
  accept?: string;
  maxFiles?: number;
  label?: string;
  className?: string;
}

export function MultiFileUpload({ value, onChange, folder = 'images', accept = 'image/*', maxFiles = 10, label, className = '' }: MultiFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).slice(0, maxFiles - value.length);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      if (files.length === 1) {
        const result = await uploadApi.single(files[0], folder);
        onChange([...value, result.url]);
      } else {
        const result = await uploadApi.multiple(files, folder);
        onChange([...value, ...result.files.map(f => f.url)]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium">{label}</label>}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative group w-20 h-16">
              <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {value.length < maxFiles && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-neutral-200 hover:border-blue-300 hover:bg-neutral-50'
          }`}
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="text-blue-500 animate-spin" />
              <p className="text-xs text-neutral-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Image size={16} className="text-neutral-400" />
              <p className="text-xs text-neutral-500">Click or drop images ({value.length}/{maxFiles})</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
