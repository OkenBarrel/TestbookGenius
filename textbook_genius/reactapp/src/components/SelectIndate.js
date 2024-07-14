import React from 'react';
import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';

const IndateSelect = ({ value, onChange }) => {
    const currentYear = new Date().getFullYear();
    const generateIndateOptions = () => {
        const years = [];
        for(let i = -24; i<=1; i++){
            const inYear = currentYear+i;
            years.push(inYear);
        }
        return years;
    };

    const IndateOptions = generateIndateOptions();
    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="indate-select">Program Start Year</InputLabel>
            <Select
                id="indate-select"
                value={value}
                onChange={onChange}
                label="Program Start"
            >
                {IndateOptions.map((year) => (
                    <MenuItem key={year} value={year}>
                        {year}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );  
};
export default IndateSelect;