import { Loader, ServerCrash, Download } from 'lucide-react';
import axios from "axios";

interface ImageResultsProps {
  isLoading: boolean;
  error: string | null;
  icons: string[];
}

export function ImageResults({ isLoading, error, icons }: ImageResultsProps) {

const handleDownload = async (url: string) => {
  try {
    const response = await axios.get(url, { responseType: 'blob' });
    const blob = new Blob([response.data]);

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `icon-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (err) {
    window.open(url, '_blank');
  }
};

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-white/50 rounded-lg p-8">
          <Loader size={48} className="animate-spin mb-4 text-indigo-500" />
          <p className="text-lg font-semibold">Generating icon set...</p>
          <p className="text-sm">This may take up to a minute.</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-red-600 bg-red-50 border border-red-200 rounded-lg p-8">
          <ServerCrash size={48} className="mb-4" />
          <p className="text-lg font-semibold">Generation Failed</p>
          <p className="text-sm text-center">{error}</p>
        </div>
    );
  }

  if (icons.length === 0) {
    return (
        <div className="flex items-center justify-center h-full text-gray-500 bg-white rounded-lg p-8 border-2 border-dashed border-gray-300">
          <p>Your generated icons will appear here.</p>
        </div>
    );
  }

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {icons.map((iconUrl, index) => (
            <div key={index} className="relative group aspect-square">
              <img src={iconUrl} alt={`Generated icon ${index + 1}`} className="w-full h-full object-cover rounded-lg bg-white shadow-md border border-gray-200" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <button onClick={() => handleDownload(iconUrl)} className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 backdrop-blur-sm">
                  <Download size={24} />
                </button>
              </div>
            </div>
        ))}
      </div>
  );
}