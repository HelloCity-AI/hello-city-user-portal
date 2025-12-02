import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import ProfileImageUploader from '../src/components/ProfileImageUploader';

const uploadFile = (file: File) => {
  const input = screen.getByLabelText(/Add Profile Picture/i);
  fireEvent.change(input, { target: { files: [file] } });
};

describe('ProfileImageUploader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<ProfileImageUploader selectedImage={jest.fn()} />);
  });

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
  });

  describe('UX responses test', () => {
    test('Default image testing ', () => {
      const defaultImg = screen.getByAltText('Default Avatar');
      expect(defaultImg).toHaveAttribute('src', '/images/default-avatar.jpg');
    });

    test('Testing uploads an image file, show preview and remove photos', async () => {
      uploadFile(new File(['fakeFile'], 'avatar.png', { type: 'image/png' }));
      // expect(await screen.findByText(/The image is uploading .../i)).toBeInTheDocument();
      // expect(screen.getByRole('progressbar')).toBeInTheDocument();
      const previewImage = await screen.findByAltText(/Profile Image Preview/i, undefined, {
        timeout: 4000,
      });
      // expect(screen.getByText(/The image is uploaded/i)).toBeInTheDocument();
      expect(previewImage).toHaveAttribute('src', 'mock-url');

      const removeButton = screen.getByRole('button', { name: /Remove Picture/i });
      fireEvent.click(removeButton);

      expect(screen.getByAltText('Default Avatar')).toHaveAttribute(
        'src',
        '/images/default-avatar.jpg',
      );
      // expect(screen.queryByText(/The image is uploaded/i)).not.toBeInTheDocument();
    });

    test('Testing error message throw for invalid file - excceding 5MB', async () => {
      uploadFile(new File(['F'.repeat(6 * 1024 * 1024)], 'largeFile.png', { type: 'image/png' }));

      expect(
        await screen.findByText('Invalid File size or type. Please upload an image file under 5MB'),
      ).toBeInTheDocument();
    });

    test('Testing error message throw for invalid file - invalid type', async () => {
      uploadFile(new File(['textFile'], 'textFile.txt', { type: 'text/plain' }));
      expect(
        await screen.findByText('Invalid File size or type. Please upload an image file under 5MB'),
      ).toBeInTheDocument();
    });
  });

  describe('Container className test', () => {
    test('ClassName on the outermost div', () => {
      const { container } = render(<ProfileImageUploader selectedImage={jest.fn()} />);
      const outerDiv = container.firstChild as HTMLElement;

      expect(outerDiv).toHaveClass(
        'flex',
        'w-full',
        'max-w-[38rem]',
        'flex-col',
        'items-center',
        'justify-center',
        'gap-6',
        'rounded-2xl',
        'border-2',
        'border-gray-200',
        'bg-gradient-to-br',
        'from-white',
        'to-gray-50',
        'p-8',
        'shadow-lg',
      );
    });

    test('ClassName on container wrapping add & remove button', () => {
      const uploadButton = screen.getByText(/Add Profile Picture/i);

      expect(uploadButton.closest('div')).toHaveClass('flex', 'items-center', 'gap-1.5');
    });

    test('Image tag className', async () => {
      expect(screen.getByAltText('Default Avatar')).toHaveClass(
        'relative',
        'h-[120px]',
        'w-[120px]',
        'rounded-full',
        'border-4',
        'border-white',
        'object-cover',
        'shadow-2xl',
        'ring-4',
        'ring-blue-100',
      );

      uploadFile(new File(['fakeFile'], 'avatar.png', { type: 'image/png' }));

      const previewImage = await screen.findByAltText(/Profile Image Preview/i, undefined, {
        timeout: 4000,
      });
      expect(previewImage).toHaveClass(
        'relative',
        'h-[120px]',
        'w-[120px]',
        'rounded-full',
        'border-4',
        'border-white',
        'object-cover',
        'shadow-2xl',
        'ring-4',
        'ring-blue-100',
      );
    });
  });
});
