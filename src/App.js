import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import './App.css';
function App() {
    // El estado es estrictamente un número. Usamos NaN (que también es de tipo number) 
    // para representar el estado cuando el input está vacío, de esta forma cumplimos la regla estricta.
    const [celsius, setCelsius] = useState(0);
    const handleCelsiusChange = (e) => {
        // valueAsNumber devuelve NaN si el input está vacío o es inválido (ej: un signo menos suelto)
        const value = e.target.valueAsNumber;
        setCelsius(value);
        // Mostramos en consola según el requerimiento.
        // Tratamos a NaN como 0 para el cálculo, así "vacío" es igual a 0.
        const activeCelsius = isNaN(value) ? 0 : value;
        const fahrenheit = (activeCelsius * 9) / 5 + 32;
        console.log(`Celsius: ${activeCelsius}°C -> Fahrenheit: ${fahrenheit.toFixed(1)}°F`);
    };
    // Cálculo para mostrar en pantalla. 
    // Si el input está vacío (NaN), usamos 0 como base del cálculo para mostrar 32°F por defecto.
    const displayCelsius = isNaN(celsius) ? 0 : celsius;
    const fahrenheit = (displayCelsius * 9) / 5 + 32;
    return (_jsx("div", { className: "container", children: _jsxs("div", { className: "card", children: [_jsxs("h1", { className: "gold-text", children: [_jsx("svg", { className: "icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" }) }), "Conversor"] }), _jsxs("div", { className: "converter-wrapper", children: [_jsxs("div", { className: "input-section", children: [_jsx("label", { htmlFor: "celsius", children: "Grados Celsius (\u00B0C)" }), _jsx("input", { id: "celsius", type: "number", value: isNaN(celsius) ? '' : celsius, onChange: handleCelsiusChange, placeholder: "0", className: "gold-outline" })] }), _jsx("div", { className: "equals", children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" }), _jsx("polyline", { points: "12 5 19 12 12 19" })] }) }), _jsxs("div", { className: "result-section", children: [_jsx("label", { children: "Grados Fahrenheit (\u00B0F)" }), _jsxs("div", { className: "result-display gold-text", children: [fahrenheit.toFixed(1), "\u00B0F"] })] })] }), _jsxs("div", { className: "formula-box", children: [_jsx("p", { children: "F\u00F3rmula:" }), _jsxs("code", { children: ["(", displayCelsius, " \u00D7 9/5) + 32 = ", fahrenheit.toFixed(1)] })] })] }) }));
}
export default App;
//# sourceMappingURL=App.js.map