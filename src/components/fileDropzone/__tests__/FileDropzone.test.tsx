import { describe, it, expect, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import userEvent from '@testing-library/user-event'

import { FileDropzone, type FileDropzoneHandle } from '../FileDropzone'

const csv = (name = 'items.csv') =>
  new File(['a,b'], name, { type: 'text/csv' })

describe('FileDropzone', () => {
  it('shows the label, the template bar and the idle prompt', async () => {
    const onDownloadTemplate = vi.fn()
    render(
      <FileDropzone
        status="idle"
        label="Upload items"
        onDownloadTemplate={onDownloadTemplate}
        onFileSelected={vi.fn()}
      />
    )
    expect(screen.getByText('Upload items')).toBeInTheDocument()
    expect(screen.getByText('Upload CSV')).toBeInTheDocument()
    expect(
      screen.getByText('Structure your file according to the provided template')
    ).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: /Download Template/ })
    )
    expect(onDownloadTemplate).toHaveBeenCalledOnce()
  })

  it('passes a picked file to onFileSelected', async () => {
    const onFileSelected = vi.fn()
    render(<FileDropzone status="idle" onFileSelected={onFileSelected} />)
    await userEvent.upload(screen.getByTestId('file-dropzone-input'), csv())
    expect(onFileSelected).toHaveBeenCalledWith(expect.any(File))
  })

  it('refuses a dropped file of the wrong type', () => {
    const onFileSelected = vi.fn()
    render(<FileDropzone status="idle" onFileSelected={onFileSelected} />)
    fireEvent.drop(screen.getByRole('button', { name: 'Upload CSV file' }), {
      dataTransfer: { files: [new File(['x'], 'notes.txt')] },
    })
    expect(onFileSelected).not.toHaveBeenCalled()
    expect(screen.getByText('Only CSV files are supported')).toBeInTheDocument()
  })

  it('shows the uploaded file, the extra content and Replace', () => {
    render(
      <FileDropzone
        status="success"
        fileName="items.csv"
        successExtra={<span>12 rows</span>}
        onFileSelected={vi.fn()}
      />
    )
    expect(screen.getByText('File Uploaded')).toBeInTheDocument()
    expect(screen.getByText('items')).toBeInTheDocument()
    expect(screen.getByText('12 rows')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Replace' })).toBeInTheDocument()
  })

  it('confirms before replacing an uploaded file', async () => {
    const user = userEvent.setup()
    render(
      <FileDropzone
        status="success"
        fileName="items.csv"
        replaceConfirm="This overwrites your current file."
        onFileSelected={vi.fn()}
      />
    )
    await user.click(screen.getByRole('button', { name: 'Replace' }))
    expect(screen.getByText('Replace this file?')).toBeInTheDocument()
    expect(
      screen.getByText('This overwrites your current file.')
    ).toBeInTheDocument()
  })

  it('confirms a drop onto an uploaded file, then accepts it', async () => {
    const onFileSelected = vi.fn()
    render(
      <FileDropzone
        status="success"
        fileName="items.csv"
        replaceConfirm="This overwrites your current file."
        onFileSelected={onFileSelected}
      />
    )
    fireEvent.drop(screen.getByRole('button', { name: 'Upload CSV file' }), {
      dataTransfer: { files: [csv('new.csv')] },
    })
    expect(onFileSelected).not.toHaveBeenCalled()
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Replace' }).slice(-1)[0]
    )
    expect(onFileSelected).toHaveBeenCalledOnce()
  })

  it('confirms when an upload exists but the dropzone looks idle', async () => {
    const handle = createRef<FileDropzoneHandle>()
    render(
      <FileDropzone
        status="idle"
        hasExistingUpload
        replaceConfirm="This overwrites your current file."
        onFileSelected={vi.fn()}
        handleRef={handle}
      />
    )
    act(() => handle.current?.requestUpload())
    expect(await screen.findByText('Replace this file?')).toBeInTheDocument()
  })

  it('shows the row-error banner with View & Fix Issues', async () => {
    const onViewIssues = vi.fn()
    render(
      <FileDropzone
        status="success-with-errors"
        fileName="items.csv"
        errorRowCount={4}
        onViewIssues={onViewIssues}
        onFileSelected={vi.fn()}
      />
    )
    expect(screen.getByText('4 rows will not be ingested')).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: /View & Fix Issues/ })
    )
    expect(onViewIssues).toHaveBeenCalledOnce()
  })

  it('does nothing while disabled', async () => {
    const onFileSelected = vi.fn()
    render(
      <FileDropzone
        status="idle"
        uploadDisabled
        onFileSelected={onFileSelected}
      />
    )
    expect(
      screen.getByRole('button', { name: 'Upload CSV file' })
    ).toHaveAttribute('aria-disabled', 'true')
    expect(
      screen.getByRole('button', { name: /Download Template/ })
    ).toBeDisabled()
  })
  it('cancels a drop while disabled, so the browser does not open the file', () => {
    const onFileSelected = vi.fn()
    render(
      <FileDropzone
        status="idle"
        uploadDisabled
        onFileSelected={onFileSelected}
      />
    )
    const notCancelled = fireEvent.drop(
      screen.getByRole('button', { name: 'Upload CSV file' }),
      { dataTransfer: { files: [csv()] } }
    )
    expect(notCancelled).toBe(false)
    expect(onFileSelected).not.toHaveBeenCalled()
  })

  it('cancels a drop while a file is being checked', () => {
    const onFileSelected = vi.fn()
    render(<FileDropzone status="validating" onFileSelected={onFileSelected} />)
    const notCancelled = fireEvent.drop(
      screen.getByRole('button', { name: 'Upload CSV file' }),
      { dataTransfer: { files: [csv()] } }
    )
    expect(notCancelled).toBe(false)
    expect(onFileSelected).not.toHaveBeenCalled()
  })

  it('does not offer the template link while disabled', () => {
    render(
      <FileDropzone
        status="idle"
        uploadDisabled
        templateUrl="/template.csv"
        onFileSelected={vi.fn()}
      />
    )
    expect(screen.queryByRole('link', { name: /Download Template/ })).toBeNull()
    expect(
      screen.getByRole('button', { name: /Download Template/ })
    ).toBeDisabled()
  })

  it('offers the template link when enabled', () => {
    render(
      <FileDropzone
        status="idle"
        templateUrl="/template.csv"
        onFileSelected={vi.fn()}
      />
    )
    expect(
      screen.getByRole('link', { name: /Download Template/ })
    ).toHaveAttribute('href', '/template.csv')
  })
})
