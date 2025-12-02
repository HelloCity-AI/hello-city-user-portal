import React from 'react';
import type { User } from '@/types/User.types';
import { MenuItem, TextField } from '@mui/material';
import {
  genderOptions,
  cityOptions,
  nationalityOptions,
  languageOptions,
  Genders,
  Nationalities,
  Cities,
  Languages,
} from '@/enums/UserAttributes';
import { Trans } from '@lingui/react';
import { userAttrLabelIds, userAttrOptionIds } from '../../../../i18n/userAttributes';

type PersonalInfoProps = {
  userInfo: User;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PersonalInfo: React.FC<PersonalInfoProps> = ({ userInfo, handleChange }) => {
  return (
    <div className="flex w-full flex-col gap-4 sm:gap-5">
      <TextField
        fullWidth
        select
        label={<Trans id={userAttrLabelIds.gender} message="Gender" />}
        name="gender"
        variant="outlined"
        required
        value={userInfo.gender}
        onChange={handleChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'white',
            transition: 'all 0.2s',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
          },
        }}
      >
        {genderOptions.map((option) => (
          <MenuItem key={option} value={option}>
            <Trans id={userAttrOptionIds.genders[option as Genders]} message={option} />
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        select
        label={<Trans id={userAttrLabelIds.nationality} message="Nationality" />}
        name="nationality"
        variant="outlined"
        value={userInfo.nationality}
        onChange={handleChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'white',
            transition: 'all 0.2s',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
          },
        }}
      >
        {nationalityOptions.map((option) => (
          <MenuItem key={option} value={option}>
            <Trans id={userAttrOptionIds.nationalities[option as Nationalities]} message={option} />
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        select
        label={<Trans id={userAttrLabelIds.city} message="City" />}
        name="city"
        variant="outlined"
        value={userInfo.city}
        onChange={handleChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'white',
            transition: 'all 0.2s',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
          },
        }}
      >
        {cityOptions.map((option) => (
          <MenuItem key={option} value={option}>
            <Trans id={userAttrOptionIds.cities[option as Cities]} message={option} />
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        select
        label={<Trans id={userAttrLabelIds.preferredLanguage} message="Preferred Language" />}
        name="preferredLanguage"
        variant="outlined"
        value={userInfo.preferredLanguage}
        onChange={handleChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'white',
            transition: 'all 0.2s',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
          },
        }}
      >
        {languageOptions.map((option) => (
          <MenuItem key={option} value={option}>
            <Trans
              id={userAttrOptionIds.languages[option as Languages]}
              message={
                {
                  en: 'English',
                  zh_CN: '简体中文',
                  zh_TW: '繁體中文',
                  ja: '日本語',
                  ko: '한국어',
                }[option as Languages]
              }
            />
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default PersonalInfo;
