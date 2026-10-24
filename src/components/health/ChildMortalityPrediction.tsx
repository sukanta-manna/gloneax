/********************************************************************* 
Author: Sukanta Manna  
Purpose: Predict child mortality
**********************************************************************/
import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import PlotChildMortality from "./PlotChildMortality";

// Pre-defined country options mapping ISO codes to names
const AVAILABLE_COUNTRIES = [
    { code: 'AFG', name: 'Afghanistan' },
    { code: 'AGO', name: 'Angola' },
    { code: 'ALB', name: 'Albania'},
    { code: 'AND', name: 'Andorra'},
    { code: 'ARE', name: 'United Arab Emirates'},
    { code: 'ARG', name: 'Argentina'},
    { code: 'ARM', name: 'Armenia'},
    { code: 'ATG', name: 'Antigua and Barbuda'},
    { code: 'AUS', name: 'Australia'},
    { code: 'AUT', name: 'Austria'},
    { code: 'AZE', name: 'Azerbaijan'},
    { code: 'BDI', name: 'Burundi'},
    { code: 'BEL', name: 'Belgium'},
    { code: 'BEN', name: 'Benin'},
    { code: 'BFA', name: 'Burkina Faso'},
    { code: 'BGD', name: 'Bangladesh'},
];

// Available projection/tracking years
const AVAILABLE_YEARS = Array.from({ length: 5 }, (_, i) => 2027 + i);

export default function ChildMortalityPrediction() {
    const [selectedCountry, setSelectedCountry] = useState('AFG');
    const [selectedYear, setSelectedYear] = useState(2027);
    const [gdpUsd, setGdpUsd] = useState("");

    const [prediction, setPrediction] = useState<{ country: string; year: number; value: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [responseMsg, setResponseMsg] = useState('');

    const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(event.target.value);
    };

    const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(Number(event.target.value));
    };

    const handleGdpChange = (event: ChangeEvent<HTMLInputElement>) => {
        setGdpUsd(event.target.value);
    };

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setLoading(true);
        setPrediction(null);
        setResponseMsg('');

        const parsedGdp = parseFloat(gdpUsd);
        if (isNaN(parsedGdp) || parsedGdp <= 0) {
            setStatus('error');
            setResponseMsg('Please enter a valid positive GDP value in USD.');
            setLoading(false);
            return;
        }

        try {            
            const modelPath = `ml/Child_Mortality_Trained_JSON_Models/${selectedCountry}.json`;
            const scalerPath = `ml/Child_Mortality_Scalers_JSON/scaler_${selectedCountry}.json`;

            // Load model & scaler
            const model = await tf.loadLayersModel(modelPath);
            const scalerRes = await fetch(scalerPath);
            if (!scalerRes.ok) throw new Error(`Scaler file not found for ${selectedCountry}`);
            const s = await scalerRes.json();

            const raw = [selectedYear, s.features.data_min[1], parsedGdp];
            const x = raw.map((v, i) => v * s.features.scale[i] + s.features.min[i]);
            
            const inputTensor = tf.tensor3d([[x]]);
            const outputTensor = model.predict(inputTensor) as tf.Tensor;
            const yScaled = (await outputTensor.data())[0];
            const resultData = (yScaled - s.target.min[0]) / s.target.scale[0];

            // Cleanup tensors
            inputTensor.dispose();
            outputTensor.dispose();
            model.dispose();

            if (resultData > 0) {
                setPrediction({
                    country: selectedCountry,
                    year: selectedYear,
                    value: resultData
                });
                setStatus('success');
                setResponseMsg(`Prediction calculated: ${resultData.toFixed(1)} deaths per 1,000 live births.`);
            } else {
                throw new Error('Model produced an invalid negative output.');
            }
        } catch (err) {
            console.error('Inference error:', err);
            setStatus('error');
            setResponseMsg(
                `Failed to execute prediction for ${selectedCountry}. Please verify model/scaler asset files.`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Input Form Section */}
            <section className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Predict Child Mortality</h2>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            Predict child mortality for a country and target year using the ML inference model.
                        </p>
                    </div>

                    <form onSubmit={handlePredict} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Country Select */}
                            <div>
                                <label htmlFor="childMortality-country" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Country <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="childMortality-country"
                                    name="country"
                                    value={selectedCountry}
                                    onChange={handleCountryChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    required
                                >
                                    {AVAILABLE_COUNTRIES.map((option) => (
                                        <option key={option.code} value={option.code}>
                                            {option.name} ({option.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Year Select */}
                            <div>
                                <label htmlFor="childMortality-year" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Year <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="childMortality-year"
                                    name="year"
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    required
                                >
                                    {AVAILABLE_YEARS.map((yr) => (
                                        <option key={yr} value={yr}>
                                            {yr}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* GDP Input */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    GDP (USD) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="gdp"
                                    required
                                    value={gdpUsd}
                                    onChange={handleGdpChange}
                                    placeholder="e.g. 14500000000"
                                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Calculating...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" /> Predict
                                </>
                            )}
                        </button>

                        {status === 'success' && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>{responseMsg}</span>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{responseMsg}</span>
                            </div>
                        )}
                    </form>
                </div>
            </section>

            {/* Chart Section - Renders below the form after prediction */}
            {prediction && (
                <section className="w-full mb-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <PlotChildMortality
                        country={prediction.country}
                        prediction={{ year: prediction.year, value: prediction.value }}
                    />
                </section>
            )}
        </div>
    );
}