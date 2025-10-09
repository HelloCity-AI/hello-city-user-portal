import React from 'react';
import type { User } from '@/types/User.types';
import { MenuItem, TextField } from '@mui/material';
import {
  genderOptions,
  cityOptions,
  nationalityOptions,
  languageOptions,
} from '@/enums/UserAttributes';

type PersonalInfoProps = {
  userInfo: User;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PersonalInfo: React.FC<PersonalInfoProps> = ({ userInfo, handleChange }) => {
  return (
    <div className="flex w-full flex-col gap-3 px-2 sm:gap-4">
      <TextField
        fullWidth
        select
        label="Gender"
        name="gender"
        variant="outlined"
        required
        value={userInfo.gender}
        onChange={handleChange}
        size="small"
      >
        {genderOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        select
        label="Nationality"
        name="nationality"
        variant="outlined"
        value={userInfo.nationality}
        onChange={handleChange}
        size="small"
      >
        {nationalityOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        select
        label="City"
        name="city"
        variant="outlined"
        value={userInfo.city}
        onChange={handleChange}
        size="small"
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
        name="preferredLanguage"
        variant="outlined"
        value={userInfo.preferredLanguage}
        onChange={handleChange}
        size="small"
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

export default PersonalInfo;
