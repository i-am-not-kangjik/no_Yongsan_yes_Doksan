/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import { Button, Tooltip, OverlayTrigger, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import Loading from './loading';

function PhoneSelectionForm() {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedSeries, setSelectedSeries] = useState('');
    const [selectedCapacity, setSelectedCapacity] = useState('');

    const [productName, setproductName] = useState("")

    const [grade, setGrade] = useState('');

    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        setLoading(true)

        if (selectedModel.includes('노트')) {
            setproductName(selectedProduct + selectedSeries)
        } else {
            setproductName(selectedProduct + " " + selectedSeries)
        }

        // Create the payload object
        const payload = {
            product_name: productName,
            capacity: parseInt(selectedCapacity),
            quality: grade,
        };

        console.log("모델명: ", productName)
        console.log("용량: ", selectedCapacity)
        console.log("등급: ", grade)

        // Send the POST request
        fetch('http://3.37.220.88:8000/predict_price', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((data) => setResult(data))
            .catch((error) => console.error(error));
            console.log(result)
            setLoading(false)
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

    // 등급 표 호버
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div className='model_box'>
            {/* {loading ? null: <Loading /> } */}
            {/* <Loading /> */}
            {loading ? <Loading /> : null}
            <h2 style={{ marginBottom: '40px' }}>중고가 예측</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ display: '' }}>
                    <div>
                        <select className='model_input' value={selectedProduct} onChange={handleProductChange} required>
                            <option value="">제품 선택</option>
                            <option value="아이폰">아이폰</option>
                            <option value="갤럭시">갤럭시</option>
                        </select>
                    </div>

                    {/* 아이폰 */}
                    {selectedProduct === '아이폰' && (
                        <div>
                            <select className='model_input' value={selectedModel} onChange={handleModelChange} required>
                                <option value="">시리즈 선택</option>
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
                            <select className='model_input' value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">모델 선택</option>
                                <option value="11">11</option>
                                <option value="11 Pro">11 Pro</option>
                                <option value="11 Pro Max">11 Pro Max</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === '아이폰 12' && (
                        <div>
                            <select className='model_input' value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">모델 선택</option>
                                <option value="12">12</option>
                                <option value="12 Mini">12 Mini</option>
                                <option value="12 Pro">12 Pro</option>
                                <option value="12 Pro Max">12 Pro Max</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === '아이폰 13' && (
                        <div>
                            <select className='model_input' value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">모델 선택</option>
                                <option value="13">13</option>
                                <option value="13 Mini">13 Mini</option>
                                <option value="13 Pro">13 Pro</option>
                                <option value="13 Pro Max">13 Pro Max</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === '아이폰 14' && (
                        <div>
                            <select className='model_input' value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">모델 선택</option>
                                <option value="14">14</option>
                                <option value="14 Plus">14 Plus</option>
                                <option value="14 Pro">14 Pro</option>
                                <option value="14 Pro Max">14 Pro Max</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === '아이폰 SE' && (
                        <div>
                            <select className='model_input' value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">모델 선택</option>
                                <option value="2세대">2세대</option>
                                <option value="3세대">3세대</option>
                            </select>
                        </div>
                    )}


                    {/* 용량 */}
                    {selectedSeries === '11' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="64">64GB</option>
                                <option value="128">128GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '11 Pro' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="64">64GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '11 Pro Max' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="64">64GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '12' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="64">64GB</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '12 Mini' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="64">64GB</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '12 Pro' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '12 Pro Max' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '13' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '13 Mini' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '13 Pro' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                                <option value="1000">1TB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '13 Pro Max' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                                <option value="1000">1TB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '14' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '14 Plus' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '14 Pro' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                                <option value="1000">1TB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '14 Pro Max' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                                <option value="1000">1TB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '2세대' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="64">64GB</option>
                                <option value="128">128GB</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '3세대' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
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
                            <select className='model_input' value={selectedModel} onChange={handleModelChange} required>
                                <option value="">시리즈 선택</option>
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
                            <select className='model_input' value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">모델 선택</option>
                                <option value="Z 폴드 2">Z 폴드 2</option>
                                <option value="Z 폴드 3">Z 폴드 3</option>
                                <option value="Z 폴드 4">Z 폴드 4</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === '플립' && (
                        <div>
                            <select className='model_input' value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">모델 선택</option>
                                <option value="Z 플립 LTE">Z 플립 LTE</option>
                                <option value="Z 플립 5G">Z 플립 5G</option>
                                <option value="Z 플립 3">Z 플립 3</option>
                                <option value="Z 플립 4">Z 플립 4</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === 'S 20' && (
                        <div>
                            <select className='model_input' value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">모델 선택</option>
                                <option value="S 20">S 20</option>
                                <option value="S 20 플러스">S 20 플러스</option>
                                <option value="S 20 울트라">S 20 울트라</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === 'S 21' && (
                        <div>
                            <select className='model_input' value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">모델 선택</option>
                                <option value="S 21">S 21</option>
                                <option value="S 21 플러스">S 21 플러스</option>
                                <option value="S 21 울트라">S 21 울트라</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === 'S 22' && (
                        <div>
                            <select className='model_input' value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">모델 선택</option>
                                <option value="S 22">S 22</option>
                                <option value="S 22 플러스">S 22 플러스</option>
                                <option value="S 22 울트라">S 22 울트라</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === 'S 23' && (
                        <div>
                            <select className='model_input' value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">모델 선택</option>
                                <option value="S 23">S 23</option>
                                <option value="S 23 플러스">S 23 플러스</option>
                                <option value="S 23 울트라">S 23 울트라</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === '노트 10' && (
                        <div>
                            <select className='model_input' value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">모델 선택</option>
                                <option value="노트 10">노트 10</option>
                                <option value="노트 10 플러스">노트 10 플러스</option>
                            </select>
                        </div>
                    )}

                    {selectedModel === '노트 20' && (
                        <div>
                            <select className='model_input' value={selectedSeries} onChange={handleSeriesChange} required>
                                <option value="">모델 선택</option>
                                <option value="노트 20">노트 20</option>
                                <option value="노트 20 울트라">노트 20 플러스</option>
                            </select>
                        </div>
                    )}


                    {/* 용량 */}
                    {selectedSeries === 'Z 폴드 2' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'Z 폴드 3' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'Z 폴드 4' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                                <option value="1000">1TB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'Z 플립 LTE' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'Z 플립 5G' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'Z 플립 3' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'Z 플립 4' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 20' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="128">128GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 20 플러스' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 20 울트라' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 21' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 21 플러스' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 21 울트라' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 22' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 22 플러스' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 22 울트라' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                                <option value="1000">1TB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 23' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 23 플러스' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === 'S 23 울트라' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                                <option value="1000">1TB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '노트 10' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '노트 10 플러스' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                                <option value="512">512GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '노트 20' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}

                    {selectedSeries === '노트 20 울트라' && (
                        <div>
                            <select className='model_input' value={selectedCapacity} onChange={handleCapacityChange} required>
                                <option value="">용량 선택</option>
                                <option value="256">256GB</option>
                            </select>
                        </div>
                    )}
                </div>

                <div style={{ position: "relative", top: '50px', right: '-100px' }}>
                    <div style={{ display: 'flex' }}>
                        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop : '5px',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    // backgroundColor: 'red',
                                }}
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: '25px' }} />
                            </div>
                            {isHovered && (
                                <Table style={{ position: 'absolute', zIndex : '0', backgroundColor : 'white'}} striped>
                                    <thead>
                                        <tr>
                                            <th>등급</th>
                                            <th>외관</th>
                                            <th>기능</th>
                                            <th>배터리</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>S급</td>
                                            <td>사용감이 거의 없는 상태</td>
                                            <td>정상</td>
                                            <td>85% 이상</td>
                                        </tr>
                                        <tr>
                                            <td>A급</td>
                                            <td>미세한 스크래치 또는 약간 찍힘(1~3곳)</td>
                                            <td>정상</td>
                                            <td>85% 이상</td>
                                        </tr>
                                        <tr>
                                            <td>B급</td>
                                            <td>눈에 띄는 스크래치 또는 생활 찍힘(3곳 이상), 약잔상이 있을 수 있음</td>
                                            <td>정상</td>
                                            <td>80% 이상</td>
                                        </tr>
                                        <tr>
                                            <td>C급</td>
                                            <td>스크래치 또는 찍힘 다수, 약~중잔상이 있을 수 있음</td>
                                            <td>정상</td>
                                            <td>80% 이상</td>
                                        </tr>
                                        
                                    </tbody>
                                </Table>
                            )}
                        </div>
                        <div>
                            <select className='model_input' value={grade} onChange={handleGradeChange} required>
                                <option value="">등급 선택</option>
                                <option value="미개봉">미개봉</option>
                                <option value="S급">S급</option>
                                <option value="A급">A급</option>
                                <option value="B급">B급</option>
                                <option value="C급">C급</option>
                            </select>
                        </div>
                    </div>
                </div>
                <Button style={{ marginTop : '' }} type="submit" className='model_btn'>예측하기</Button>
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
