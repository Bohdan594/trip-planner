import './CreateTripModal.scss'
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { searchCities } from '../../api/cities'
import { createTripThunk } from '../../store/trips/tripsSlice'
import { useCityAutocomplete } from '../../hooks/useCityAutocomplete';

type CreateTripModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

function CreateTripModal({isOpen, onClose}: CreateTripModalProps) {

    const addCity = (city : string) => {
        if (!city) return;
        if (cities.includes(city)) return;
        const cityNew = city.trim();
        setCities(prev => [...prev, cityNew]);
        visit.setInputCity('');
    }

    const dispatch = useAppDispatch();
    const createStatus = useAppSelector(state => state.trips.createStatus);
    const [isValidating, setIsValidating] = useState(false);
    const isLoading = isValidating || createStatus === "loading";
    // ================ Create new trip ================
    const [cities, setCities] = useState<string[]>([]);
    const [days, setDays] = useState<number | ''>('');
    const [people, setPeople] = useState<number | ''>('');
    const [budget, setBudget] = useState<number | ''>('');
    const [error, setError] = useState<string | null>(null);
    // ================ Search the cities to visit ================
    const departure = useCityAutocomplete(isOpen);
    const visit = useCityAutocomplete(isOpen, addCity);

    const resetForm = () => {
        departure.setInputCity('');
        visit.setInputCity('');
        setCities([]);
        setDays('');
        setPeople('');
        setBudget('');
        setError(null);
        departure.setErrorCities(null);
        departure.setCitySuggestions([]);
        departure.setIsCitySelected(false);
        visit.setErrorCities(null);
        visit.setCitySuggestions([]);
        departure.closeDropdown();
        visit.closeDropdown();
    };

    const getValidCityName = async (city: string) => {
        const data = await searchCities(city);

        const match = data.features.find(
        (feature: any) =>
            feature.properties.city?.toLowerCase() === city.toLowerCase()
        );

        return match?.properties.city ?? null;
    };

    const getValidCities = async (cities: string[]) => {
        const validCities: string[] = [];

        for (const city of cities) {
        const data = await searchCities(city);

        const match = data.features.find(
            (feature: any) =>
            feature.properties.city?.toLowerCase() === city.toLowerCase()
        );

        if (!match) {
            return null;
        }

        validCities.push(match.properties.city);
        }

        return validCities;
    };

    const handleDeleteCity = (cityToDelete: string) => {
        setCities(prev =>
            prev.filter(city => city !== cityToDelete)
        );
    };

    const showError = (message: string) => {
        setError( message );
        setTimeout(() => setError(null), 3000);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setError(null);
        e.preventDefault();
    
        if (
          !departure.inputCity ||
          cities.length === 0 ||
          days === '' ||
          people === '' ||
          budget === ''
        ) {
          showError("Please fill in all fields");
          return;
        }
    
        if (days <= 0) {
          showError("Days must be greater than 0");
          return;
        }
    
        if (people <= 0) {
          showError("The number of people must be greater than 0");
          return;
        }
    
        if (budget <= 0) {
          showError("Budget must be greater than 0");
          return;
        }
    
        setIsValidating(true);
    
        try {
          const validDeparture = await getValidCityName(departure.inputCity);
    
          if (!validDeparture) {
            showError("Departure city doesn't exist");
            return;
          }
    
          const validCities = await getValidCities(cities);
    
          if (!validCities) {
            showError("One or more cities don't exist");
            return;
          }
    
          if (validCities.includes(validDeparture)) {
            showError("Departure city can't be one of the cities to visit");
            return;
          }
    
          await dispatch(
            createTripThunk({
              departure_city: validDeparture,
              cities: validCities,
              days,
              people,
              budget,
            })
          ).unwrap();
    
          resetForm();
          onClose();
        } catch (err: unknown) {
          if (typeof err === 'string') {
            showError(err);
          } else {
            setError('Something went wrong');
          }
        } finally {
          setIsValidating(false);
        }
    };

    return (
        <>
            {error && (
                <div className="error-add-trip">
                    <div className='error'>
                        <p>{error}</p>
                    </div>
                </div>
            )}
            {
                isOpen &&
                <div className='modal-add-trip' onClick={() => {onClose(); resetForm()}}>
                    <form onSubmit={handleSubmit} className={`modal-main ${isLoading ? 'loading' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <div className='head'>
                        <p>Create new trip</p>

                        <button disabled={isLoading} type="button" onClick={() => {onClose(); resetForm()}} className='close'>
                        <img src="/close.png" alt="close" />
                        </button>
                    </div>

                    <div className='body'>
                        <div className='departure'>
                        <p className='label'>Departure city</p>
                        <div ref={departure.inputRef}>
                            <input
                            type="text"
                            placeholder="e.g. Warsaw"
                            disabled={isLoading}
                            value={departure.inputCity}
                            onKeyDown={departure.handleKeyDown}
                            onChange={(e) => departure.setInputCity(e.target.value)}
                            onClick={departure.handleInputClick}
                            />
                            {departure.isSearchingCities ? 
                            <div className="search-main">
                                <div className="search">
                                Searching...
                                </div>
                            </div>
                            : departure.errorCities ? (
                                <div className="search-main">
                                <div className="search">
                                    {departure.errorCities}
                                </div>
                                </div>
                            ) :
                            (departure.isDropdownOpen && departure.citySuggestions.length > 0 && (
                                <div className="city-suggestions">
                                {departure.citySuggestions.map((city, index) => (
                                    <div
                                    ref={(el) => {
                                        departure.cityRefs.current[index] = el;
                                    }}
                                    className={`city-option ${departure.selectedCityIndex === index ? 'city-sel' : ''}`}
                                    key={city}
                                    onClick={() => {
                                        departure.handleCitySelect(city)}}>
                                    {city}
                                    </div>
                                ))}
                                </div>
                            ))
                            }
                        </div>
                        </div>

                        <div className='cities'>
                        <p className='label'>Cities to visit</p>

                        {cities.length > 0 && <div className='cities-list'>
                            {cities.map(city => 
                            <div key={city} className='visit-city'>
                            <p>{city}</p>
                            <img src="/close.png" 
                            alt="delete"
                            onClick={() => handleDeleteCity(city)}/>
                            </div>)}
                        </div>}
                        
                        <div ref={visit.inputRef}>
                            <input
                            disabled={isLoading}
                            type="text"
                            onKeyDown={visit.handleKeyDown}
                            placeholder="Add city"
                            value={visit.inputCity}
                            onChange={(e) => visit.setInputCity(e.target.value)}
                            onClick={visit.handleInputClick}
                            />
                            
                            {visit.isSearchingCities ? 
                            <div className="search-main">
                                <div className="search">
                                Searching...
                                </div>
                            </div> : visit.errorCities ? (
                                <div className="search-main">
                                <div className="search">
                                    {visit.errorCities}
                                </div>
                                </div>
                            ) : (visit.isDropdownOpen && visit.citySuggestions.length > 0 && (
                                <div className="city-suggestions">
                                {visit.citySuggestions.map((city, index) => (
                                    <div
                                    ref={(el) => {
                                    visit.cityRefs.current[index] = el;
                                    }}
                                    onClick={() => visit.handleCitySelect(city)}
                                    key={city}
                                    className={`city-option ${visit.selectedCityIndex === index ? 'city-sel' : ''}`}>
                                    {city}
                                    </div>
                                ))}
                                </div>))
                            }
                            </div>
                        </div>

                        <div className='days-people'>
                        <div>
                            <p className='label'>Days</p>
                            <input
                            type="number"
                            min="1"
                            max={365}
                            placeholder="5"
                            disabled={isLoading}
                            value={days}
                            onChange={(e) => setDays(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <p className='label'>People</p>
                            <input
                            type="number"
                            min="1"
                            max={100}
                            placeholder="2"
                            disabled={isLoading}
                            value={people}
                            onChange={(e) => setPeople(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>
                        </div>

                        <div className='budget'>
                        <p className='label'>Budget (€)</p>
                        <input
                            type="number"
                            min="1"
                            max={100000000}
                            placeholder="2500"
                            disabled={isLoading}
                            value={budget}
                            onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                        </div>
                    </div>

                    <div className='footer'>
                        <button
                        type="button"
                        disabled={isLoading}
                        className='cancel'
                        onClick={() => {onClose(); resetForm()}}
                        >
                        Cancel
                        </button>

                        <button className={`create ${isLoading ? 'create-loading' : ''}`} type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create"}
                        </button>
                    </div>
                    </form>
                </div>
                }
        </>
    )
}

export default CreateTripModal