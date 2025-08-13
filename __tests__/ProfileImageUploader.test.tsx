import React from 'react';

import type { ImageProps } from 'next/image'
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import ProfileImageUploader from '../src/components/ProfileImageUploader';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImageProps) => {
    const { src, alt, ...rest } = props;
    return <img src={typeof src ==='string' ? src : ''} alt={alt} {...rest} />;
  }
}));

jest.mock('@mui/material/styles', () => ({
    ...jest.requireActual('@mui/material/styles'),
        useTheme: () => ({
            backgroundGradients: {
                buttonPrimaryActive: 'mock-gradient',
            },
        }),
}));

const uploadFile = (file: File) => {
        const input = screen.getByLabelText(/Add Profile Picture/i)
        fireEvent.change(input, {target: {files: [file]}})
    }

describe('ProfileImageUploader',()=>{

    beforeEach(()=>{
            jest.clearAllMocks()
    })

    beforeAll(()=>{
            global.URL.createObjectURL = jest.fn(()=>'mock-url')
    })

    describe('UX responses test',()=>{
        test('Default image testing ', ()=>{
            render(<ProfileImageUploader/>)
            const defaultImg = screen.getByAltText('Default Avatar')
            expect(defaultImg).toHaveAttribute('src', '/images/default-avatar.jpg')
            expect(defaultImg).toHaveClass(
                'border-2',
                'border-indigo-600',
                'rounded-xl'
            )
        })

        test('Testing uploads an image file, show preview and remove photos', async ()=>{
            render(<ProfileImageUploader/>)
            uploadFile(new File(['fakeFile'], 'avatar.png', {type: 'image/png'}))

            expect(await screen.findByText(/The image is uploading .../i)).toBeInTheDocument()
            expect(screen.getByRole('progressbar')).toBeInTheDocument()

            const previewImage = await screen.findByAltText(/Profile Image Preview/i, undefined, { timeout: 4000 })
            expect(screen.getByText(/The image is uploaded/i)).toBeInTheDocument()
            expect(previewImage).toHaveAttribute('src', 'mock-url')
            expect(previewImage).toHaveClass(
                'w-32',
                'h-32',
                'object-cover',
                'border-2',
                'border-indigo-600',
                'rounded-xl'
            )

            const removeButton = screen.getByRole('button',{name: /Remove Photos/i})
            fireEvent.click(removeButton)
            
            expect(screen.getByAltText('Default Avatar')).toHaveAttribute('src', '/images/default-avatar.jpg')
            expect(screen.queryByText(/The image is uploaded/i)).not.toBeInTheDocument()
        })

        test('Testing error message throw for invalid file - excceding 5MB', async()=>{
            render(<ProfileImageUploader/>)
            uploadFile(new File(['F'.repeat(6*1024*1024)], 'largeFile.png', {type:'image/png'}))

            expect(await screen.findByText('Invalid File size or type. Please upload an image file under 5MB')).toBeInTheDocument()
        })

        test('Testing error message throw for invalid file - invalid type', async()=>{
            render(<ProfileImageUploader />)
            uploadFile(new File(['textFile'], 'textFile.txt',{type:'text/plain'}))
            expect(await screen.findByText('Invalid File size or type. Please upload an image file under 5MB')).toBeInTheDocument()
        })
    })
    
    describe('Container className test',()=>{
        test('ClassName on the outermost div', ()=>{
            const { container } = render(<ProfileImageUploader/>)
            const outerDiv = container.firstChild as HTMLElement

            expect(outerDiv).toHaveClass(
                'flex',
                'flex-col',  
                'items-center',
                'justify-center',
                'border-2',
                'rounded-xl',
                'max-w-96',
                'min-w-[40dvw]'
            )
        })

        test('ClassName on container wrapping add & remove button',()=>{
            render(<ProfileImageUploader/>)
            const uploadButton = screen.getByText(/Add Profile Picture/i)
            const buttonDiv = uploadButton.parentElement as HTMLElement

            expect(buttonDiv).toHaveClass(
                'flex',
                'justify-center',
                'flex-wrap',
                'w-4/5'
            )
        })
    })
})
