import React, { useState, useCallback, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FileUpload } from './components/FileUpload';
import { QuizDisplay } from './components/QuizDisplay';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { generateQuizFromFile } from './services/geminiService';
import type { QuizData } from './types';

const SparklesIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.423-1.423L13.5 18.75l1.188-.648a2.25 2.25 0 011.423-1.423L16.25 15l.648 1.188a2.25 2.25 0 011.423 1.423L19.5 18.75l-1.188.648a2.25 2.25 0 01-1.423 1.423z" />
    </svg>
);

const GenerateIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.423-1.423L13.5 18.75l1.188-.648a2.25 2.25 0 011.423-1.423L16.25 15l.648 1.188a2.25 2.25 0 011.423 1.423L19.5 18.75l-1.188.648a2.25 2.25 0 01-1.423 1.423z" />
    </svg>
);

const StartOverIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0M2.985 19.644A8.25 8.25 0 0116.023 9.348" />
    </svg>
);

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mcqCount, setMcqCount] = useState<number>(5);
  const [trueFalseCount, setTrueFalseCount] = useState<number>(5);
  const quizContentRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setQuizData(null);
    setError(null);
  };

  const handleGenerateQuiz = useCallback(async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    
    if (mcqCount < 1 && trueFalseCount < 1) {
        setError('Please request at least one question.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setQuizData(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const base64String = (reader.result as string).split(',')[1];
          const data = await generateQuizFromFile(base64String, file.type, mcqCount, trueFalseCount);
          setQuizData(data);
        } catch (err) {
          console.error(err);
          setError(err instanceof Error ? err.message : 'An unknown error occurred during quiz generation.');
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
        setIsLoading(false);
      };
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setIsLoading(false);
    }
  }, [file, mcqCount, trueFalseCount]);

  const handleStartOver = () => {
    setFile(null);
    setQuizData(null);
    setError(null);
    setIsLoading(false);
  };

  const handleDownloadPdf = useCallback(async () => {
    const input = quizContentRef.current;
    if (!input) {
      setError("Could not find the quiz content to download.");
      return;
    }

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: input.scrollWidth,
        height: input.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth - 20;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20);

      while (heightLeft > 0) {
        position -= (pdfHeight - 20);
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);
      }
      
      pdf.save('ai-generated-quiz.pdf');
    } catch (e) {
      console.error("Error generating PDF:", e);
      setError("Sorry, there was an issue creating the PDF file.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-10">
            <div className="flex justify-center items-center gap-3">
                 <SparklesIcon />
                 <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">AI Quiz Generator</h1>
            </div>
            <p className="text-gray-600 mt-3 text-lg">For modern educators. Upload a document and instantly generate a quiz.</p>
        </header>

        <main className="bg-white rounded-2xl shadow-2xl border border-gray-200/80 p-8 sm:p-12">
          {!quizData && !isLoading && (
            <div className="animate-fade-in space-y-10">
              <div className="space-y-4">
                  <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                      <h2 className="ml-4 text-xl font-semibold text-gray-800">Configure Questions</h2>
                  </div>
                  <div className="pl-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                          <label htmlFor="mcq-count" className="block text-sm font-medium text-gray-700 mb-2">Number of MCQs</label>
                          <input
                              type="number"
                              id="mcq-count"
                              value={mcqCount}
                              onChange={(e) => setMcqCount(Math.max(0, parseInt(e.target.value, 10)))}
                              className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                              min="0"
                              aria-label="Number of multiple choice questions"
                          />
                      </div>
                      <div>
                          <label htmlFor="tf-count" className="block text-sm font-medium text-gray-700 mb-2">Number of True/False</label>
                          <input
                              type="number"
                              id="tf-count"
                              value={trueFalseCount}
                              onChange={(e) => setTrueFalseCount(Math.max(0, parseInt(e.target.value, 10)))}
                              className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                              min="0"
                              aria-label="Number of true or false questions"
                          />
                      </div>
                  </div>
              </div>
               <div className="space-y-4">
                  <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                      <h2 className="ml-4 text-xl font-semibold text-gray-800">Upload Document</h2>
                  </div>
                  <div className="pl-12">
                     <FileUpload onFileSelect={handleFileSelect} file={file} />
                  </div>
              </div>
            </div>
          )}

          {error && <ErrorMessage message={error} />}

          {isLoading && <Loader />}

          {quizData && (
            <div ref={quizContentRef} className="animate-fade-in">
              <QuizDisplay quizData={quizData} />
            </div>
          )}

          <div className="mt-10 flex justify-center">
            {!isLoading && !quizData && (
              <button
                onClick={handleGenerateQuiz}
                disabled={!file || (mcqCount < 1 && trueFalseCount < 1)}
                className="flex items-center justify-center w-full max-w-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 hover:ring-4 hover:ring-indigo-500/30"
              >
                <GenerateIcon />
                Generate Quiz
              </button>
            )}
            {(quizData || error) && !isLoading && (
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleStartOver}
                  className="flex items-center justify-center w-full sm:w-auto bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <StartOverIcon />
                  Start Over
                </button>
                 {quizData && (
                     <button
                        onClick={handleDownloadPdf}
                        className="flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                          <DownloadIcon />
                          Download PDF
                      </button>
                 )}
              </div>
            )}
          </div>
        </main>

        <footer className="text-center mt-12 text-gray-500">
          <p>Powered by Gemini AI</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
