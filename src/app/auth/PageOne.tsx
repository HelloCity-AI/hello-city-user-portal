import { TextField } from '@mui/material';
import type { User } from '@/types/User.types';

type PageOneProps = {
  formData: User;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PageOne: React.FC<PageOneProps> = ({ formData, handleChange }) => {
  return (
    <div className="flex w-[50%] flex-col justify-around gap-2">
      <TextField
        label="UserName"
        name="username"
        variant="outlined"
        required
        value={formData.username}
        onChange={handleChange}
      />
      <TextField
        label="Email"
        name="email"
        variant="outlined"
        required
        value={formData.email}
        onChange={handleChange}
      />
      <TextField
        label="Password"
        name="password"
        variant="outlined"
        required
        type="password"
        value={formData.password}
        onChange={handleChange}
      />
      <TextField
        label="Confirm Password"
        name="confirmPassword"
        variant="outlined"
        required
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
    </div>
  );
};

export default PageOne;
