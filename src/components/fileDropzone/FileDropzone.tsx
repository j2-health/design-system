import {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react'
import cx from 'classnames'
import {
  CheckCircleIcon,
  DownloadSimpleIcon,
  FileCsvIcon,
  UploadSimpleIcon,
} from '@phosphor-icons/react'

import { Button } from '../button'
import { Modal } from '../modal'
import { Spinner } from '../spinner'

export type FileDropzoneStatus =
  | 'idle'
  /** The file is being checked; the dropzone shows a spinner. */
  | 'validating'
  /** A file-level failure: the dropzone returns to its idle prompt and the
   *  caller shows the details (usually in a results dialog). */
  | 'file-error'
  /** Required columns are missing; `missingHeaders` names them. */
  | 'header-error'
  | 'success'
  /** Uploaded, with rows that will not be ingested (`errorRowCount`). */
  | 'success-with-errors'
  /** Uploaded, with rows to review (`warningRowCount`). */
  | 'success-with-warnings'

/** Lets a caller start an upload from outside the dropzone, such as a results
 *  dialog's Re-upload. It goes through the same replace confirm as a click. */
export type FileDropzoneHandle = { requestUpload: () => void }

export type FileDropzoneProps = {
  status: FileDropzoneStatus
  /** Shown in a chip once a file is uploaded. */
  fileName?: string | null
  /** Bold label above the Download Template bar. Omit when the caller renders
   *  its own section header. */
  label?: ReactNode
  /** Accepted file extension, for the picker and the drag-and-drop guard. */
  accept?: string
  errorRowCount?: number
  warningRowCount?: number
  missingHeaders?: string[]
  /** Static template URL for an `<a download>`. */
  templateUrl?: string
  /** Generates the template at runtime; takes precedence over `templateUrl`. */
  onDownloadTemplate?: () => void
  /** Greys out the template bar and the dropzone, e.g. until a choice the
   *  upload depends on has been made. */
  uploadDisabled?: boolean
  onFileSelected: (file: File) => void
  /** Opens the caller's results dialog from an error or warning banner. */
  onViewIssues?: () => void
  /** A request that failed before the file was checked, shown under the
   *  dropzone. */
  errorMessage?: ReactNode
  /** Body of a blocking "Replace this file?" confirm. When set and a file
   *  already exists, every attempt to upload (click, Replace, keyboard or a
   *  drop) asks first. When omitted, uploads proceed with no confirm. */
  replaceConfirm?: ReactNode
  /** True when a stored upload would be replaced even though the dropzone
   *  looks idle. Defaults to the visible uploaded state. */
  hasExistingUpload?: boolean
  /** Read-only content in the uploaded state, between the file name and the
   *  Replace link (a summary of what the file holds). Clicks inside it do not
   *  start a replace. */
  successExtra?: ReactNode
  handleRef?: Ref<FileDropzoneHandle>
  className?: string
}

function ViewIssuesButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button
      type="link"
      size="small"
      className="h-auto p-0 text-sm font-medium"
      onClick={(event) => {
        event.stopPropagation()
        onClick?.()
      }}
    >
      View &amp; Fix Issues
    </Button>
  )
}

/**
 * A file upload: an optional label, a full-width Download Template bar, and a
 * dashed dropzone that shows the prompt, a spinner while the file is checked,
 * or the uploaded file with a Replace link. Error and warning banners tuck
 * under the dropzone. Click, keyboard or drag and drop all upload; with
 * `replaceConfirm` set, replacing an existing file asks first.
 *
 * Presentational: the caller checks the file and passes the result back as
 * `status` and the counts.
 */
export function FileDropzone({
  status,
  fileName,
  label,
  accept = '.csv',
  errorRowCount,
  warningRowCount,
  missingHeaders,
  templateUrl,
  onDownloadTemplate,
  uploadDisabled = false,
  onFileSelected,
  onViewIssues,
  errorMessage,
  replaceConfirm,
  hasExistingUpload = false,
  successExtra,
  handleRef,
  className,
}: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragError, setDragError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  // A file dropped onto an uploaded dropzone waits here until the confirm
  // resolves; a picker request leaves it null.
  const pendingDropRef = useRef<File | null>(null)

  const isUploading = status === 'validating'
  const hasHeaderError = status === 'header-error'
  const hasRowErrors = status === 'success-with-errors'
  const hasRowWarnings = status === 'success-with-warnings'
  const isUploaded = status === 'success' || hasRowErrors || hasRowWarnings

  const disabled = uploadDisabled || isUploading
  const acceptLabel = accept.replace(/^\./, '').toUpperCase()
  // The first upload overwrites nothing, so only a replace asks first.
  const needsReplaceConfirm =
    Boolean(replaceConfirm) && (isUploaded || hasExistingUpload)

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) return
      setDragError(null)
      onFileSelected(file)
    },
    [onFileSelected]
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0] ?? null)
    event.target.value = ''
  }

  const openPicker = () => fileInputRef.current?.click()

  // Every upload attempt routes through here, so a replace always confirms.
  const requestUpload = () => {
    if (disabled) return
    if (needsReplaceConfirm) {
      pendingDropRef.current = null
      setConfirmOpen(true)
      return
    }
    openPicker()
  }

  useImperativeHandle(handleRef, () => ({ requestUpload }))

  const confirmReplace = () => {
    setConfirmOpen(false)
    const droppedFile = pendingDropRef.current
    pendingDropRef.current = null
    if (droppedFile) handleFile(droppedFile)
    else openPicker()
  }

  const cancelReplace = () => {
    pendingDropRef.current = null
    setConfirmOpen(false)
  }

  // Drag events are always cancelled, even while disabled: otherwise the
  // browser's own drop opens the file in place of the page.
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (!disabled) setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)
    if (disabled) return
    const file = event.dataTransfer.files?.[0] ?? null
    if (!file) return
    if (!file.name.toLowerCase().endsWith(accept.toLowerCase())) {
      setDragError(`Only ${acceptLabel} files are supported`)
      return
    }
    setDragError(null)
    // Dropping onto an existing upload is still a replace: confirm first.
    if (needsReplaceConfirm) {
      pendingDropRef.current = file
      setConfirmOpen(true)
      return
    }
    handleFile(file)
  }

  const templateClass = cx(
    'mt-2 flex w-full items-center justify-center gap-2 rounded-j2 border-0 bg-j2-gray-3 px-4 py-1.5 text-sm text-j2-primary no-underline transition-colors',
    uploadDisabled
      ? 'cursor-not-allowed opacity-60'
      : 'cursor-pointer hover:bg-j2-gray-4'
  )

  // While disabled, the URL form renders as the disabled button too, so the
  // template can't be downloaded before the upload is available.
  const templateBar =
    onDownloadTemplate || !templateUrl || uploadDisabled ? (
      <button
        type="button"
        disabled={uploadDisabled || !onDownloadTemplate}
        onClick={onDownloadTemplate}
        className={templateClass}
      >
        <DownloadSimpleIcon size={16} weight="regular" />
        Download Template
      </button>
    ) : (
      <a href={templateUrl} download className={templateClass}>
        <DownloadSimpleIcon size={16} weight="regular" />
        Download Template
      </a>
    )

  const renderContent = () => {
    if (isUploading) {
      return (
        <div className="flex flex-col items-center gap-2 py-4">
          <Spinner size={32} />
          <p className="m-0 text-sm text-j2-text-secondary">Checking file...</p>
        </div>
      )
    }

    if (fileName && isUploaded) {
      return (
        <div className="flex flex-col items-center gap-4 py-8">
          <CheckCircleIcon
            size={32}
            weight="regular"
            className="text-j2-green-9"
          />
          <div className="flex flex-col items-center gap-1">
            <p className="m-0 text-base font-normal text-j2-text">
              File Uploaded
            </p>
            <span className="inline-flex items-center gap-1 rounded-j2-sm border border-solid border-j2-border px-2 py-1 text-xs text-j2-text">
              <FileCsvIcon size={14} weight="regular" />
              {fileName.replace(new RegExp(`\\${accept}$`, 'i'), '')}
            </span>
          </div>
          {successExtra && (
            // Read-only content, not part of the click-to-replace target.
            <div
              className="flex w-full cursor-default justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              {successExtra}
            </div>
          )}
          <button
            type="button"
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation()
              requestUpload()
            }}
            className={cx(
              'border-none bg-transparent p-0 text-sm font-medium',
              disabled
                ? 'cursor-not-allowed text-j2-text-tertiary'
                : 'cursor-pointer text-j2-blue-10 hover:underline'
            )}
          >
            Replace
          </button>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <UploadSimpleIcon
          size={32}
          weight="regular"
          className="text-j2-blue-9"
        />
        <div className="flex flex-col items-center gap-1">
          <p className="m-0 text-base font-normal text-j2-text">
            Upload {acceptLabel}
          </p>
          <p className="m-0 text-sm text-j2-text-secondary">
            Structure your file according to the provided template
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-sm font-semibold">{label}</label>
      )}

      {templateBar}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        data-testid="file-dropzone-input"
      />

      <div
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
        aria-label={`Upload ${acceptLabel} file`}
        onClick={disabled ? undefined : requestUpload}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            if (!disabled) requestUpload()
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cx(
          'mt-2 rounded-j2-lg border-2 border-dashed transition-colors',
          isDragOver
            ? 'border-j2-blue-7 bg-j2-blue-2'
            : cx(
                'border-j2-gray-6 bg-j2-gray-1',
                !disabled && 'hover:border-j2-gray-8'
              ),
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        )}
      >
        {renderContent()}
      </div>

      {hasHeaderError && (missingHeaders?.length ?? 0) > 0 && (
        <div className="mx-4 flex items-start justify-between gap-3 rounded-b-xl border-x border-b border-solid border-j2-error bg-j2-red-2 px-3 py-2 text-sm">
          <div>
            <span className="font-medium text-j2-primary">
              Missing required{' '}
              {missingHeaders!.length === 1 ? 'column' : 'columns'}:{' '}
              {missingHeaders!.map((header) => `"${header}"`).join(', ')}
            </span>
            <p className="m-0 text-xs text-j2-text-secondary">
              Header names are case-sensitive. Add the missing{' '}
              {missingHeaders!.length === 1 ? 'column' : 'columns'} and
              re-upload.
            </p>
          </div>
        </div>
      )}

      {hasRowErrors && (errorRowCount ?? 0) > 0 && (
        <div className="mx-4 flex items-center justify-between rounded-b-xl border-x border-b border-solid border-j2-error bg-j2-red-2 px-3 py-2 text-sm">
          <span className="font-medium text-j2-primary">
            {errorRowCount!.toLocaleString()}{' '}
            {errorRowCount === 1 ? 'row' : 'rows'} will not be ingested
          </span>
          <ViewIssuesButton onClick={onViewIssues} />
        </div>
      )}

      {hasRowWarnings && (
        <div className="mx-4 flex items-center justify-between rounded-b-xl border-x border-b border-solid border-j2-warning bg-j2-warning-bg px-3 py-2 text-sm">
          <span className="font-medium text-j2-primary">
            {(warningRowCount ?? 0) > 0
              ? `${warningRowCount!.toLocaleString()} ${
                  warningRowCount === 1 ? 'row has' : 'rows have'
                } warnings`
              : 'This file has warnings'}
          </span>
          <ViewIssuesButton onClick={onViewIssues} />
        </div>
      )}

      {(dragError || errorMessage) && (
        <p className="m-0 mt-1 text-xs text-j2-error">
          {dragError || errorMessage}
        </p>
      )}

      {replaceConfirm && (
        <Modal
          open={confirmOpen}
          width={460}
          title="Replace this file?"
          onCancel={cancelReplace}
          footer={null}
        >
          <div className="text-sm text-j2-text">{replaceConfirm}</div>
          <div className="mt-6 flex justify-end gap-2">
            <Button onClick={cancelReplace}>Cancel</Button>
            <Button type="primary" onClick={confirmReplace}>
              Replace
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
