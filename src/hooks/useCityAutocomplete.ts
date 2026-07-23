import { useState, useRef, useEffect } from "react";
import { searchCities } from "../api/cities";

export function useCityAutocomplete(
    isOpen: boolean,
    onSelect?: (city: string) => void
) {
    const [inputCity, setInputCity] = useState<string>('');
    const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isSearchingCities, setIsSearchingCities] = useState<boolean>(false);
    const [isCitySelected, setIsCitySelected] = useState<boolean>(false);
    const [errorCities, setErrorCities] = useState<string | null>(null);
    const [selectedCityIndex, setSelectedCityIndex] = useState<number>(-1);
    const inputRef = useRef<HTMLDivElement>(null);
    const cityRefs = useRef<(HTMLDivElement | null)[]>([]);

    const closeDropdown = () => {
        setIsDropdownOpen(false);
        setSelectedCityIndex(-1);
    };

    const handleCitySelect = (city: string) => {
        if (onSelect) {
            onSelect(city);
            closeDropdown();
            return;
        }

        setIsCitySelected(true);
        setInputCity(city);
        closeDropdown();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (citySuggestions.length === 0) {
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                if(selectedCityIndex === citySuggestions.length - 1){
                    setSelectedCityIndex(0);
                    break;
                }
                setSelectedCityIndex(selectedCityIndex + 1);
                break;

            case "ArrowUp":
                e.preventDefault();
                if(selectedCityIndex <= 0){
                    setSelectedCityIndex(citySuggestions.length - 1);
                    break;
                }
                setSelectedCityIndex(selectedCityIndex - 1);
                break;

            case "Enter":
                e.preventDefault();
                if (selectedCityIndex >= 0) {
                    const city = citySuggestions[selectedCityIndex];
                    handleCitySelect(city);
                }
                break;

            case "Escape":
                e.preventDefault();
                closeDropdown();
                break;
        }
    };

    useEffect(() => {
            setErrorCities(null);
    
            if(isCitySelected){
                setIsCitySelected(false);
                return
            }
    
            if (!inputCity.trim()) {
                setCitySuggestions([]);
                setIsDropdownOpen(false);
                return;
            }
    
            if(inputCity.trim().length < 3){
                setCitySuggestions([]);
                setIsSearchingCities(false);
                setIsDropdownOpen(false);
                return
            }
    
            const timeout = setTimeout(() => {
            setIsSearchingCities(true);
    
            searchCities(inputCity)
                .then((data) => {
                const cities = data.features
                    .map((feature: any) => feature.properties.city)
                    .filter(Boolean)
                    .filter(
                    (city: string, index: number, array: string[]) =>
                        array.indexOf(city) === index
                    );
    
                setCitySuggestions(cities);
                setIsDropdownOpen(true);
                })
                .catch((err: unknown) => {
                if (err instanceof Error) {
                    setErrorCities(err.message);
                } else {
                    setErrorCities('Failed to fetch cities');
                }
                })
                .finally(() => {
                    setIsSearchingCities(false);
                });
            }, 300);
    
            return () => clearTimeout(timeout);
        }, [inputCity]);

        useEffect(() => {
        if (!isOpen || !isDropdownOpen) return;
        
        const handleClickOutside = (event: MouseEvent) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                closeDropdown();
            }
            };

            document.addEventListener('mousedown', handleClickOutside);

            return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            };
    }, [isOpen, isDropdownOpen]);

    useEffect(() => {
        cityRefs.current[selectedCityIndex]?.scrollIntoView({
            block: "nearest",
        });
    }, [selectedCityIndex]);

    const handleInputClick = () => {
        if (inputCity && citySuggestions.length > 0) {
            setIsDropdownOpen(true);
        }
    };

    return {
        inputCity,
        setInputCity,

        citySuggestions,
        setCitySuggestions,

        isDropdownOpen,
        setIsDropdownOpen,

        isSearchingCities,
        setIsSearchingCities,

        isCitySelected,
        setIsCitySelected,

        errorCities,
        setErrorCities,

        selectedCityIndex,
        setSelectedCityIndex,

        inputRef,
        cityRefs,

        closeDropdown,
        handleCitySelect,
        handleKeyDown,
        handleInputClick
    };
}