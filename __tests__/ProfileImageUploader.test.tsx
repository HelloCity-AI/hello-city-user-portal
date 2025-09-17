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
  });

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
  });

  describe('UX responses test', () => {
    test('Default image testing ', () => {
      render(<ProfileImageUploader selectedImage={jest.fn()}/>);
      const defaultImg = screen.getByAltText('Default Avatar');
      expect(defaultImg).toHaveAttribute('src', '/images/default-avatar.jpg');
    });

    test('Testing uploads an image file, show preview and remove photos', async () => {
      render(<ProfileImageUploader selectedImage={jest.fn()}/>);
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
      render(<ProfileImageUploader selectedImage={jest.fn()}/>);
      uploadFile(new File(['F'.repeat(6 * 1024 * 1024)], 'largeFile.png', { type: 'image/png' }));

      expect(
        await screen.findByText('Invalid File size or type. Please upload an image file under 5MB'),
      ).toBeInTheDocument();
    });

    test('Testing error message throw for invalid file - invalid type', async () => {
      render(<ProfileImageUploader selectedImage={jest.fn()}/>);
      uploadFile(new File(['textFile'], 'textFile.txt', { type: 'text/plain' }));
      expect(
        await screen.findByText('Invalid File size or type. Please upload an image file under 5MB'),
      ).toBeInTheDocument();
    });
  });

  describe('Container className test', () => {
    test('ClassName on the outermost div', () => {
      const { container } = render(<ProfileImageUploader selectedImage={jest.fn()}/>);
      const outerDiv = container.firstChild as HTMLElement;

      expect(outerDiv).toHaveClass(
        'flex',
        'min-w-[35rem]',
        'flex-col',
        'items-center',
        'justify-center',
        'gap-4',
        'rounded-xl',
        'border-2',
        'pb-4',
      );
    });

    test('ClassName on container wrapping add & remove button', () => {
      render(<ProfileImageUploader selectedImage={jest.fn()}/>);
      const uploadButton = screen.getByText(/Add Profile Picture/i);

      expect(uploadButton.closest('div')).toHaveClass(
        'flex',
        'w-4/5',
        'flex-wrap',
        'justify-center',
      );
    });

    test('Image tag className', async () => {
      render(<ProfileImageUploader selectedImage={jest.fn()}/>);
      expect(screen.getByAltText('Default Avatar')).toHaveClass(
        'h-[150px]',
        'w-[150px]',
        'rounded-xl',
        'border-2',
        'border-indigo-600',
        'object-cover',
      );

      uploadFile(new File(['fakeFile'], 'avatar.png', { type: 'image/png' }));

      const previewImage = await screen.findByAltText(/Profile Image Preview/i, undefined, {
        timeout: 4000,
      });
      expect(previewImage).toHaveClass(
        'h-[150px]',
        'w-[150px]',
        'rounded-xl',
        'border-2',
        'border-indigo-600',
        'object-cover',
      );
    });
  });
});
