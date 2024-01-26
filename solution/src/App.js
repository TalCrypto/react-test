import './App.css';
import {useState, useEffect, useRef} from "react";
import {getLocations, isNameValid} from "./mock-api/apis";

function App() {
  const requestRef = useRef(0);
  const [name, setName] = useState("");
  const [country, setCountry] = useState(null);

  const [countryOptions, setCountryOptions] = useState([]);

  const [error, setError] = useState(null);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countries = await getLocations();
        setCountryOptions(countries);

        // set default value of country
        setCountry(countries[0]);

      } catch(e) {
        console.error(e);
      }
    }
    // fetch countries once component has been rendered
    fetchCountries();
  }, []);

  const validateName = (name) => {
    const currentRequest = ++requestRef.current;

    isNameValid(name).then((res) => {
        // Only update the state if this is the latest request
        if (currentRequest === requestRef.current) {
            setError(res ? null : "This name is invalid");
        }
    }).catch(e =>{
      console.error(e);
    });
  };
 

  const handleChangeName = (e) => {
    setName(e.target.value);
    validateName(e.target.value);
  }

  const handleChangeCountry = (e) => {
    setCountry(e.target.value);
  }

  const handleClearInputs = () => {
    setName("");
    setCountry(countryOptions[0]);
    setError(null);
    requestRef.current = 0;
  }

  const handleAdd = () => {
    setTableData([...tableData, {name, country}]);
    handleClearInputs();
  }

  return (
    <div className="App">
      <div className='flex my-16'>
        <div className='input-label'>Name</div>
        <div className='flex-1'>
          <input className='input' value={name} onChange={handleChangeName} />
          {!!error && <div className='error-message'>{error}</div>}
        </div>
      </div>
      <div className='flex my-16'>
        <div className='input-label'>Country</div>
        <div className='flex-1'>
          <select className='input' value={country} onChange={handleChangeCountry}>
            {countryOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <div className='flex flex-right my-16'>
        <button onClick={handleClearInputs}>Clear</button>
        <button onClick={handleAdd} disabled={!!error || name === ""}>Add</button>
      </div>
      <table className='my-16'>
        <thead>
          <tr>
            <td>Name</td>
            <td>Country</td>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, i) => (
            <tr key={i} className={i % 2 ? 'tr-dark' : 'tr-light'}>
              <td>{item.name}</td>
              <td>{item.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
