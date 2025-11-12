import React, { useMemo } from 'react';
import type { User } from '@/types/User.types';
import { MenuItem, TextField } from '@mui/material';
import type { Genders, Nationalities, Cities, Languages } from '@/enums/UserAttributes';
import {
  genderOptions,
  cityOptions,
  nationalityOptions,
  languageOptions,
  getCitiesByCountry,
} from '@/enums/UserAttributes';
import { Trans } from '@lingui/react';
import { userAttrLabelIds, userAttrOptionIds } from '../../../../i18n/userAttributes';

type PersonalInfoProps = {
  userInfo: User;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PersonalInfo: React.FC<PersonalInfoProps> = ({ userInfo, handleChange }) => {
  // Filter cities based on selected nationality
  const filteredCityOptions = useMemo(() => {
    if (!userInfo.nationality) {
      return cityOptions; // Show all cities if no nationality selected
    }
    return getCitiesByCountry(userInfo.nationality);
  }, [userInfo.nationality]);

  return (
    <div className="flex w-full flex-col gap-3 px-2 sm:gap-4">
      <TextField
        fullWidth
        select
        label={<Trans id={userAttrLabelIds.gender} message="Gender" />}
        name="gender"
        variant="outlined"
        required
        value={userInfo.gender}
        onChange={handleChange}
        size="small"
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
        size="small"
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
        size="small"
        disabled={!userInfo.nationality}
        helperText={
          !userInfo.nationality ? (
            <Trans id="profile.select-nationality-first" message="Please select nationality first" />
          ) : null
        }
      >
        {filteredCityOptions.map((option) => (
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
        size="small"
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
