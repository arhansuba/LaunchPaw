import React from 'react';
import { Info } from 'lucide-react';

interface FormField {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  tooltip?: string;
}

interface TokenFormProps {
  fields: FormField[];
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const TokenForm: React.FC<TokenFormProps> = ({ fields, onSubmit, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.name}>
          <div className="flex items-center space-x-2 mb-2">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-200">
              {field.label}
            </label>
            {field.tooltip && (
              <div className="group relative">
                <Info className="h-4 w-4 text-gray-400" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48">
                  {field.tooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
              </div>
            )}
          </div>
          <input
            type={field.type}
            name={field.name}
            id={field.name}
            placeholder={field.placeholder}
            className="w-full px-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
            required
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating Token...' : 'Create Token'}
      </button>
    </form>
  );
};

export default TokenForm;