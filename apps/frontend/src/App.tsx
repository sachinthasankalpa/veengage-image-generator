import { ImageGenerator } from './components/ImageGenerator';


function App() {
    return (
        <main className="min-h-screen bg-gray-100 text-gray-800">
            <div className="container mx-auto px-4 py-8">
                <header className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        <span className="text-purple-700">Venngage </span>
                        <span className="bg-gradient-to-r from-pink-600 to-purple-800 text-transparent bg-clip-text">Icon </span>
                        <span className="text-blue-800">Generator</span>
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Create a set of 8 icons in a consistent style from a single prompt.
                    </p>
                </header>
                <ImageGenerator />
            </div>
        </main>
    );
}
export default App;

