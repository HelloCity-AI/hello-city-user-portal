import { TextField } from '@mui/material';
import type { User } from '@/types/User.types';

type PageOneProps = {
  formData: User;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PageOne: React.FC<PageOneProps> = ({ formData, handleChange }) => {
  return (
    <div className="flex w-full flex-col justify-center gap-4 px-2">
      <TextField
        fullWidth
        label="UserName"
        name="username"
        variant="outlined"
        required
        value={formData.username}
        onChange={handleChange}
        size="small"
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        variant="outlined"
        required
        value={formData.email}
        onChange={handleChange}
        size="small"
      />
      <TextField
        fullWidth
        label="Password"
        name="password"
        variant="outlined"
        required
        type="password"
        value={formData.password}
        onChange={handleChange}
        size="small"
      />
      <TextField
        fullWidth
        label="Confirm Password"
        name="confirmPassword"
        variant="outlined"
        required
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        size="small"
      />
    </div>
  );
};

export default PageOne;
