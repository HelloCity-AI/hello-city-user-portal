import React from 'react';
import type { User } from '@/types/User.types';
import { Autocomplete, MenuItem, TextField } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import type { Genders, Nationalities, Cities, Languages } from '@/enums/UserAttributes';
import {
  genderOptions,
  cityOptions,
  nationalityOptions,
  languageOptions,
} from '@/enums/UserAttributes';
import { Trans } from '@lingui/react';
import { userAttrLabelIds, userAttrOptionIds } from '../../../../i18n/userAttributes';

type PersonalInfoProps = {
  userInfo: User;
  onFieldChange: (name: keyof User, value: string) => void;
};

const PersonalInfo: React.FC<PersonalInfoProps> = ({ userInfo, onFieldChange }) => {
  const cityFilterOptions = createFilterOptions<string>({
    matchFrom: 'any',
    trim: true,
  });

  const handleTextChange = (name: keyof User) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onFieldChange(name, e.target.value);

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
        onChange={handleTextChange('gender')}
        size="small"
      >
        {genderOptions.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.4 }}
          >
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
        onChange={handleTextChange('nationality')}
        size="small"
        SelectProps={{
          MenuProps: {
            disablePortal: true,
            anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
            transformOrigin: { vertical: 'top', horizontal: 'left' },
            PaperProps: {
              sx: {
                width: '100%',
                maxWidth: 400,
              },
            },
            MenuListProps: {
              sx: {
                maxHeight: 280,
                overflowY: 'auto',
              },
            },
          },
        }}
      >
        {nationalityOptions.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.4 }}
          >
            <Trans id={userAttrOptionIds.nationalities[option as Nationalities]} message={option} />
          </MenuItem>
        ))}
      </TextField>

      <Autocomplete
        freeSolo
        disablePortal
        options={cityOptions}
        filterOptions={cityFilterOptions}
        value={userInfo.city || ''}
        inputValue={userInfo.city || ''}
        onInputChange={(_, newValue) => onFieldChange('city', newValue ?? '')}
        slotProps={{
          popper: { placement: 'bottom-start', modifiers: [{ name: 'flip', enabled: false }] },
          paper: { sx: { width: '100%', maxWidth: 400 } },
          listbox: { sx: { maxHeight: 280, overflowY: 'auto' } },
        }}
        renderOption={(props, option) => (
          <li {...props} style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
            {userAttrOptionIds.cities[option as Cities] ? (
              <Trans id={userAttrOptionIds.cities[option as Cities]} message={option} />
            ) : (
              option
            )}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label={<Trans id={userAttrLabelIds.city} message="City" />}
            name="city"
            variant="outlined"
            size="small"
            helperText=" "
          />
        )}
      />

      <TextField
        fullWidth
        select
        label={<Trans id={userAttrLabelIds.preferredLanguage} message="Preferred Language" />}
        name="preferredLanguage"
        variant="outlined"
        value={userInfo.preferredLanguage}
        onChange={handleTextChange('preferredLanguage')}
        size="small"
      >
        {languageOptions.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.4 }}
          >
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
