import { useState } from 'react';
import { ImageForm } from './ImageForm';
import { ImageResults } from './ImageResults.tsx';
import {generateIcons} from "../services/imageService.ts";

export function ImageGenerator() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedIcons, setGeneratedIcons] = useState<string[]>([]);

    // This function is passed to the form component and called on submission
    const handleGenerate = async (prompt: string, style: string, colors: string[]) => {
        setIsLoading(true);
        setError(null);
        setGeneratedIcons([]);

        try {
            const imageUrls = await generateIcons(prompt, style, colors);
            setGeneratedIcons(imageUrls);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-4 md:p-8 max-w-7xl mx-auto">
            <div className="w-full lg:w-1/3 lg:max-w-sm flex-shrink-0">
                <ImageForm isLoading={isLoading} onSubmit={handleGenerate} />
            </div>
            <div className="w-full lg:w-2/3">
                <ImageResults isLoading={isLoading} error={error} icons={generatedIcons} />
            </div>
        </div>
    );
}
