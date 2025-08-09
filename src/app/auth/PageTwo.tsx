import React from 'react';
import type { User } from '@/types/User.types';
import { MenuItem, TextField } from '@mui/material';
import {
  genderOptions,
  cityOptions,
  nationalityOptions,
  languageOptions,
} from '@/enums/UserAttributes';

type PageTwoProps = {
  formData: User;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PageTwo: React.FC<PageTwoProps> = ({ formData, handleChange }) => {
  return (
    <div className="flex w-[50%] flex-col gap-2">
      <TextField
        select
        label="Gender"
        name="gender"
        variant="outlined"
        required
        value={formData.gender}
        onChange={handleChange}
      >
        {genderOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Nationality"
        name="nationality"
        variant="outlined"
        value={formData.nationality}
        onChange={handleChange}
      >
        {nationalityOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="City"
        name="city"
        variant="outlined"
        value={formData.city}
        onChange={handleChange}
      >
        {cityOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        select
        label="Language"
        name="language"
        variant="outlined"
        value={formData.language}
        onChange={handleChange}
      >
        {languageOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default PageTwo;
