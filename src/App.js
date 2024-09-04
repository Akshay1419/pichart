import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const App = () => {
    const [data, setData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(products => {
                const aggregatedData = products.reduce((acc, product) => {
                    const existingCategory = acc.find(item => item.name === product.category);
                    if (existingCategory) {
                        existingCategory.value += product.price;
                    } else {
                        acc.push({
                            name: product.category,
                            value: product.price
                        });
                    }
                    return acc;
                }, []);

                setData(aggregatedData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const onPieEnter = ( index) => {
        setActiveIndex(index);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
            <div style={{ width: '50%' }}>
                <PieChart width={700} height={700}>
                    <Pie
                        activeIndex={activeIndex}
                        data={data}
                        dataKey="value"
                        outerRadius={250}
                        fill="green"
                        onMouseEnter={onPieEnter}
                        style={{ cursor: 'pointer', outline: 'none' }}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </div>
            <div style={{ width: '50%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((entry, index) => (
                            <tr key={index}>
                                <td style={{
                                    backgroundColor: COLORS[index % COLORS.length],
                                    color: 'white',
                                    border: '1px solid #ddd',
                                    padding: '8px'
                                }}>
                                    {entry.name}
                                </td>
                                <td style={{
                                    border: '1px solid #ddd',
                                    padding: '8px'
                                }}>
                                    {entry.value.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
