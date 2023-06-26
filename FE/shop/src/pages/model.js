/*eslint-disable*/
import React, { useState } from 'react';

function PhoneSelectionForm() {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedSeries, setSelectedSeries] = useState('');
    const [selectedCapacity, setSelectedCapacity] = useState('');
    const [grade, setGrade] = useState('');

    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedModel.includes('노트')) {
            const product_name = selectedProduct + selectedSeries
        } else {
            const product_name = selectedProduct + " " + selectedSeries
        }

        console.log(product_name)
        console.log(selectedCapacity)
        console.log(grade)

        try {
            const response = await axios.post('http://3.37.220.88:8000/predict_price', {
                product_name: selectedProduct + selectedSeries,
                capacity: selectedCapacity,
                quality: grade,
            });
            setResult(response.data);
            alert("성공")
        } catch (error) {
            console.error(error);
        }
    };


    const a = (e) => {
        if (selectedModel.includes('노트')) {
            console.log(selectedProduct + selectedSeries)
        } else {
            console.log(selectedProduct + " " + selectedSeries)
        }
        console.log(selectedCapacity)
    };

    const handleGradeChange = (e) => {
        setGrade(e.target.value);
    };

    const handleProductChange = (e) => {
        setSelectedProduct(e.target.value);
        setSelectedModel('');
        setSelectedSeries('');
        setSelectedCapacity('');
    };

    const handleModelChange = (e) => {
        setSelectedModel(e.target.value);
        setSelectedSeries('');
        setSelectedCapacity('');
    };

    const handleSeriesChange = (e) => {
        setSelectedSeries(e.target.value);
        setSelectedCapacity('');
    };

    const handleCapacityChange = (e) => {
        setSelectedCapacity(e.target.value);
    };

    return (
        <div className='model_box'>
            <form>
                <div style={{ display: 'flex' }}>
                    <div>
                        <label>제품 선택:</label>
                        <select value={selectedProduct} onChange={handleProductChange} required>
                            <option value="">선택하세요</option>
                            <option value="아이폰">아이폰</option>
                            <option value="갤럭시">갤럭시</option>
                        </select>
                    </div>

                    {/* 아이폰 */}
                    {selectedProduct === '아이폰' && (
                        <div>
                            <label>모델 선택:</label>
                            <select value={selectedModel} onChange={handleModelChange} required>
                                <option value="">선택하세요</option>
                                <option value="아이폰 11">아이폰 11</option>
                                <option value="아이폰 12">아이폰 12</option>
                                <option value="아이폰 13">아이폰 13</option>
                                <option value="아이폰 14">아이폰 14</option>
                                <option value="아이폰 SE">아이폰 SE</option>
                            </select>
                        </div>
                    )}


                    {/* 모델 */}
                    {selectedModel === '아이폰 11' && (
                        <div>
                            <label>모델 선택:</label>
                            <select value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">선택하세요</option>
                                <option value="11">11</option>
                                <option value="11 Pro">11 Pro</option>
                                <option value="11 Pro Max">11 Pro Max</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === '아이폰 12' && (
                        <div>
                            <label>모델 선택:</label>
                            <select value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">선택하세요</option>
                                <option value="12">12</option>
                                <option value="12 Mini">12 Mini</option>
                                <option value="12 Pro">12 Pro</option>
                                <option value="12 Pro Max">12 Pro Max</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === '아이폰 13' && (
                        <div>
                            <label>모델 선택:</label>
                            <select value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">선택하세요</option>
                                <option value="13">13</option>
                                <option value="13 Mini">13 Mini</option>
                                <option value="13 Pro">13 Pro</option>
                                <option value="13 Pro Max">13 Pro Max</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === '아이폰 14' && (
                        <div>
                            <label>모델 선택:</label>
                            <select value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">선택하세요</option>
                                <option value="14">14</option>
                                <option value="14 Plus">14 Plus</option>
                                <option value="14 Pro">14 Pro</option>
                                <option value="14 Pro Max">14 Pro Max</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === '아이폰 SE' && (
                        <div>
                            <label>모델 선택:</label>
                            <select value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">선택하세요</option>
                                <option value="2세대">2세대</option>
                                <option value="3세대">3세대</option>
                            </select>
                        </div>
                    )}


                    {/* 용량 */}
                    {selectedSeries === '11' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="64">64GB</option>
                                <option value="128">128GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '11 Pro' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="64">64GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '11 Pro Max' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="64">64GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '12' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="64">64GB</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '12 Mini' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="64">64GB</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '12 Pro' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '12 Pro Max' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '13' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '13 Mini' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '13 Pro' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                                <option value="1000">1TB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '13 Pro Max' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                                <option value="1000">1TB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '14' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '14 Plus' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '14 Pro' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                                <option value="1000">1TB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '14 Pro Max' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                                <option value="1000">1TB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '2세대' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="64">64GB</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '3세대' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="64">64GB</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}


                    {/* 갤럭시 */}
                    {selectedProduct === '갤럭시' && (
                        <div>
                            <label>모델 선택:</label>
                            <select value={selectedModel} onChange={handleModelChange} required>
                                <option value="">선택하세요</option>
                                <option value="폴드">폴드</option>
                                <option value="플립">플립</option>
                                <option value="S 20">S 20</option>
                                <option value="S 21">S 21</option>
                                <option value="S 22">S 22</option>
                                <option value="S 23">S 23</option>
                                <option value="노트 10">노트 10</option>
                                <option value="노트 20">노트 20</option>
                            </select>
                        </div>
                    )}


                    {/* 모델 */}
                    {selectedModel === '폴드' && (
                        <div>
                            <label>모델 선택:</label>
                            <select value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">선택하세요</option>
                                <option value="Z 폴드 2">Z 폴드 2</option>
                                <option value="Z 폴드 3">Z 폴드 3</option>
                                <option value="Z 폴드 4">Z 폴드 4</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === '플립' && (
                        <div>
                            <label>모델 선택:</label>
                            <select value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">선택하세요</option>
                                <option value="Z 플립 LTE">Z 플립 LTE</option>
                                <option value="Z 플립 5G">Z 플립 5G</option>
                                <option value="Z 플립 3">Z 플립 3</option>
                                <option value="Z 플립 4">Z 플립 4</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === 'S 20' && (
                        <div>
                            <label>모델 선택:</label>
                            <select value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">선택하세요</option>
                                <option value="S 20">S 20</option>
                                <option value="S 20 플러스">S 20 플러스</option>
                                <option value="S 20 울트라">S 20 울트라</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === 'S 21' && (
                        <div>
                            <label>모델 선택:</label>
                            <select value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">선택하세요</option>
                                <option value="S 21">S 21</option>
                                <option value="S 21 플러스">S 21 플러스</option>
                                <option value="S 21 울트라">S 21 울트라</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === 'S 22' && (
                        <div>
                            <label>모델 선택:</label>
                            <select value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">선택하세요</option>
                                <option value="S 22">S 22</option>
                                <option value="S 22 플러스">S 22 플러스</option>
                                <option value="S 22 울트라">S 22 울트라</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === 'S 23' && (
                        <div>
                            <label>모델 선택:</label>
                            <select value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">선택하세요</option>
                                <option value="S 23">S 23</option>
                                <option value="S 23 플러스">S 23 플러스</option>
                                <option value="S 23 울트라">S 23 울트라</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === '노트 10' && (
                        <div>
                            <label>모델 선택:</label>
                            <select value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">선택하세요</option>
                                <option value="노트 10">노트 10</option>
                                <option value="노트 10 플러스">노트 10 플러스</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === '노트 20' && (
                        <div>
                            <label>모델 선택:</label>
                            <select value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">선택하세요</option>
                                <option value="노트 20">노트 20</option>
                                <option value="노트 20 울트라">노트 20 플러스</option>
                            </select>
                        </div>
                    )}


                    {/* 용량 */}
                    {selectedSeries === 'Z 폴드 2' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'Z 폴드 3' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'Z 폴드 4' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                                <option value="1000">1TB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'Z 플립 LTE' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'Z 플립 5G' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'Z 플립 3' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'Z 플립 4' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 20' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="128">128GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 20 플러스' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 20 울트라' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 21' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 21 플러스' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 21 울트라' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 22' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 22 플러스' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 22 울트라' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                                <option value="1000">1TB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 23' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 23 플러스' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 23 울트라' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                                <option value="1000">1TB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '노트 10' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '노트 10 플러스' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '노트 20' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '노트 20 울트라' && (
                        <div>
                            <label>용량 선택:</label>
                            <select value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">선택하세요</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}
                </div>

                <div>
                    <label>등급 선택:</label>
                    <select value={grade} onChange={handleGradeChange} required>
                        <option value="">선택하세요</option>
                        <option value="미개봉">미개봉</option>
                        <option value="S급">S급</option>
                        <option value="A급">A급</option>
                        <option value="B급">B급</option>
                        <option value="C급">C급</option>
                    </select>
                </div>

                <p onClick={a}>확인</p>
                <button type="submit">예측하기</button>
            </form>
            {result && (
                <div>
                    <h3>Result:</h3>
                    <p>Price: {result.price}</p>
                    <p>Confidence: {result.confidence}</p>
                </div>
            )}
        </div>
    );
}

export default PhoneSelectionForm;
