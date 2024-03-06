import './App.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';


function App() {

    const [inputFile, setInputFile] = useState(null);
    const [inputFileList, setInputFileList] = useState([]);
    const [selectedInputFile, setSelectedInputFile] = useState("");
    const [inputFileHeaders, setInputFileHeaders] = useState([]);
    const [selectedInputFileHeader, setSelectedInputFileHeader] = useState("");
    const [selectedInputFileDestHeader, setSelectedInputFileDestHeader] = useState("");
    const [inputFileValue, setInputFileValue] = useState("");
    const [inputFileValueList, setInputFileValueList] = useState([]);
    const [inputFinalResults, setInputFinalResults] = useState([]);
    const [inputSecondoryResults, setInputSecondoryResults] = useState([]);




    const [dbResults, setDbResults] = useState(null);
    const [dbResultsList, setDbResultsList] = useState([]);
    const [selectedDbResult, setSelectedDbResult] = useState("");
    const [dbResultsHeaders, setDbResultsHeaders] = useState([]);
    const [selectedDbResultHeader, setSelectedDbResultHeader] = useState("");
    const [selectedDbResultDestHeader, setSelectedDbResultDestHeader] = useState("");
    const [dbResultsValue, setDbResultsValue] = useState("");
    const [dbResultsValueList, setDbResultsValueList] = useState([]);
    const [dbFinalResults, setDbFinalResults] = useState([]);
    const [dbSecondoryResults, setDbSecondorResults] = useState([]);

    const [comparisonResult, setComparisonResult] = useState({});

    const [isInput, setIsInput] = useState(false);
    const [message, setMessage ] = useState(false);

    const handleInputFileChange = (e) => {
        setInputFile(e.target.files[0]);
    };

    const handleDbFileChange = (e: any) => {
        setDbResults(e.target.files[0]);
    };

    const handleInputFileSelection = (event) => {
        setSelectedInputFile(event.target.value);
        setSelectedInputFileHeader("");
        setInputFileValue("");
        setSelectedInputFileDestHeader("");
    };


    const handleDbResultSelection = (event) => {
        setSelectedDbResult(event.target.value);
        setSelectedDbResultHeader("");
        setDbResultsValue("");
        setSelectedDbResultDestHeader("");
    };

    const handleInputFileHeaderSelection = (event) => {
        setSelectedInputFileHeader(event.target.value);
        setIsInput(true);
    };

    const handleDbResultHeaderSelection = (event) => {
        setSelectedDbResultHeader(event.target.value);
        setIsInput(false);
    };
    const handleInputFileValueSelection = (event) => {
        setInputFileValue(event.target.value);
    };

    const handleDbResultValueSelection = (event) => {
        setDbResultsValue(event.target.value);
    };
    const handleSelectedDInputFileDestHeaderSelection = (event) => {
        setSelectedInputFileDestHeader(event.target.value);
        setIsInput(true);
    };



    const handleSelectedDbResultDestHeaderSelection = (event) => {
        setSelectedDbResultDestHeader(event.target.value);
        setIsInput(false);
    };


    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('inputFile', inputFile);
        formData.append('dbResults', dbResults);

        try {
            await axios.post('http://localhost:8080/automation/uploadFiles', formData);
            setMessage('File uploaded successfully!');
            setComparisonResult({});
        } catch (error) {
            setMessage('Error uploading file: ' + error.message);
        }
    };

    const fetchFileLists = async () => {


        try {
            await axios.get('http://localhost:8080/automation/getAllFiles').then((res) => {

                setInputFileList(res.data.inputFiles);
                setDbResultsList(res.data.dbResults);
                setComparisonResult({});
            });

        } catch (error) {
            setMessage('Error retrieving files: ' + error.message);
        }
    };

    const fetchHeaders = async () => {

        if (selectedDbResult || selectedInputFile) {
            try {
                await axios.get('http://localhost:8080/automation/getHeaders?inputFile=' + selectedInputFile + '&dbResults=' + selectedDbResult).then((res) => {

                    setMessage(res);
                    setInputFileHeaders(res.data.inputFileHeaders);
                    setDbResultsHeaders(res.data.dbResultHeaders)
                    setComparisonResult({});

                });

            } catch (error) {
                setMessage('Error retrieving headers: ' + error.message);
            }
        }

    }

    const compare = async () => {


        try {
            await axios.get('http://localhost:8080/automation/compare?inputResults=' + inputFinalResults + '&dbResults=' + dbFinalResults+
                "&inputSeconderyResults="+inputSecondoryResults+"&dbSeconderyResults="+dbSecondoryResults
            ).then((res) => {

                setMessage(res.data);
                setComparisonResult(res.data)

            });

        } catch (error) {
            setMessage('Error retrieving headers: ' + error.message);
        }


    }
    const fetchFileDetails = async () => {
        let url = ""
        if (isInput) {
            url = 'http://localhost:8080/automation/getAvialbleValues?inputFile=' + selectedInputFile + '&header=' + selectedInputFileHeader + '&isInput=' + isInput;
        } else {
            url = 'http://localhost:8080/automation/getAvialbleValues?inputFile=' + selectedDbResult + '&header=' + selectedDbResultHeader + '&isInput=' + isInput
        }

        try {
            await axios.get(url
            ).then((res) => {

                setMessage(res);
                setComparisonResult({});
                if (isInput) {
                    setInputFileValueList(res.data);
                    setSelectedInputFileDestHeader("");
                } else {
                    setDbResultsValueList(res.data);
                    setSelectedDbResultDestHeader("");
                }



            });

        } catch (error) {
            setMessage('Error retrieving values: ' + error.message);
        }


    }
    const fetchResults = async () => {
        let url = ""
        if (isInput) {
            url = 'http://localhost:8080/automation/getResults?inputFile=' + selectedInputFile + '&srcHeader=' + selectedInputFileHeader + '&isInput=' + isInput + '&value=' + inputFileValue + '&destHeader=' + selectedInputFileDestHeader;
        } else {
            url = 'http://localhost:8080/automation/getResults?inputFile=' + selectedDbResult + '&srcHeader=' + selectedDbResultHeader + '&isInput=' + isInput + '&value=' + dbResultsValue + '&destHeader=' + selectedDbResultDestHeader;
        }
       if(selectedInputFileDestHeader || selectedDbResultDestHeader) {
           try {
               await axios.get(url
               ).then((res) => {
                   if (isInput) {
                       if(inputFinalResults.length >0){
                           setInputSecondoryResults(res.data)
                       }else{
                           setInputFinalResults(res.data);
                       }

                   } else {
                       if(dbFinalResults.length >0){
                           setDbSecondorResults(res.data);
                       }else{
                           setDbFinalResults(res.data);
                       }

                   }
                   setMessage(res);
                   setComparisonResult({});


               });

           } catch (error) {
               setMessage('Error retrieving values: ' + error.message);
           }
       }


    }
    useEffect(() => {
        fetchFileLists().then((res) => console.log(res));
    }, []);

    useEffect(() => {
        fetchHeaders().then((res) => console.log(res));
    }, [selectedDbResult, selectedInputFile  ]);
    useEffect(() => {
        fetchFileDetails().then((res) => console.log(res));
    }, [selectedDbResultHeader, selectedInputFileHeader]);
    useEffect(() => {
        fetchResults().then((res) => console.log(res));
    }, [selectedDbResultDestHeader,  selectedInputFileDestHeader  ]);


    return (
        <div className="App">
            <h1>AAA Automation</h1>
            <div className={"uploadDiv"}>
                <form onSubmit={handleUpload}>
                    Please select input file : <input type="file" onChange={handleInputFileChange}/>
                    Please select db results : <input type="file" onChange={handleDbFileChange}/>
                    <button className="button" type="submit">Upload</button>
                </form>
            </div>
            <div className={"input-div"}>

            <div  >
                Please select the input file :
                <select className="select-box" value={selectedInputFile} onChange={handleInputFileSelection}>
                    <option value="">Select an option</option>
                    {inputFileList.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <br/>

                <br/>
                Please select the required node :
                <select className="select-box" value={selectedInputFileHeader} onChange={handleInputFileHeaderSelection}>
                    <option value="">Select an option</option>
                    {inputFileHeaders.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <br/>
                <br/>
                Please select required value:
                <select className="select-box" value={inputFileValue} onChange={handleInputFileValueSelection}>
                    <option value="">Select an option</option>
                    {inputFileValueList.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <br/>
                <br/>
                Please select the required destination node :
                <select className="select-box" value={selectedInputFileDestHeader} onChange={handleSelectedDInputFileDestHeaderSelection}>
                    <option value="">Select an option</option>
                    {inputFileHeaders.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <br/><br/><br/>
            </div>



                { comparisonResult.onlyInInputResults ?
                    <div style={{ height: '600px', overflow: 'auto' }}>

                        {comparisonResult.inInputPrimaryList.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                        ----------------------------------
                        {comparisonResult.inInputSecondaryList.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </div>
                :<div style={{ height: '600px', overflow: 'auto' }}>

                    {inputFinalResults.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                        {inputSecondoryResults.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                </div>
                }
            </div>

            <button className="compare-btn button" onClick={compare} type="submit">Compare</button>
            <div className="vertical-line"></div>
            <div className={"db-div"}>
                Please select the db results :
                <select className="select-box" value={selectedDbResult} onChange={handleDbResultSelection}>
                    <option value="">Select an option</option>
                    {dbResultsList.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <br/><br/>
                Please select the required node :
                <select className="select-box" value={selectedDbResultHeader} onChange={handleDbResultHeaderSelection}>
                    <option value="">Select an option</option>
                    {dbResultsHeaders.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <br/><br/>
                Please select required value:
                <select className="select-box" value={dbResultsValue} onChange={handleDbResultValueSelection}>
                    <option value="">Select an option</option>
                    {dbResultsValueList.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <br/><br/>
                Please select the required destination node :
                <select className="select-box" value={selectedDbResultDestHeader} onChange={handleSelectedDbResultDestHeaderSelection}>
                    <option value="">Select an option</option>
                    {dbResultsHeaders.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <br/><br/><br/>
                { comparisonResult.onlyInDbResults ?
                    <div style={{ height: '600px', overflow: 'auto' }}>

                        {comparisonResult.onlyInDbResults.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </div>
                    :<div style={{ height: '600px', overflow: 'auto' }}>

                        {dbFinalResults.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                        {dbSecondoryResults.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </div>
                }
            </div>


        </div>

    );
}

export default App;
