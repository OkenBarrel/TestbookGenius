import React from 'react';
import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';

const SchoolYearSelect = ({ value, onChange }) => {

    const currentYear = new Date().getFullYear();
    
    const generateSchoolYearOptions = () => {
        const years = [];
        for (let i = -10; i <= 0; i++) {
            const startYear = currentYear + i;
            const endYear = startYear + 1;
            years.push(`${startYear}-${endYear}`);
        }
        return years;
    };

    const schoolYearOptions = generateSchoolYearOptions();

    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="school-year-select">学年</InputLabel>
            <Select
                id="school-year-select"
                value={value}
                onChange={onChange}
                label="学年"
            >
                {schoolYearOptions.map((year) => (
                    <MenuItem key={year} value={year}>
                        {year}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SchoolYearSelect;
