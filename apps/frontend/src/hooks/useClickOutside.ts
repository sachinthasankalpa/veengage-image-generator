import { useEffect } from 'react';

/**
 * A custom hook that triggers a handler if a click is detected outside the referenced element.
 * @param ref React RefObject of the target element
 * @param handler Function to trigger on outside click
 */
const useClickOutside = (
    ref: React.RefObject<HTMLElement | null>, // Handle nullable ref
    handler: () => void
) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

export default useClickOutside;