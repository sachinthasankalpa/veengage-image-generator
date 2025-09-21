import React, { useState, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Wand, Plus, Trash2, Loader } from 'lucide-react';
import useClickOutside from "../hooks/useClickOutside.ts";

const PRESET_STYLES = ['Auto', 'Sticker', 'Pastels', 'Business', 'Cartoon', '3D Model', 'Gradient'];

interface IconFormProps {
    isLoading: boolean;
    onSubmit: (prompt: string, style: string, colors: string[]) => void;
}

export function ImageForm({ isLoading, onSubmit }: IconFormProps) {
    const [prompt, setPrompt] = useState('Hockey equipment');
    const [style, setStyle] = useState(PRESET_STYLES[0]);
    const [colors, setColors] = useState<string[]>(['#8200db', '#e60076', '#6e11b0', '#193cb8']);
    const [openPickerIndex, setOpenPickerIndex] = useState<number | null>(null);

    const pickerRef = useRef<HTMLElement>(null);

    useClickOutside(pickerRef, () => {
        setOpenPickerIndex(null);
    });

    const handleAddColor = () => setColors([...colors, '#000000']);
    const handleRemoveColor = (indexToRemove: number) => setColors(colors.filter((_, index) => index !== indexToRemove));
    const handleColorChange = (newColor: string, indexToUpdate: number) => {
        setColors(colors.map((color, index) => (index === indexToUpdate ? newColor : color)));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(prompt, style, colors);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">Prompt for Icon Set</label>
                <input
                    id="prompt"
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="mt-1 p-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                    placeholder="e.g., Space exploration"
                />
            </div>

            <div>
                <label htmlFor="style" className="block text-sm font-medium text-gray-700">Preset Style</label>
                <select
                    id="style"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="mt-1 p-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                >
                    {PRESET_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Color palette</label>
                <div className="mt-2 space-y-3">
                    {colors.map((color, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setOpenPickerIndex(openPickerIndex === index ? null : index)}
                                    className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                                    style={{ backgroundColor: color }}
                                />
                                {openPickerIndex === index && (
                                    <div ref={pickerRef as React.RefObject<HTMLDivElement>} className="absolute top-full mt-2 z-10">
                                        <HexColorPicker color={color} onChange={(newColor) => handleColorChange(newColor, index)} />
                                    </div>
                                )}
                            </div>

                            <input
                                type="text"
                                value={color}
                                onChange={(e) => handleColorChange(e.target.value, index)}
                                className="flex-grow w-full p-1 bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />

                            <button type="button" onClick={() => handleRemoveColor(index)} className="p-2 text-gray-400 hover:text-red-500">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddColor} className="w-full flex items-center justify-center gap-2 text-sm text-indigo-600 hover:text-indigo-500 font-semibold py-2 rounded-md border-2 border-dashed border-gray-300 hover:border-indigo-500">
                        <Plus size={16} /> Add Color
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
                {isLoading ? <><Loader size={20} className="animate-spin" /> Generating...</> : <><Wand size={20} /> Generate Icons</>}
            </button>
        </form>
    );
}
