import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [file, setFile] = useState(null);
    const [tableData, setTableData] = useState([]); // State to store table data

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('pdf', file);

        try {
            // Make POST request to the API
            const response = await axios.post('/api/upload', formData);

            // Set table data from the API response
            setTableData(response.data.transactions); 
            console.log('API Response:', response.data.transactions);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Upload PDF and Get Response from API</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="border p-2 mb-2"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Upload PDF
                </button>
            </form>

            {/* Display Table only if there is data */}
            {tableData.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-4 py-2">Date</th>
                                <th className="border px-4 py-2">Narration</th>
                                <th className="border px-4 py-2">Cheque/Ref No.</th>
                                <th className="border px-4 py-2">Value Date</th>
                                <th className="border px-4 py-2">Withdrawal Amount</th>
                                <th className="border px-4 py-2">Deposit Amount</th>
                                <th className="border px-4 py-2">Closing Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((transaction, index) => (
                                <tr key={index} className="bg-white even:bg-gray-100">
                                    <td className="border px-4 py-2">{transaction.date}</td>
                                    <td className="border px-4 py-2">{transaction.narration}</td>
                                    <td className="border px-4 py-2">{transaction.cheque_reference_number || ''}</td>
                                    <td className="border px-4 py-2">{transaction.value_dt || transaction.date}</td>
                                    <td className="border px-4 py-2" style={{textAlign:'center'}}>{transaction.withdrawal_amount || ''}</td>
                                    <td className="border px-4 py-2">{transaction.deposit_amount || ''}</td>
                                    <td className="border px-4 py-2">{transaction.closing_balance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;
